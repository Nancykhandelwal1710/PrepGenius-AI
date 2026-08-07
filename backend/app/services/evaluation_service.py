from app.prompts.evaluation_prompt import get_evaluation_prompt
from app.services.gemini_service import generate_json


def evaluate_answer(data):

    prompt = get_evaluation_prompt(
        data.question,
        data.answer
    )

    result = generate_json(prompt)

    return {
        "score": result.get("score", 0),

        "feedback": {
            "feedback": result.get("feedback", ""),
            "technical_accuracy": result.get("technical_accuracy", 0),
            "completeness": result.get("completeness", 0),
            "communication": result.get("communication", 0),
            "confidence": result.get("confidence", 0),
            "practical_example": result.get("practical_example", 0),
            "conciseness": result.get("conciseness", 0),
            "strengths": result.get("strengths", []),
            "weaknesses": result.get("weaknesses", []),
            "verdict": result.get("verdict", ""),
            "ideal_answer": result.get("ideal_answer", ""),
            "followup_question": result.get("followup_question", "")
        },

        "improvements": result.get("improvements", [])
    }
