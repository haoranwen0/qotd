# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

import json
import os
import re
import requests
from datetime import date
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
Users/user_id:
    day_to_answer_id: dict[day, answer_id]
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

project_schema = {
    "type": "object",
    "properties": {
        "name": {"type": "string"},
        "code": {"type": "string"},
        "framework": {"type": "string"},
    },
}

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
            "pattern": r"^/projects$",
            "methods": {"GET": list_projects, "POST": create_project},
        },
        {
            "pattern": r"^/project/(?P<projectid>[^/]+)$",
            "methods": {
                "GET": get_project,
                "PUT": update_project,
                "PATCH": update_code,
                # "DELETE": delete_project
            },
        },
        {"pattern": r"^/chat/(?P<projectid>[^/]+)$", "methods": {"POST": chat}},
        {
            "pattern": r"^/history/(?P<projectid>[^/]+)$",
            "methods": {"GET": get_chat_history},
        },
        {"pattern": r"^/usage$", "methods": {"GET": get_api_count}},
        {"pattern": r"^/checkout$", "methods": {"POST": create_checkout_session}},
        {"pattern": r"^/webhook$", "methods": {"POST": stripe_webhook_handler}},
        {"pattern": r"^/test$", "methods": {"GET": get_test_user}},
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


def get_qotd(req: https_fn.Request) -> https_fn.Response:
    today = str(date.today())
    # year, month, day = today.year, today.month, today.day
    question_doc_ref = db.collection("questions").document(today)
    question_doc = question_doc_ref.get()
    if not question_doc.exists:
        return https_fn.Response("Question not found", status=404)
    question = question_doc.get("question")
    return https_fn.Response({"question": question, "day": today}, status=200, headers=get_headers())


def answer_qotd(req: https_fn.Request) -> https_fn.Response:
    answer = req.json["answer"]
    day = req.json["day"]
    # Add to answers
    _, answer_doc_ref = db.collection("answers").add({"answer": answer, "day": day})
    # If user is logged in then add to user's answer_ids and add user_id to answer
    try:
        uid = get_uid(req.headers)
        # Add to user's answer_ids
        user_doc_ref = db.collection("users").document(uid)
        user_doc = user_doc_ref.get()
        if not user_doc.exists:
            user_doc_ref.set({"day_to_answer_id": {day: answer_doc_ref.id}})
        else:
            user_doc_ref.update({f"day_to_answer_id.{day}": answer_doc_ref.id})
        # Add user_id to answer
        answer_doc_ref.update({"user_id": uid})
    except https_fn.HttpsError:
        pass

    # Add to question answer_ids
    question_doc_ref = db.collection("questions").document(day)
    question_doc = question_doc_ref.get()
    if not question_doc.exists:
        return https_fn.Response("Question not found", status=404)
    question_doc_ref.update({"answer_ids": firestore.ArrayUnion([answer_doc_ref.id])})

    return https_fn.Response(json.dumps({"message": "Answer submitted"}), status=200, headers=get_headers())


def get_answer_for_user_specific_day(req: https_fn.Request, day: str) -> https_fn.Response:
    uid = get_uid(req.headers)
    user_doc_ref = db.collection("users").document(uid)
    user_doc = user_doc_ref.get()
    answer_id = user_doc.get(f"day_to_answer_id.{day}")
    answer_doc_ref = db.collection("answers").document(answer_id)
    answer_doc = answer_doc_ref.get()
    return https_fn.Response(json.dumps({"answer": answer_doc.get("answer")}), status=200, headers=get_headers())


def get_all_answers_for_user(req: https_fn.Request) -> https_fn.Response:
    uid = get_uid(req.headers)
    user_doc_ref = db.collection("users").document(uid)
    user_doc = user_doc_ref.get()
    rtn = []
    for answer_id in user_doc.get("day_to_answer_id", {}).values():
        answer_doc_ref = db.collection("answers").document(answer_id)
        answer_doc = answer_doc_ref.get()
        rtn.append({"day": answer_doc.get("day"), "answer": answer_doc.get("answer")})
    return https_fn.Response(json.dumps(rtn), status=200, headers=get_headers())


def get_answers_for_question(req: https_fn.Request, question_id: str) -> https_fn.Response:
    pass


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


def get_test_user(req: https_fn.Request) -> https_fn.Response:
    def create_custom_token(uid):
        try:
            return auth.create_custom_token(uid)
        except Exception as e:
            print(f"Error creating custom token: {e}")
            return None

    uid = req.json["uid"]
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
