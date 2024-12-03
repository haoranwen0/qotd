# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

import json
import os
import random
import re
import requests
from datetime import date, timedelta
from typing import Dict

from dotenv import load_dotenv
from jsonschema import validate
from firebase_admin import auth, credentials, firestore, initialize_app
from firebase_functions import https_fn


load_dotenv()

IS_EMULATOR = os.environ.get('FUNCTIONS_EMULATOR') == 'true'

# Initialize Firebase Admin SDK
# cred = credentials.ApplicationDefault()
cred = credentials.Certificate(
    "secrets/qotd-ed903-firebase-adminsdk-egyxa-4abe1f461a.json"
)
initialize_app(cred)

db = firestore.client()


"""
DB setup:

Questions/question_id:
    question: str
    day: str
    answer_ids: list[str]
Answers/answer_id:
    answer: str
    day: str (can extract question_id from this)
    user_id: str
    comment_ids: list[str]
    reaction_ids: list[str]
Thoughts/thought_id:
    thought: str
    day: str
    user_id: str
Users/user_id:
    day_to_answer_id: dict[day, answer_id]
    day_to_thought_id: dict[day, thought_id]
    comment_ids: list[str]
    reaction_ids: list[str]
Comments/comment_id:
    comment: str
    user_id: str
    answer_id: str
Reactions/reaction_id:
    reaction: str
    user_id: str
    answer_id: str
"""

# project_schema = {
#     "type": "object",
#     "properties": {
#         "name": {"type": "string"},
#         "code": {"type": "string"},
#         "framework": {"type": "string"},
#     },
# }

# def requires_auth(f):
#   @wraps(f)
#   def decorated_function(*args, **kwargs):
#     uid = current_uid.get()
#     if uid is None:
#       return functions.https.HttpResponse('Unauthorized', status=401)
#     return f(*args, **kwargs)
#   return decorated_function


def get_headers():
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "3600",
    }
    return headers


def router(request):
    if request.method == "OPTIONS":
        return https_fn.Response("", status=204, headers=get_headers())

    path = request.path
    method = request.method

    # Define your routes with dynamic segments
    routes = [
        {
            "pattern": r"^/qotd/(?P<day>[^/]+)$",
            "methods": {"GET": get_qotd, "POST": answer_qotd},
        },
        {
            "pattern": r"^/tie_answer_to_user/(?P<day>[^/]+)$",
            "methods": {"POST": tie_answer_to_user},
        },
        {
            "pattern": r"^/thought/(?P<day>[^/]+)$",
            "methods": {"GET": get_thought, "PUT": update_thought},
        },
        {
            "pattern": r"^/specific_answer/(?P<day>[^/]+)$",
            "methods": {
                "GET": get_answer_for_user_specific_day,
            },
        },
        {"pattern": r"^/days_answered$", "methods": {"GET": get_days_answered}},
        {"pattern": r"^/answer_ids_for_question/(?P<day>[^/]+)$", "methods": {"GET": get_answer_ids_for_question}},
        {"pattern": r"^/answers_for_answer_ids$", "methods": {"POST": get_answers_for_answer_ids}},
        {"pattern": r"^/test/(?P<uid>[^/]+)$", "methods": {"GET": get_test_user}},
        # {
        #   "pattern": r"^/api/products/(?P<product_id>\w+)$",
        #   "methods": {
        #     "GET": get_product,
        #     "PUT": update_product,
        #     "DELETE": delete_product
        #   }
        # }
    ]

    # Find matching route
    for route in routes:
        match = re.match(route["pattern"], path)
        if match:
            if method in route["methods"]:
                # Extract parameters from the URL
                params = match.groupdict()
                # Call the appropriate function with parameters
                return route["methods"][method](request, **params)
            else:
                return https_fn.Response("Method not allowed", status=405)

    return https_fn.Response("Not found", status=404)


@https_fn.on_request()
def main(req: https_fn.Request) -> https_fn.Response:
    if req.method == "OPTIONS":
        return https_fn.Response("", status=204, headers=get_headers())

    return router(req)


def get_qotd(req: https_fn.Request, day: str) -> https_fn.Response:
    # format for day is: YYYY-MM-DD
    question_doc_ref = db.collection("questions").document(day)
    question_doc = question_doc_ref.get()
    if not question_doc.exists:
        return https_fn.Response("Question not found", status=404)
    question = question_doc.get("question")
    return https_fn.Response(json.dumps({"question": question, "day": day}), status=200, headers=get_headers())


