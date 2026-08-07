def get_health_prompt(resume, jd):

    return f"""
You are an expert resume reviewer.

Analyze the resume health.

Resume:

{resume}

Job Description:

{jd}

Return ONLY JSON.

{{
    "overall_score":0,
    "readability":0,
    "formatting":0,
    "ats_compliance":0,
    "strengths":[],
    "weaknesses":[],
    "suggestions":[]
}}
"""
