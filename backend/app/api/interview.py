from fastapi import APIRouter

from app.models import InterviewRequest
from app.services.interview_service import generate_questions

router = APIRouter(tags=["Interview"])


@router.post("/generate-interview-questions")
def interview(data: InterviewRequest):

    return generate_questions(data)
