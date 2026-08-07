from fastapi import APIRouter
from app.models import ResumeRequest
from app.services.health_service import resume_health

router = APIRouter(tags=["Resume Health"])


@router.post("/resume-health")
def health(data: ResumeRequest):
    return resume_health(data)
