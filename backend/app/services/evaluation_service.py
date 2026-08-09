from app.prompts.evaluation_prompt import get_evaluation_prompt
from app.services.openrouter_service import generate_json


def evaluate_answer(data):
    prompt = get_evaluation_prompt(
        data.question,
        data.answer
    )

    result = generate_json(prompt)

    # Gemini returns category scores on these scales:
    # Technical Accuracy: 0-4
    # Completeness: 0-2
    # Communication: 0-2
    # Confidence: 0-1
    # Practical Example: 0-1
    # Conciseness: 0-1
    #
    # Convert them deterministically to the 100-point system:
    # 40 + 20 + 15 + 10 + 10 + 5 = 100

    technical_accuracy = max(
        0, min(4, float(result.get("technical_accuracy", 0)))
    )

    completeness = max(
        0, min(2, float(result.get("completeness", 0)))
    )

    communication = max(
        0, min(2, float(result.get("communication", 0)))
    )

    confidence = max(
        0, min(1, float(result.get("confidence", 0)))
    )

    practical_example = max(
        0, min(1, float(result.get("practical_example", 0)))
    )

    conciseness = max(
        0, min(1, float(result.get("conciseness", 0)))
    )

    # Convert each category to its weighted contribution.
    technical_score = (technical_accuracy / 4) * 40
    completeness_score = (completeness / 2) * 20
    communication_score = (communication / 2) * 15
    confidence_score = confidence * 10
    practical_example_score = practical_example * 10
    conciseness_score = conciseness * 5

    # Calculate the final score ourselves.
    score = round(
        technical_score
        + completeness_score
        + communication_score
        + confidence_score
        + practical_example_score
        + conciseness_score
    )

    return {
        "score": score,

        "feedback": {
            "feedback": result.get("feedback", ""),
            "technical_accuracy": technical_accuracy,
            "completeness": completeness,
            "communication": communication,
            "confidence": confidence,
            "practical_example": practical_example,
            "conciseness": conciseness,
            "strengths": result.get("strengths", []),
            "weaknesses": result.get("weaknesses", []),
            "verdict": result.get("verdict", ""),
            "ideal_answer": result.get("ideal_answer", ""),
            "followup_question": result.get("followup_question", "")
        },

        "improvements": result.get("improvements", [])
    }
    