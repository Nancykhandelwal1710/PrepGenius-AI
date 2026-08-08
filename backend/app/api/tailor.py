from fastapi import APIRouter

from app.models import ResumeTailorRequest
from app.services.tailor_service import tailor_resume

router = APIRouter(tags=["Resume Tailor"])


@router.post("/tailor-resume")
def tailor(data: ResumeTailorRequest):
    return tailor_resume(data)
