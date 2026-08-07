from pydantic import BaseModel


class ATSRequest(BaseModel):
    resume_text: str
    job_description: str


class ResumeRequest(BaseModel):
    resume_text: str
    job_description: str


class InterviewRequest(BaseModel):
    role: str
    resume_text: str
    job_description: str


class AnswerEvaluationRequest(BaseModel):
    question: str
    answer: str


class ResumeTailorRequest(BaseModel):
    resume_text: str
    job_description: str
    