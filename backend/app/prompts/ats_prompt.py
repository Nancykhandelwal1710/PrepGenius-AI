def get_ats_prompt(resume_text, job_description):

    return f"""
You are an expert ATS analyzer.

Compare the resume against the job description.

JOB DESCRIPTION:

{job_description[:6000]}

RESUME:

{resume_text[:6000]}

Return ONLY JSON.

{{
"job_domain":"",
"experience_level":"",
"ats_score":0,
"required_skills":[],
"matched_skills":[],
"missing_skills":[]
}}
"""
