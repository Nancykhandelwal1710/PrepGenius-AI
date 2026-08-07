from app.prompts.interview_prompt import get_interview_prompt
from app.services.gemini_service import generate_text


def generate_questions(data):

    prompt = get_interview_prompt(
        data.role,
        data.resume_text,
        data.job_description
    )

    text = generate_text(prompt)

    questions = []

    for line in text.split("\n"):

        line = line.strip()

        if not line:
            continue

        for i in range(1, 6):
            line = line.replace(f"{i}.", "").strip()

        questions.append(line)

    return {
        "questions": questions[:5]
    }
