from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pdfplumber

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://localhost:\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Backend Running"}

@app.post("/extract-text")
async def extract_text(file: UploadFile = File(...)):
    text = ""

    with pdfplumber.open(file.file) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()

            if page_text:
                text += page_text + "\n"

    return {"text": text}


class ATSRequest(BaseModel):
    resume_text: str
    job_description: str


@app.post("/ats-score")
def ats_score(data: ATSRequest):

    skills = [
        "python",
        "java",
        "c++",
        "sql",
        "aws",
        "machine learning",
        "deep learning",
        "communication",
        "problem solving",
        "cloud",
        "react",
        "javascript",
        "html",
        "css",
        "git",
        "github",
        "docker",
        "kubernetes",
        "tensorflow",
        "pytorch"
    ]

    resume_text = data.resume_text.lower()
    jd_text = data.job_description.lower()

    required_skills = []
    matched_skills = []
    missing_skills = []

    for skill in skills:
        if skill in jd_text:
            required_skills.append(skill)

            if skill in resume_text:
                matched_skills.append(skill)
            else:
                missing_skills.append(skill)

    if len(required_skills) == 0:
        score = 0
    else:
        score = round((len(matched_skills) / len(required_skills)) * 100, 2)

    return {
        "ats_score": score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills
    }


@app.post("/suggestions")
def suggestions(data: ATSRequest):

    suggestions = []

    resume_text = data.resume_text.lower()
    jd_text = data.job_description.lower()

    if "sql" in jd_text and "sql" not in resume_text:
        suggestions.append("Add SQL projects or database experience.")

    if "docker" in jd_text and "docker" not in resume_text:
        suggestions.append("Add Docker experience or containerization projects.")

    if "kubernetes" in jd_text and "kubernetes" not in resume_text:
        suggestions.append("Add Kubernetes or deployment experience.")

    if "communication" in jd_text:
        suggestions.append("Highlight teamwork and communication skills.")

    if "aws" in jd_text:
        suggestions.append("Mention cloud deployment achievements.")

    if len(suggestions) == 0:
        suggestions.append(
            "Your resume matches the job description well. Add measurable achievements to make it stronger."
        )

    return {
        "suggestions": suggestions
    }
