from fastapi import APIRouter
from app.models import ATSRequest
from app.services.ats_service import analyze_resume

router = APIRouter(tags=["ATS"])


@router.post("/ats-score")
def ats_score(data: ATSRequest):
    return analyze_resume(data)
