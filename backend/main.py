from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pdfplumber
import os
import json
import re
import time
import random
from io import BytesIO
from pathlib import Path
from uuid import uuid4
from typing import Annotated
from docx import Document
from fastapi import File, Form, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from google import genai

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
print("Gemini Key:", GEMINI_API_KEY)

client = genai.Client(api_key=GEMINI_API_KEY)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://localhost:5174",
    "https://prepgenius-ai-career.vercel.app",
],
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

class ResumeTailorRequest(BaseModel):
    resume_text: str
    job_description: str

class InterviewRequest(BaseModel):
    role: str
    resume_text: str = ""
    job_description: str = ""

class ResumeHealthRequest(BaseModel):
    resume_text: str
    ats_score: int = 0
    matched_skills: list[str] = []
    missing_skills: list[str] = []

def fallback_ats_analysis(resume_text, job_description):
    jd_words = re.findall(r"\b[a-zA-Z][a-zA-Z+#. ]{2,}\b", job_description.lower())
    resume_lower = resume_text.lower()

    stop_words = {
        "we", "are", "hiring", "with", "and", "the", "for", "this", "that",
        "candidate", "job", "role", "must", "have", "should", "will", "our",
        "your", "you", "experience", "knowledge", "skills", "ability"
    }

    possible_skills = []

    skill_phrases = [
        "recruitment", "onboarding", "employee engagement", "communication",
        "payroll coordination", "hr policy", "performance management",
        "documentation", "conflict resolution", "ms excel", "excel",
        "python", "java", "c++", "sql", "machine learning", "deep learning",
        "aws", "cloud", "react", "javascript", "html", "css", "sales",
        "marketing", "seo", "finance", "accounting", "teaching",
        "classroom management", "lesson planning", "content writing",
        "project management", "leadership", "customer service"
    ]

    for skill in skill_phrases:
        if skill in job_description.lower():
            possible_skills.append(skill.title())

    possible_skills = list(dict.fromkeys(possible_skills))

    matched = []
    missing = []

    for skill in possible_skills:
        if skill.lower() in resume_lower:
            matched.append(skill)
        else:
            missing.append(skill)

    score = 0
    if len(possible_skills) > 0:
        score = round((len(matched) / len(possible_skills)) * 100, 2)

    jd_lower = job_description.lower()

    if "hr" in jd_lower or "recruitment" in jd_lower or "onboarding" in jd_lower:
        domain = "Human Resources"
    elif "marketing" in jd_lower or "seo" in jd_lower:
        domain = "Marketing"
    elif "finance" in jd_lower or "accounting" in jd_lower:
        domain = "Finance"
    elif "teacher" in jd_lower or "teaching" in jd_lower:
        domain = "Teaching"
    elif "python" in jd_lower or "machine learning" in jd_lower or "developer" in jd_lower:
        domain = "Technology"
    else:
        domain = "General"

    if "intern" in jd_lower or "fresher" in jd_lower or "entry" in jd_lower:
        level = "Entry Level"
    elif "senior" in jd_lower or "manager" in jd_lower:
        level = "Senior Level"
    else:
        level = "Mid/General Level"

    return {
        "job_domain": domain,
        "experience_level": level,
        "ats_score": score,
        "required_skills": possible_skills,
        "matched_skills": matched,
        "missing_skills": missing
    }
def collect_docx_text_locations(document: Document):
    locations = []

    for paragraph_index, paragraph in enumerate(document.paragraphs):
        text = paragraph.text.strip()

        if text:
            locations.append({
                "location_id": f"paragraph:{paragraph_index}",
                "kind": "paragraph",
                "text": text,
                "paragraph_index": paragraph_index,
            })

    for table_index, table in enumerate(document.tables):
        for row_index, row in enumerate(table.rows):
            for cell_index, cell in enumerate(row.cells):
                for paragraph_index, paragraph in enumerate(cell.paragraphs):
                    text = paragraph.text.strip()

                    if text:
                        locations.append({
                            "location_id": f"table:{table_index}:row:{row_index}:cell:{cell_index}:paragraph:{paragraph_index}",
                            "kind": "table_paragraph",
                            "text": text,
                            "table_index": table_index,
                            "row_index": row_index,
                            "cell_index": cell_index,
                            "paragraph_index": paragraph_index,
                        })

    return locations

