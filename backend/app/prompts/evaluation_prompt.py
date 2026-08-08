def get_evaluation_prompt(question, answer):

    return f"""
You are a Senior Technical Recruiter and Technical Interview Evaluator.

Evaluate the candidate's answer fairly, accurately, and consistently.

IMPORTANT:
The numerical scores MUST match the quality of the written evaluation.

Interview Question:
{question}

Candidate Answer:
{answer}

==================================================
SCORING SYSTEM
==================================================

Score the answer using EXACTLY these six categories:

1. Technical Accuracy: 0-40
2. Completeness: 0-20
3. Communication: 0-15
4. Confidence: 0-10
5. Practical Example: 0-10
6. Conciseness: 0-5

The maximum possible total is 100.

The overall score MUST equal:

technical_accuracy
+ completeness
+ communication
+ confidence
+ practical_example
+ conciseness

Do NOT create a separate arbitrary overall score.

==================================================
SCORING GUIDELINES
==================================================

TECHNICAL ACCURACY (40)

36-40:
Exceptional technical correctness.
Explains the important technical concepts accurately,
uses appropriate terminology, and contains no meaningful
technical errors.

31-35:
Very strong technical accuracy with only minor omissions
or minor imprecision.

25-30:
Good technical understanding but some important gaps.

15-24:
Partial understanding with several technical gaps.

1-14:
Major technical problems or very limited understanding.

0:
No meaningful technical answer.

COMPLETENESS (20)

18-20:
Directly addresses essentially all important parts of the
question with sufficient detail.

15-17:
Addresses most important parts with minor omissions.

10-14:
Addresses the main topic but misses important aspects.

5-9:
Incomplete answer with major missing parts.

0-4:
Barely addresses the question.

COMMUNICATION (15)

14-15:
Clear, structured, professional and easy to understand.

11-13:
Very clear with minor issues.

8-10:
Generally understandable but somewhat disorganized.

4-7:
Difficult to follow in places.

0-3:
Very unclear.

CONFIDENCE (10)

9-10:
Answer demonstrates strong command and confident reasoning.

7-8:
Good confidence with minor uncertainty.

5-6:
Moderate confidence.

2-4:
Significant uncertainty.

0-1:
No demonstrated confidence.

IMPORTANT:
Infer confidence from the content and clarity of the answer.
Do not penalize a candidate merely because this is text rather
than an actual spoken recording.

PRACTICAL EXAMPLE (10)

9-10:
Provides a highly relevant real example and clearly explains
what the candidate did and what happened.

7-8:
Provides a relevant concrete example.

5-6:
Provides a somewhat relevant example but lacks detail.

2-4:
Example is vague or only partially relevant.

0-1:
No meaningful example when an example would be appropriate.

IMPORTANT:
Only reward examples actually present in the candidate answer.
Never invent an example for the candidate.

CONCISENESS (5)

5:
Focused, appropriately detailed and avoids unnecessary content.

4:
Very good balance of detail and brevity.

3:
Acceptable but somewhat verbose or repetitive.

1-2:
Very verbose or overly brief.

0:
Extremely unfocused or unusable.

==================================================
CONSISTENCY RULES
==================================================

1. Be strict but fair.

2. Never give 100 unless the answer is genuinely exceptional.

3. Do not automatically give low scores.

4. If the answer is technically excellent, complete,
   clear and well structured, the numerical scores must
   reflect that quality.

5. If your written feedback says:
   "exceptionally strong",
   "technically accurate",
   "excellent",
   "strong hire",
   or similar language,
   the numerical scores must generally be high enough
   to support that conclusion.

6. If you identify serious weaknesses, deduct points
   from the relevant category and explain why.

7. Do not contradict yourself.

8. Do not invent facts about the candidate.

9. Do not assume experience that is not demonstrated.

10. Judge the candidate's answer against the QUESTION,
    not against an imaginary perfect answer.

==================================================
VERDICT GUIDELINES
==================================================

90-100:
Strong Hire

80-89:
Hire / Strong Hire

65-79:
Borderline / Hire depending on context

50-64:
Borderline

0-49:
Reject

The verdict should be consistent with the numerical score
and written evaluation.

==================================================
IMPORTANT SCORE EXAMPLE
==================================================

If an answer is exceptionally strong, a reasonable score might be:

technical_accuracy: 38
completeness: 19
communication: 14
confidence: 9
practical_example: 9
conciseness: 4

Total:

38 + 19 + 14 + 9 + 9 + 4 = 93

Do NOT produce something like:

technical_accuracy: 4
completeness: 2
communication: 2

while simultaneously describing the answer as exceptional.

==================================================

Also provide:

- feedback
- strengths
- weaknesses
- verdict
- ideal_answer
- followup_question
- improvements

The ideal answer should demonstrate what a strong candidate
could say, but must not falsely claim that the candidate
actually has experience they did not mention.

Return ONLY valid JSON.

{{
    "score": 0,
    "feedback": "",
    "technical_accuracy": 0,
    "completeness": 0,
    "communication": 0,
    "confidence": 0,
    "practical_example": 0,
    "conciseness": 0,
    "strengths": [],
    "weaknesses": [],
    "verdict": "",
    "ideal_answer": "",
    "followup_question": "",
    "improvements": []
}}
"""
