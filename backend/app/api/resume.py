from fastapi import APIRouter
from app.models import ResumeRequest
from app.services.resume_service import resume_suggestions

router = APIRouter(tags=["Resume"])


@router.post("/resume-suggestions")
def suggestions(data: ResumeRequest):
    return resume_suggestions(data)
