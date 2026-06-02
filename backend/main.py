from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pdfplumber
import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
print("Gemini Key:", GEMINI_API_KEY)

client = genai.Client(api_key=GEMINI_API_KEY)

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


class InterviewRequest(BaseModel):
    role: str
    resume_text: str = ""
    job_description: str = ""


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


@app.post("/generate-interview-questions")
def generate_interview_questions(data: InterviewRequest):

    try:
        prompt = f"""
You are an interview coach.

Generate exactly 5 interview questions for this candidate.

Role:
{data.role}

Resume:
{data.resume_text[:2000]}

Job Description:
{data.job_description[:2000]}

Rules:
- Return only the questions.
- Number them from 1 to 5.
- Make questions practical and interview-style.
- Include technical, project-based, and HR questions.
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        questions_text = response.text

        questions = []
        for line in questions_text.split("\n"):
            line = line.strip()
            if line:
                line = (
                    line.replace("1.", "")
                    .replace("2.", "")
                    .replace("3.", "")
                    .replace("4.", "")
                    .replace("5.", "")
                    .strip()
                )
                questions.append(line)

        return {
            "questions": questions[:5]
        }

    except Exception as e:
        return {
            "error": str(e)
        }
    
class AnswerEvaluationRequest(BaseModel):
    question: str
    answer: str


@app.post("/evaluate-answer")
def evaluate_answer(data: AnswerEvaluationRequest):

    try:
        prompt = f"""
You are an expert interview evaluator.

Evaluate the candidate's answer.

Question:
{data.question}

Candidate Answer:
{data.answer}

Return the response in this exact format:

Score: <number out of 10>

Feedback:
<short feedback>

Improvements:
- <improvement 1>
- <improvement 2>
- <improvement 3>
"""

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )

        return {
            "evaluation": response.text
        }

    except Exception as e:
        return {
            "error": str(e)
        }
    