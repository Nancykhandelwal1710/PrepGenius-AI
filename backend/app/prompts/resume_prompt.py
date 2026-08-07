def get_resume_prompt(resume, jd):

    return f"""
You are an expert recruiter.

Analyze this resume.

Resume:

{resume}

Job Description:

{jd}

Return ONLY JSON.

{{
"summary":"",
"strengths":[],
"weaknesses":[],
"suggestions":[]
}}
"""
