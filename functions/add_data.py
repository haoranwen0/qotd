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

emulator_host = "127.0.0.1"
emulator_port = 8080
if is_emulator_running(emulator_host, emulator_port):
    # Set the environment variable to connect to the emulator
    os.environ["FIRESTORE_EMULATOR_HOST"] = "127.0.0.1:8080"

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
    "2024-12-17": "What is the capital of Spain?",
}
for day, question in questions.items():
    question_doc_ref = db.collection("questions").document(day)
    question_doc_ref.set({"question": question})

