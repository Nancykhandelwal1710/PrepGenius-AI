from app.prompts.ats_prompt import get_ats_prompt
from app.services.gemini_service import generate_json


def analyze_resume(data):

    prompt = get_ats_prompt(
        data.resume_text,
        data.job_description
    )

    result = generate_json(prompt)

    return {
        "job_domain": result.get("job_domain", "Unknown"),
        "experience_level": result.get("experience_level", "Unknown"),
        "ats_score": result.get("ats_score", 0),
        "required_skills": result.get("required_skills", []),
        "matched_skills": result.get("matched_skills", []),
        "missing_skills": result.get("missing_skills", [])
    }
