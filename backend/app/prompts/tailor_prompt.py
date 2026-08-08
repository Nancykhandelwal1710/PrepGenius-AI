def get_tailor_prompt(resume_text, job_description):

    return f"""
You are an expert resume writer and ATS optimization specialist.

Tailor the candidate's resume for the provided job description.

IMPORTANT RULES:

1. Never invent experience.
2. Never invent projects.
3. Never invent certifications.
4. Never invent achievements.
5. Never add skills the candidate does not have.
6. Keep all facts truthful.
7. Improve wording using ATS-friendly language.
8. Use stronger action verbs.
9. Reorder existing skills according to the job description.
10. Improve the professional summary for the target role.
11. Identify important keywords from the job description.
12. Identify keywords that are missing from the resume.
13. Preserve the candidate's actual experience.

RESUME:

{resume_text[:8000]}

JOB DESCRIPTION:

{job_description[:8000]}

Return ONLY valid JSON:

{{
    "target_role": "",

    "summary": {{
        "original": "",
        "tailored": "",
        "reason": ""
    }},

    "skills": {{
        "original": [],
        "tailored": [],
        "reason": ""
    }},

    "projects": [
        {{
            "original": "",
            "tailored": "",
            "reason": ""
        }}
    ],

    "experience": [
        {{
            "original": "",
            "tailored": "",
            "reason": ""
        }}
    ],

    "keywords": [],
    "missing_keywords": [],
    "suggestions": []
}}
"""