def answer_qotd(req: https_fn.Request, day: str) -> https_fn.Response:
    yesterday = str(date.today() - timedelta(days=1))
    today = str(date.today())
    tomorrow = str(date.today() + timedelta(days=1))
    if day not in (yesterday, today, tomorrow):
        return https_fn.Response("Invalid day", status=400, headers=get_headers())

    answer = req.json["answer"]

    # Make sure question exists
    question_doc_ref = db.collection("questions").document(day)
    question_doc = question_doc_ref.get()
    if not question_doc.exists:
        return https_fn.Response("Question not found", status=404)
    
    # Add to answers
    _, answer_doc_ref = db.collection("answers").add({"answer": answer, "day": day})
    # Add to question answer_ids
    question_doc_ref.update({"answer_ids": firestore.ArrayUnion([answer_doc_ref.id])})

    # If user is logged in then add to user's answer_ids and add user_id to answer
    try:
        uid = get_uid(req.headers)
        # Add to user's answer_ids
        user_doc_ref = db.collection("users").document(uid)
        user_doc = user_doc_ref.get()
        if not user_doc.exists:
            user_doc_ref.set({"day_to_answer_id": {day: answer_doc_ref.id}})
        else:
            user_doc_ref.update({f"day_to_answer_id.`{day}`": answer_doc_ref.id})
        # Add user_id to answer
        answer_doc_ref.update({"user_id": uid})
    except https_fn.HttpsError:
        pass

    return https_fn.Response(json.dumps({"answer_id": answer_doc_ref.id}), status=200, headers=get_headers())


# This endpoint is called when a user signs up immediately after answering the QOTD
def tie_answer_to_user(req: https_fn.Request, day: str):
    uid = get_uid(req.headers)
    answer_id = req.json["answer_id"]

    # Make sure answer exists
    answer_doc_ref = db.collection("answers").document(answer_id)
    answer_doc = answer_doc_ref.get()
    if not answer_doc.exists:
        return https_fn.Response("Answer not found", status=404, headers=get_headers())
    # Make sure answer belongs to this day
    if answer_doc.get("day") != day:
        return https_fn.Response("Answer does not belong to this day", status=400, headers=get_headers())
    # Make sure answer doesn't already belong to a user
    try:
        answer_doc.get("user_id")
        return https_fn.Response("Answer already belongs to a user", status=400, headers=get_headers())
    except KeyError:
        pass
    
    # Put user_id in answer doc
    answer_doc_ref.update({"user_id": uid})

    # Put answer_id in user's day_to_answer_id
    user_doc_ref = db.collection("users").document(uid)
    user_doc = user_doc_ref.get()
    if not user_doc.exists:
        user_doc_ref.set({"day_to_answer_id": {day: answer_doc_ref.id}})
    else:
        user_doc_ref.update({f"day_to_answer_id.`{day}`": answer_doc_ref.id})

    return https_fn.Response(json.dumps({"message": "Answer tied to user"}), status=200, headers=get_headers())


def get_thought(req: https_fn.Request, day: str) -> https_fn.Response:
    # format for day is: YYYY-MM-DD
    uid = get_uid(req.headers)
    user_doc_ref = db.collection("users").document(uid)
    user_doc = user_doc_ref.get()

    try:
        thought_id = user_doc.get(f"day_to_thought_id.`{day}`")
    except KeyError:
        thought_id = None
    if not thought_id:
        return https_fn.Response("Thought not found", status=404)

    thought_doc_ref = db.collection("thoughts").document(thought_id)
    thought_doc = thought_doc_ref.get()
    return https_fn.Response(json.dumps({"thought": thought_doc.get("thought")}), status=200, headers=get_headers())


def update_thought(req: https_fn.Request, day: str) -> https_fn.Response:
    thought = req.json["thought"]

    # Need to be signed in to update thought
    uid = get_uid(req.headers)
    user_doc_ref = db.collection("users").document(uid)
    user_doc = user_doc_ref.get()

    # Case 1: user doesn't exist yet
    if not user_doc.exists:
        _, thought_doc_ref = db.collection("thoughts").add({"thought": thought, "day": day, "user_id": uid})
        user_doc_ref.set({f"day_to_thought_id.`{day}`": thought_doc_ref.id})
        print("got through set")
        return https_fn.Response(json.dumps({"thought_id": thought_doc_ref.id}), status=200, headers=get_headers())
    # Case 2: user exists and already has a thought for this day
    try:
        thought_id = user_doc.get(f"day_to_thought_id.`{day}`")
        print("got through get")
        thought_doc_ref = db.collection("thoughts").document(thought_id)
        thought_doc_ref.update({"thought": thought})
    # Case 3: user exists but doesn't have a thought for this day yet
    except KeyError:
        _, thought_doc_ref = db.collection("thoughts").add({"thought": thought, "day": day, "user_id": uid})
        user_doc_ref.update({f"day_to_thought_id.`{day}`": thought_doc_ref.id})
        print("got through update")
    return https_fn.Response(json.dumps({"thought_id": thought_doc_ref.id}), status=200, headers=get_headers())