def replace_paragraph_text_preserving_style(paragraph, new_text: str):
    if not paragraph.runs:
        paragraph.add_run(new_text)
        return

    paragraph.runs[0].text = new_text

    for run in paragraph.runs[1:]:
        run.text = ""


def get_docx_paragraph_by_location(document: Document, location: dict):
    if location["kind"] == "paragraph":
        return document.paragraphs[location["paragraph_index"]]

    if location["kind"] == "table_paragraph":
        table = document.tables[location["table_index"]]
        row = table.rows[location["row_index"]]
        cell = row.cells[location["cell_index"]]

        return cell.paragraphs[location["paragraph_index"]]

    raise ValueError("Unsupported DOCX text location.")

@app.post("/ats-score")
def ats_score(data: ATSRequest):
    print("ATS ROUTE HIT")
    print("NEW UNIVERSAL ATS FUNCTION RUNNING")

    try:
        prompt = f"""
You are an ATS analyzer for all industries.

Analyze this job description and resume.

JOB DESCRIPTION:
{data.job_description[:6000]}

RESUME:
{data.resume_text[:6000]}

You must extract skills from the JOB DESCRIPTION first.
Do not depend on any predefined skill list.

For this job description, identify:
1. job_domain
2. experience_level
3. required_skills from JD
4. matched_skills found in resume
5. missing_skills not found in resume
6. ats_score out of 100

Return ONLY raw JSON.
No markdown.
No explanation.

JSON format:
{{
  "job_domain": "",
  "experience_level": "",
  "ats_score": 0,
  "required_skills": [],
  "matched_skills": [],
  "missing_skills": []
}}
"""

        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=prompt
        )

        raw_text = response.text.strip()
        print("GEMINI RAW RESPONSE:", raw_text)

        raw_text = raw_text.replace("```json", "").replace("```", "").strip()

        json_match = re.search(r"\{.*\}", raw_text, re.DOTALL)

        if json_match:
            clean_json = json_match.group(0)
            result = json.loads(clean_json)
        else:
            raise Exception("Gemini did not return valid JSON")

        return {
            "job_domain": result.get("job_domain", "Unknown"),
            "experience_level": result.get("experience_level", "Unknown"),
            "ats_score": result.get("ats_score", 0),
            "required_skills": result.get("required_skills", []),
            "matched_skills": result.get("matched_skills", []),
            "missing_skills": result.get("missing_skills", [])
        }

    except Exception as e:
        print("ATS ERROR:", str(e))
        print("USING FALLBACK ATS ANALYSIS")

        return fallback_ats_analysis(data.resume_text, data.job_description)
    

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
            model="gemini-3.5-flash",
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
            model="gemini-3.5-flash",
            contents=prompt
        )

        return {
            "evaluation": response.text
        }

    except Exception as e:
        return {
            "error": str(e)
        }
