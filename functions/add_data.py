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

# # Initialize Firebase Admin SDK
# # cred = credentials.ApplicationDefault()
cred = credentials.Certificate(
    "secrets/qotd-ed903-firebase-adminsdk-egyxa-4abe1f461a.json"
)
initialize_app(cred)

db = firestore.client()


questions = {
    "2024-12-14": "What is the capital of France?",
    "2024-12-15": "What is the capital of Germany?",
    "2024-12-16": "What is the capital of Italy?",
}
for day, question in questions.items():
    question_doc_ref = db.collection("questions").document(day)
    question_doc_ref.set({"question": question})

