from fastapi import APIRouter

from app.models import AnswerEvaluationRequest
from app.services.evaluation_service import evaluate_answer

router = APIRouter(tags=["Evaluation"])


@router.post("/evaluate-answer")
def evaluate(data: AnswerEvaluationRequest):

    return evaluate_answer(data)