@app.post("/tailor-resume")
def tailor_resume(data: ResumeTailorRequest):
    try:
        prompt = f"""
You are an expert ATS resume editor.

Your task is to compare the candidate's original resume with the job
description and produce honest, job-focused improvements.

STRICT RULES:
- Never invent skills.
- Never invent work experience.
- Never invent projects.
- Never invent certifications.
- Never invent achievements, percentages, numbers, or results.
- Only use facts already present in the original resume.
- Preserve the candidate's meaning.
- Keep writing concise and ATS-friendly.
- If a requirement is not supported by the resume, put it only inside
  "missing_keywords" or "suggestions".
- Do not add unsupported requirements to the tailored resume.

ORIGINAL RESUME:
{data.resume_text[:10000]}

TARGET JOB DESCRIPTION:
{data.job_description[:6000]}

Return ONLY valid JSON using this exact structure:

{{
  "target_role": "Role detected from the job description",

  "summary": {{
    "original": "Original professional summary found in the resume, or a short truthful summary of the existing resume content",
    "tailored": "Improved job-focused professional summary using only supported facts",
    "reason": "Short explanation of what was improved"
  }},

  "skills": {{
    "original": ["Skills already present in the resume"],
    "tailored": ["Relevant existing skills reordered for this job"],
    "reason": "Short explanation of why the skills were reordered"
  }},

  "projects": [
    {{
      "original": "Original project description or bullet",
      "tailored": "Improved project description using only existing facts",
      "reason": "Short explanation of the improvement"
    }}
  ],

  "experience": [
    {{
      "original": "Original experience description or bullet",
      "tailored": "Improved experience description using only existing facts",
      "reason": "Short explanation of the improvement"
    }}
  ],

  "keywords": [
    "Relevant keyword supported by both the resume and job description"
  ],

  "missing_keywords": [
    "Job requirement not supported by the original resume"
  ],

  "suggestions": [
    "Honest improvement that does not fabricate information"
  ]
}}
"""

        response = None
        last_error = None
        
        for attempt in range(4):
            try:
                response = client.models.generate_content( 
                    model="gemini-3.5-flash",
                    contents=prompt,
                    config={
                        "response_mime_type": "application/json"
                    }
                )
                break
            except Exception as error:
                last_error = error
                error_text = str(error)

                if "503" in error_text or "UNAVAILABLE" in error_text:
                    if attempt < 3:
                        wait_time = (2 ** attempt) + random.uniform(0, 1)
                        time.sleep(wait_time)
                        continue
                
                raise error
        if response is None:
            raise Exception(
                "Server is temporarily busy. Please try again after a minute."
            ) from last_error


        result = json.loads(response.text)

        summary = result.get("summary", {})
        skills = result.get("skills", {})

        return {
            "target_role": result.get("target_role", ""),

            "summary": {
                "original": summary.get("original", ""),
                "tailored": summary.get("tailored", ""),
                "reason": summary.get("reason", "")
            },

            "skills": {
                "original": skills.get("original", []),
                "tailored": skills.get("tailored", []),
                "reason": skills.get("reason", "")
            },

            "projects": result.get("projects", []),
            "experience": result.get("experience", []),
            "keywords": result.get("keywords", []),
            "missing_keywords": result.get("missing_keywords", []),
            "suggestions": result.get("suggestions", [])
        }

    except json.JSONDecodeError:
        return {
            "error": "The AI response was not valid JSON. Please try again."
        }

    except Exception as error:
        return {
            "error": str(error)
        }
@app.post("/extract-docx")
async def extract_docx(file: UploadFile = File(...)):
    filename = file.filename or ""

    if not filename.lower().endswith(".docx"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a DOCX file."
        )

    try:
        file_content = await file.read()

        if not file_content:
            raise HTTPException(
                status_code=400,
                detail="The uploaded file is empty."
            )

        document = Document(BytesIO(file_content))

        paragraphs = []

        for index, paragraph in enumerate(document.paragraphs):
            text = paragraph.text.strip()

            if text:
                paragraphs.append({
                    "index": index,
                    "text": text,
                    "style": paragraph.style.name
                    if paragraph.style
                    else "Normal",
                    "run_count": len(paragraph.runs),
                })

        tables = []

        for table_index, table in enumerate(document.tables):
            rows = []

            for row_index, row in enumerate(table.rows):
                cells = []

                for cell_index, cell in enumerate(row.cells):
                    cells.append({
                        "cell_index": cell_index,
                        "text": cell.text.strip(),
                    })

                rows.append({
                    "row_index": row_index,
                    "cells": cells,
                })

            tables.append({
                "table_index": table_index,
                "rows": rows,
            })

        full_text = []

        for item in paragraphs:
            full_text.append(item["text"])

        for table in tables:
            for row in table["rows"]:
                for cell in row["cells"]:
                    if cell["text"]:
                        full_text.append(cell["text"])

        return {
            "filename": filename,
            "paragraph_count": len(document.paragraphs),
            "non_empty_paragraph_count": len(paragraphs),
            "table_count": len(document.tables),
            "paragraphs": paragraphs,
            "tables": tables,
            "full_text": "\n".join(full_text),
        }

    except HTTPException:
        raise

    except Exception as error:
        print("DOCX extraction error:", error)

        raise HTTPException(
            status_code=500,
            detail="The DOCX file could not be read."
        )
    