# This is only called when a user signs up immediately AFTER they have answered the QOTD
def update_answer_after_signup(req: https_fn.Request) -> https_fn.Response:
    answer_id = req.json["answer_id"]
    answer_doc_ref = db.collection("answers").document(answer_id)
    answer_doc = answer_doc_ref.get()
    if not answer_doc.exists:
        return https_fn.Response("Answer not found", status=404)
    day = answer_doc.get("day")

    uid = get_uid(req.headers)
    # Add to user's answer_ids
    user_doc_ref = db.collection("users").document(uid)
    user_doc = user_doc_ref.get()
    if not user_doc.exists:
        user_doc_ref.set({"day_to_answer_id": {day: answer_doc_ref.id}})
    else:
        user_doc_ref.update({f"day_to_answer_id.`{day}`": answer_doc_ref.id})
    # Add user_id to answer
    answer_doc_ref.update({"user_id": uid})

    return https_fn.Response(json.dumps({"message": "Answer data updated"}), status=200, headers=get_headers())


def get_days_answered(req: https_fn.Request) -> https_fn.Response:
    uid = get_uid(req.headers)
    user_doc_ref = db.collection("users").document(uid)
    user_doc = user_doc_ref.get()
    try:
        day_to_answer_id = user_doc.get("day_to_answer_id") or {}
    except KeyError:
        day_to_answer_id = {}
    return https_fn.Response(json.dumps(list(day_to_answer_id.keys())), status=200, headers=get_headers())


def get_answer_for_user_specific_day(req: https_fn.Request, day: str) -> https_fn.Response:
    uid = get_uid(req.headers)
    user_doc_ref = db.collection("users").document(uid)
    user_doc = user_doc_ref.get()
    try:
        answer_id = user_doc.get(f"day_to_answer_id.`{day}`")
    except KeyError:
        answer_id = None
    if not answer_id:
        return https_fn.Response("Answer not found", status=404, headers=get_headers())
    answer_doc_ref = db.collection("answers").document(answer_id)
    answer_doc = answer_doc_ref.get()
    return https_fn.Response(json.dumps({"answer": answer_doc.get("answer")}), status=200, headers=get_headers())


def get_all_answers_for_user(req: https_fn.Request) -> https_fn.Response:
    uid = get_uid(req.headers)
    user_doc_ref = db.collection("users").document(uid)
    user_doc = user_doc_ref.get()
    
    try:
        day_to_answer_id = user_doc.get("day_to_answer_id") or {}
    except KeyError:
        day_to_answer_id = {}
    rtn = []
    for answer_id in day_to_answer_id.values():
        answer_doc_ref = db.collection("answers").document(answer_id)
        answer_doc = answer_doc_ref.get()
        rtn.append({"day": answer_doc.get("day"), "answer": answer_doc.get("answer")})
    return https_fn.Response(json.dumps(rtn), status=200, headers=get_headers())


# Get answer_ids for a specific question/day
def get_answer_ids_for_question(req: https_fn.Request, day: str) -> https_fn.Response:
    question_doc_ref = db.collection("questions").document(day)
    question_doc = question_doc_ref.get()
    if not question_doc.exists:
        return https_fn.Response("Question not found", status=404, headers=get_headers())

    answer_ids = question_doc.get("answer_ids")
    num_samples = min(100, len(answer_ids))
    rtn = random.sample(answer_ids, num_samples)
    return https_fn.Response(json.dumps(rtn), status=200, headers=get_headers())


# Get actual answers corresponding to answer_ids
def get_answers_for_answer_ids(req: https_fn.Request) -> https_fn.Response:
    answer_ids = req.json["answer_ids"]
    rtn = []
    for answer_id in answer_ids:
        answer_doc_ref = db.collection("answers").document(answer_id)
        answer_doc = answer_doc_ref.get()
        rtn.append(answer_doc.get("answer"))

    print(f"Got answers for {answer_ids}: {rtn}")
    return https_fn.Response(json.dumps(rtn), status=200, headers=get_headers())


def get_uid(header: Dict[str, str]) -> str:
    """
    Verifies the token using Firebase Auth.
    """
    if "Authorization" not in header:
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            "No authorization token provided",
        )

    token = header["Authorization"].split(" ")[1]
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token["uid"]
    except auth.InvalidIdTokenError:
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.UNAUTHENTICATED, "Unauthorized"
        )


def get_test_user(req: https_fn.Request, uid: str) -> https_fn.Response:
    def create_custom_token(uid):
        try:
            return auth.create_custom_token(uid)
        except Exception as e:
            print(f"Error creating custom token: {e}")
            return None

    # Generate a custom token
    custom_token = create_custom_token(uid).decode("utf-8")

    def exchange_custom_token_for_id_token(custom_token):
        url = f"http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=fake-api-key"
        data = {"token": custom_token, "returnSecureToken": True}
        response = requests.post(url, json=data)
        if response.status_code == 200:
            return response.json()["idToken"]
        else:
            print(f"Error exchanging custom token: {response.text}")
            return None

    # Exchange the custom token for an ID token
    id_token = exchange_custom_token_for_id_token(custom_token)
    return https_fn.Response(id_token)
