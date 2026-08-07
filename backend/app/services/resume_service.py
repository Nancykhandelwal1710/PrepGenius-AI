from app.prompts.resume_prompt import get_resume_prompt
from app.services.gemini_service import generate_json


def resume_suggestions(data):

    prompt = get_resume_prompt(
        data.resume_text,
        data.job_description
    )

    return generate_json(prompt)
