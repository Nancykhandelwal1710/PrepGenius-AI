from app.prompts.health_prompt import get_health_prompt
from app.services.gemini_service import generate_json


def resume_health(data):

    prompt = get_health_prompt(
        data.resume_text,
        data.job_description
    )

    return generate_json(prompt)
