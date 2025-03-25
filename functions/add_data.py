import json
import os
import random
import re
import requests
import socket
from datetime import date, timedelta
from typing import Dict

from dotenv import load_dotenv
from jsonschema import validate
from firebase_admin import auth, credentials, firestore, initialize_app
from firebase_functions import https_fn


load_dotenv()

def is_emulator_running(host, port):
    """Checks if a service is listening on the given host and port."""
    try:
        # Create a socket object
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            # Set a timeout for the connection attempt (e.g., 1 second)
            s.settimeout(1)
            # Try to connect
            s.connect((host, port))
        return True  # Connection successful
    except (socket.error, socket.timeout):
        return False  # Connection failed

# emulator_host = "127.0.0.1"
# emulator_port = 8080
# if is_emulator_running(emulator_host, emulator_port):
#     # Set the environment variable to connect to the emulator
#     os.environ["FIRESTORE_EMULATOR_HOST"] = "127.0.0.1:8080"

# print(">> FIRESTORE_EMULATOR_HOST:")
# print(os.environ["FIRESTORE_EMULATOR_HOST"])

# # Initialize Firebase Admin SDK
# # cred = credentials.ApplicationDefault()
cred = credentials.Certificate(
    "secrets/qotd-ed903-firebase-adminsdk-egyxa-54222ccd22.json"
)
initialize_app(cred)

db = firestore.client()

def get_questions(prompts_file_path: str) -> dict[str, str]:
    questions = {}
    current_date = date.today()
    with open(prompts_file_path, "r", encoding="utf-8") as f:
        for line in f:
            prompt = line.strip()
            if prompt:
                questions[current_date.isoformat()] = prompt
                current_date += timedelta(days=1)

    return questions

def add_questions(questions: dict[str, str]) -> None:
    try:
        print(">> Preparing to add questions...")
        for day, question in questions.items():
            question_doc_ref = db.collection("questions").document(day)
            doc = question_doc_ref.get()
            if not doc.exists:
                question_doc_ref.set({ "question": question, "day": day })
            else:
                print(f">> Question for {day} already exists")
    except Exception as e:
        print(">> Error adding questions:")
        print(e)
    else:
        print(">> Questions processed successfully!")

if __name__ == "__main__":
    questions = get_questions("./prompts/journal_prompts.txt")
    add_questions(questions)

