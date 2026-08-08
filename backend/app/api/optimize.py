from fastapi import APIRouter, UploadFile, File, Form

from app.services.optimize_service import optimize_docx, optimize_pdf

router = APIRouter(tags=["Optimizer"])


@router.post("/optimize-docx")
async def optimize_docx_route(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    return await optimize_docx(file, job_description)


@router.post("/optimize-pdf")
async def optimize_pdf_route(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    return await optimize_pdf(file, job_description)
