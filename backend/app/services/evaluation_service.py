from app.prompts.evaluation_prompt import get_evaluation_prompt
from app.services.gemini_service import generate_json


def clamp_score(value, maximum):
    try:
        value = int(value)
    except (TypeError, ValueError):
        value = 0

    return max(0, min(value, maximum))


def evaluate_answer(data):

    prompt = get_evaluation_prompt(
        data.question,
        data.answer
    )

    result = generate_json(prompt)

    print("\n========== EVALUATION RAW RESULT ==========")
    print(result)
    print("===========================================\n")

    technical_accuracy = clamp_score(
        result.get("technical_accuracy", 0),
        40
    )

    completeness = clamp_score(
        result.get("completeness", 0),
        20
    )

    communication = clamp_score(
        result.get("communication", 0),
        15
    )

    confidence = clamp_score(
        result.get("confidence", 0),
        10
    )

    practical_example = clamp_score(
        result.get("practical_example", 0),
        10
    )

    conciseness = clamp_score(
        result.get("conciseness", 0),
        5
    )

    # IMPORTANT:
    # Calculate the final score ourselves.
    # This prevents Gemini from returning a score
    # that contradicts the category scores.

    total_score = (
        technical_accuracy
        + completeness
        + communication
        + confidence
        + practical_example
        + conciseness
    )

    return {
        "score": total_score,

        "feedback": {
            "feedback": result.get("feedback", ""),

            "technical_accuracy":
                technical_accuracy,

            "completeness":
                completeness,

            "communication":
                communication,

            "confidence":
                confidence,

            "practical_example":
                practical_example,

            "conciseness":
                conciseness,

            "strengths":
                result.get("strengths", []),

            "weaknesses":
                result.get("weaknesses", []),

            "verdict":
                result.get("verdict", ""),

            "ideal_answer":
                result.get("ideal_answer", ""),

            "followup_question":
                result.get("followup_question", "")
        },

        "improvements":
            result.get("improvements", [])
    }
