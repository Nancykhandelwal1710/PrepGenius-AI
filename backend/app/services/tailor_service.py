from app.prompts.tailor_prompt import get_tailor_prompt
from app.services.gemini_service import generate_json


def tailor_resume(data):

    prompt = get_tailor_prompt(
        data.resume_text,
        data.job_description
    )

    result = generate_json(prompt)

    return {
        "target_role": result.get("target_role", ""),

        "summary": result.get(
            "summary",
            {
                "original": "",
                "tailored": "",
                "reason": ""
            }
        ),

        "skills": result.get(
            "skills",
            {
                "original": [],
                "tailored": [],
                "reason": ""
            }
        ),

        "projects": result.get("projects", []),
        "experience": result.get("experience", []),
        "keywords": result.get("keywords", []),
        "missing_keywords": result.get("missing_keywords", []),
        "suggestions": result.get("suggestions", [])
    }