@app.post("/resume-health")
async def resume_health(data: ResumeHealthRequest):

    text = data.resume_text.lower()

    # ---------- Summary ----------
    summary_score = 95 if len(text) > 600 else 75

    # ---------- Projects ----------
    project_keywords = [
        "project",
        "developed",
        "built",
        "implemented",
        "created",
    ]

    project_score = 70

    for word in project_keywords:
        if word in text:
            project_score += 5

    project_score = min(project_score, 100)

    # ---------- Skills ----------
    total = len(data.matched_skills) + len(data.missing_skills)

    if total == 0:
        skills_score = 70
    else:
        skills_score = int(
            len(data.matched_skills) / total * 100
        )

    # ---------- Action Verbs ----------

    action_verbs = [
        "developed",
        "designed",
        "implemented",
        "optimized",
        "engineered",
        "built",
        "created",
        "deployed",
        "integrated",
        "improved",
    ]

    count = 0

    for verb in action_verbs:
        if verb in text:
            count += 1

    action_score = min(100, 50 + count * 8)

    # ---------- Achievements ----------

    numbers = len(re.findall(r"\d+", text))

    achievement_score = min(100, 60 + numbers * 5)

    # ---------- Grammar ----------

    grammar_score = 95

    overall = int(
        (
            data.ats_score
            + summary_score
            + project_score
            + skills_score
            + action_score
            + achievement_score
            + grammar_score
        )
        / 7
    )

    feedback = []

    if summary_score < 80:
        feedback.append(
            "Add a concise professional summary highlighting your strongest skills and target role."
        )

    if project_score < 85:
        feedback.append(
            "Add clearer project descriptions with technologies used, your contribution, and outcomes."
        )

    if skills_score < 80:
        feedback.append(
            "Your resume is missing some important skills from the job description."
        )

    if action_score < 80:
        feedback.append(
            "Use stronger action verbs such as Developed, Implemented, Designed, Optimized, and Deployed."
        )
        
    
    if achievement_score < 80:
        feedback.append(
            "Add measurable results where genuine, such as accuracy, users, performance improvement, or time saved."
        )

    if data.ats_score < 75:
        feedback.append(
            "Improve keyword alignment by using relevant terms from the job description naturally."
        )

    return {
        "overall": overall,
        "ats": data.ats_score,
        "summary": summary_score,
        "projects": project_score,
        "skills": skills_score,
        "grammar": grammar_score,
        "action_verbs": action_score,
        "achievements": achievement_score,
        "feedback": feedback,
    }
@app.post("/preserve-docx-test")
async def preserve_docx_test(file: UploadFile = File(...)):
    filename = file.filename or ""

    if not filename.lower().endswith(".docx"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a DOCX file.",
        )

    content = await file.read()

    if not content:
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is empty.",
        )

    try:
        document = Document(BytesIO(content))

        output = BytesIO()
        document.save(output)
        output.seek(0)

        output_name = f"preserved_{Path(filename).name}"

        return StreamingResponse(
            output,
            media_type=(
                "application/vnd.openxmlformats-officedocument."
                "wordprocessingml.document"
            ),
            headers={
                "Content-Disposition": (
                    f'attachment; filename="{output_name}"'
                )
            },
        )

    except Exception as error:
        print("DOCX preservation error:", error)

        raise HTTPException(
            status_code=500,
            detail="The DOCX file could not be processed.",
        ) 
@app.post("/replace-docx-text-test")
async def replace_docx_text_test(
    file: Annotated[UploadFile, File()],
    location_id: Annotated[str, Form()],
    replacement_text: Annotated[str, Form()],
):
    filename = file.filename or ""

    if not filename.lower().endswith(".docx"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a DOCX file.",
        )

    file_content = await file.read()

    if not file_content:
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is empty.",
        )

    try:
        document = Document(BytesIO(file_content))
        locations = collect_docx_text_locations(document)

        selected_location = next(
            (
                location
                for location in locations
                if location["location_id"] == location_id
            ),
            None,
        )

        if not selected_location:
            raise HTTPException(
                status_code=404,
                detail="The selected text location was not found.",
            )

        paragraph = get_docx_paragraph_by_location(
            document,
            selected_location,
        )

        replace_paragraph_text_preserving_style(
            paragraph,
            replacement_text,
        )

        output = BytesIO()
        document.save(output)
        output.seek(0)

        original_name = Path(filename).stem
        output_name = f"{original_name}_replacement_test.docx"

        return StreamingResponse(
            output,
            media_type=(
                "application/vnd.openxmlformats-officedocument."
                "wordprocessingml.document"
            ),
            headers={
                "Content-Disposition": (
                    f'attachment; filename="{output_name}"'
                )
            },
        )

    except HTTPException:
        raise

    except Exception as error:
        print("DOCX replacement test error:", error)

        raise HTTPException(
            status_code=500,
            detail="The DOCX text could not be replaced.",
        )
