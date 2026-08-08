import json
import re
import time

from google import genai

from app.config import GEMINI_API_KEY


client = genai.Client(
    api_key=GEMINI_API_KEY
)


MODELS = [
    "gemini-2.5-flash",
]


def generate_with_fallback(prompt, config=None):

    last_error = None

    for model in MODELS:

        for attempt in range(3):

            try:

                print(
                    f"Trying {model}..."
                )

                response = client.models.generate_content(
                    model=model,
                    contents=prompt,
                    config=config or {},
                )

                return response

            except Exception as error:

                last_error = error

                error_text = str(error)

                print(
                    f"{model} attempt {attempt + 1} failed:"
                )

                print(error_text)

                # Retry temporary availability errors.
                if (
                    "503" in error_text
                    or "UNAVAILABLE" in error_text
                ):

                    if attempt < 2:

                        wait_time = (
                            2 ** attempt
                        )

                        print(
                            f"Retrying in {wait_time} seconds..."
                        )

                        time.sleep(
                            wait_time
                        )

                        continue

                # Retry temporary rate-limit errors
                # only a small number of times.
                if (
                    "429" in error_text
                    or "RESOURCE_EXHAUSTED"
                    in error_text
                ):

                    if attempt < 2:

                        wait_time = (
                            2 ** attempt
                        )

                        print(
                            f"Rate limited. "
                            f"Retrying in {wait_time} seconds..."
                        )

                        time.sleep(
                            wait_time
                        )

                        continue

                raise error

    if last_error:

        raise last_error

    raise Exception(
        "No Gemini model is available."
    )


def generate_json(prompt):

    response = generate_with_fallback(
        prompt,
        {
            "response_mime_type":
                "application/json"
        }
    )

    raw_text = (
        response.text or ""
    ).strip()

    print(
        "GEMINI RAW JSON RESPONSE:"
    )

    print(raw_text)

    # Remove Markdown code fences.
    raw_text = re.sub(
        r"^```(?:json)?\s*",
        "",
        raw_text,
        flags=re.IGNORECASE
    )

    raw_text = re.sub(
        r"\s*```$",
        "",
        raw_text
    ).strip()

    # First attempt: direct JSON parsing.
    try:

        result = json.loads(
            raw_text
        )

        if not isinstance(
            result,
            dict
        ):

            raise ValueError(
                "Gemini JSON response "
                "is not an object."
            )

        return result

    except json.JSONDecodeError:

        pass

    # Second attempt: extract JSON object.
    match = re.search(
        r"\{[\s\S]*\}",
        raw_text
    )

    if match:

        json_text = match.group(0)

        try:

            result = json.loads(
                json_text
            )

            if not isinstance(
                result,
                dict
            ):

                raise ValueError(
                    "Gemini JSON response "
                    "is not an object."
                )

            return result

        except json.JSONDecodeError as error:

            print(
                "JSON extraction failed:",
                error
            )

    raise ValueError(
        "Gemini returned invalid JSON."
    )


def generate_text(prompt):

    response = generate_with_fallback(
        prompt
    )

    return response.text
