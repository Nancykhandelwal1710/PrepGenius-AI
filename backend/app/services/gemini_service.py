import json
import time

from google import genai

from app.config import GEMINI_API_KEY

client = genai.Client(api_key=GEMINI_API_KEY)


MODELS = [
    "gemini-2.5-flash"
]


def generate_json(prompt):

    last_error = None

    for model in MODELS:

        for attempt in range(3):

            try:

                print(f"Trying {model}...")

                response = client.models.generate_content(
                    model=model,
                    contents=prompt,
                    config={
                        "response_mime_type": "application/json"
                    }
                )

                text = (
                    response.text
                    .replace("```json", "")
                    .replace("```", "")
                    .strip()
                )

                return json.loads(text)

            except Exception as e:

                print(e)

                last_error = e

                time.sleep(2)

    raise last_error


def generate_text(prompt):

    last_error = None

    for model in MODELS:

        for attempt in range(3):

            try:

                print(f"Trying {model}...")

                response = client.models.generate_content(
                    model=model,
                    contents=prompt
                )

                return response.text

            except Exception as e:

                print(e)

                last_error = e

                time.sleep(2)

    raise last_error