@app.post("/optimize-docx")
async def optimize_docx(
    file: Annotated[UploadFile, File()],
    job_description: Annotated[str, Form()],
):
    filename = file.filename or ""

    if not filename.lower().endswith(".docx"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a DOCX file.",
        )

    if not job_description.strip():
        raise HTTPException(
            status_code=400,
            detail="Job description is required.",
        )

    file_content = await file.read()

    if not file_content:
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is empty.",
        )

    try:
        document = Document(BytesIO(file_content))
        locations = collect_docx_text_locations(document)

        editable_locations = []

        current_section = ""

        for location in locations:
            text = location["text"].strip()

            if not text:
                continue
            upper = text.upper()

            if upper in {
                "SUMMARY",
                "EDUCATION",
                "PROJECTS",
                "SKILLS",
                "CERTIFICATIONS",
                "CODING PROFILES",
            }:
                current_section = upper
                continue
            if current_section not in {
                "SUMMARY",
                "PROJECTS",
                "SKILLS",
            }:
                continue

            if len(text) < 20:
                continue

            editable_locations.append({
                "location_id": location["location_id"],
                "section": current_section,
                "text": text,
                "max_characters": int(len(text) * 1.25),
            })

        prompt = f"""
You are an expert ATS resume editor.

Improve the resume text for the supplied job description.

STRICT RULES:
- Preserve every existing fact.
- Do not invent skills, achievements, metrics, projects, experience, or certifications.
- Keep the same meaning.
- Improve clarity, impact, action verbs, and job relevance.
- Keep each improved text close to the original length.
- Do not change headings.
- Do not add new sections.
- If a sentence is already strong, keep it nearly unchanged.
- Return only valid JSON.

JOB DESCRIPTION:
{job_description[:6000]}

TEXT LOCATIONS:
{json.dumps(editable_locations, ensure_ascii=False)}

Return exactly:

{{
  "changes": [
    {{
      "location_id": "paragraph:5",
      "original": "original text",
      "improved": "improved text"
    }}
  ]
}}
"""
        response = None
        last_error = None
        model_candidates = [
            "gemini-3.5-flash",
            "gemini-2.5-flash",
        ]

        for model_name in model_candidates:
            for attempt in range(4):
                try:
                    response = client.models.generate_content(
                        model=model_name,
                        contents=prompt,
                        config={
                            "response_mime_type": "application/json"
                        }
                    )
                    break
                except Exception as error:
                    last_error = error
                    error_text = str(error)
                is_temporary = (
                    "503" in error_text or "UNAVAILABLE" in error_text or "RESOURCE_EXHAUSTED" in error_text
                )    
                if is_temporary and attempt < 3:
                    wait_seconds = (2 ** attempt) + random.uniform(0, 1)
                    time.sleep(wait_seconds)
                    continue
                break
                
            if response is None:
               break
        if response is None:

           raise HTTPException(
                status_code=503,
                detail=(
                   "Gemini is temporarily unavailable after trying multiple "
                   "models. Please try again in a few minutes." 
                )
            ) from last_error
                
        
        result = json.loads(response.text)
        changes = result.get("changes", [])

        location_map = {
            location["location_id"]: location
            for location in locations
        }

        applied_changes = []

        for change in changes:
            location_id = change.get("location_id", "")
            improved_text = change.get("improved", "").strip()

            if not location_id or not improved_text:
                continue

            location = location_map.get(location_id)

            if not location:
                continue

            original_text = location["text"].strip()

            if original_text != change.get("original", "").strip():
                continue

            paragraph = get_docx_paragraph_by_location(
                document,
                location,
            )

            replace_paragraph_text_preserving_style(
                paragraph,
                improved_text,
            )

            applied_changes.append({
                "location_id": location_id,
                "original": original_text,
                "improved": improved_text,
            })

        output = BytesIO()
        document.save(output)
        output.seek(0)

        original_name = Path(filename).stem
        output_name = f"{original_name}_optimized.docx"

        return StreamingResponse(
            output,
            media_type=(
                "application/vnd.openxmlformats-officedocument."
                "wordprocessingml.document"
            ),
            headers={
                "Content-Disposition": (
                    f'attachment; filename="{output_name}"'
                ),
                "X-Applied-Changes": str(len(applied_changes)),
            },
        )

    except HTTPException:
        raise

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=502,
            detail="The AI response was not valid JSON.",
        )

    except Exception as error:
        print("DOCX optimization error:", error)

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )
       