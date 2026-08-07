def get_interview_prompt(role, resume_text, job_description):

    return f"""
You are an interview coach.

Generate exactly 5 interview questions.

Role:
{role}

Resume:
{resume_text[:2000]}

Job Description:
{job_description[:2000]}

Rules:
- Return only the questions.
- Number them from 1 to 5.
- Include technical, project-based and HR questions.
"""
