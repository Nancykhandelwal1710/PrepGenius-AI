import json
import random
import time
from io import BytesIO
from pathlib import Path

import fitz
from docx import Document
from fastapi import HTTPException, UploadFile
from fastapi.responses import StreamingResponse

from app.services.gemini_service import generate_json


# ============================================================
# DOCX HELPERS
# ============================================================

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
                            "location_id": (
                                f"table:{table_index}:"
                                f"row:{row_index}:"
                                f"cell:{cell_index}:"
                                f"paragraph:{paragraph_index}"
                            ),
                            "kind": "table_paragraph",
                            "text": text,
                            "table_index": table_index,
                            "row_index": row_index,
                            "cell_index": cell_index,
                            "paragraph_index": paragraph_index,
                        })

    return locations


def replace_paragraph_text_preserving_style(
    paragraph,
    new_text: str
):

    if not paragraph.runs:
        paragraph.add_run(new_text)
        return

    paragraph.runs[0].text = new_text

    for run in paragraph.runs[1:]:
        run.text = ""


def get_docx_paragraph_by_location(
    document: Document,
    location: dict
):

    if location["kind"] == "paragraph":

        return document.paragraphs[
            location["paragraph_index"]
        ]

    if location["kind"] == "table_paragraph":

        table = document.tables[
            location["table_index"]
        ]

        row = table.rows[
            location["row_index"]
        ]

        cell = row.cells[
            location["cell_index"]
        ]

        return cell.paragraphs[
            location["paragraph_index"]
        ]

    raise ValueError(
        "Unsupported DOCX text location."
    )


# ============================================================
# DOCX OPTIMIZER
# ============================================================

async def optimize_docx(
    file: UploadFile,
    job_description: str
):

    filename = file.filename or ""

    if not filename.lower().endswith(".docx"):

        raise HTTPException(
            status_code=400,
            detail="Please upload a DOCX file."
        )

    if not job_description.strip():

        raise HTTPException(
            status_code=400,
            detail="Job description is required."
        )

    file_content = await file.read()

    if not file_content:

        raise HTTPException(
            status_code=400,
            detail="The uploaded file is empty."
        )

    try:

        document = Document(
            BytesIO(file_content)
        )

        locations = collect_docx_text_locations(
            document
        )

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
                "location_id":
                    location["location_id"],

                "section":
                    current_section,

                "text":
                    text,

                "max_characters":
                    int(len(text) * 1.25),
            })

        if not editable_locations:

            raise HTTPException(
                status_code=400,
                detail=(
                    "No editable resume sections "
                    "were found in the DOCX."
                )
            )

        prompt = f"""
You are an expert ATS resume editor.

Improve the resume text for the supplied job description.

STRICT RULES:

- Preserve every existing fact.
- Do not invent skills.
- Do not invent achievements.
- Do not invent metrics.
- Do not invent projects.
- Do not invent experience.
- Do not invent certifications.
- Keep the same meaning.
- Improve clarity and impact.
- Improve action verbs.
- Improve job relevance.
- Keep each improved text close to original length.
- Do not change headings.
- Do not add sections.
- If text is already strong, keep it nearly unchanged.
- Return ONLY valid JSON.

JOB DESCRIPTION:

{job_description[:6000]}

TEXT LOCATIONS:

{json.dumps(
    editable_locations,
    ensure_ascii=False
)}

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

        result = generate_json(prompt)

        changes = result.get(
            "changes",
            []
        )

        location_map = {
            location["location_id"]:
                location

            for location in locations
        }

        applied_changes = []

        for change in changes:

            location_id = change.get(
                "location_id",
                ""
            )

            improved_text = change.get(
                "improved",
                ""
            ).strip()

            if not location_id:
                continue

            if not improved_text:
                continue

            location = location_map.get(
                location_id
            )

            if not location:
                continue

            original_text = location[
                "text"
            ].strip()

            if original_text != change.get(
                "original",
                ""
            ).strip():

                continue

            paragraph = (
                get_docx_paragraph_by_location(
                    document,
                    location
                )
            )

            replace_paragraph_text_preserving_style(
                paragraph,
                improved_text
            )

            applied_changes.append({
                "location_id":
                    location_id,

                "original":
                    original_text,

                "improved":
                    improved_text,
            })

        output = BytesIO()

        document.save(output)

        output.seek(0)

        original_name = Path(
            filename
        ).stem

        output_name = (
            f"{original_name}_optimized.docx"
        )

        return StreamingResponse(
            output,
            media_type=(
                "application/vnd.openxmlformats-"
                "officedocument.wordprocessingml.document"
            ),
            headers={
                "Content-Disposition":
                    f'attachment; filename="{output_name}"',

                "X-Applied-Changes":
                    str(len(applied_changes)),
            }
        )

    except HTTPException:
        raise

    except Exception as error:

        print(
            "DOCX optimization error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail=(
                f"Could not optimize DOCX: {str(error)}"
            )
        )


# ============================================================
# PDF OPTIMIZER - UNIVERSAL
# ============================================================

import json
from io import BytesIO

import fitz
from fastapi import HTTPException, UploadFile
from fastapi.responses import StreamingResponse

from app.services.gemini_service import generate_json


def clean_pdf_text(text: str) -> str:
    return " ".join(str(text).split()).strip()


def safe_pdf_text(text: str) -> str:
    replacements = {
        "•": "-",
        "●": "-",
        "▪": "-",
        "◦": "-",
        "–": "-",
        "—": "-",
        "−": "-",
        "’": "'",
        "‘": "'",
        "“": '"',
        "”": '"',
        "\u00a0": " ",
    }

    text = str(text)

    for old, new in replacements.items():
        text = text.replace(old, new)

    return clean_pdf_text(text)


def extract_pdf_blocks(document):
    """
    Extract meaningful text blocks from any resume.

    No profession-specific section names are required.
    """

    blocks = []

    for page_number, page in enumerate(document):

        page_dict = page.get_text("dict")

        for block_index, block in enumerate(
            page_dict.get("blocks", [])
        ):

            lines = block.get("lines", [])

            if not lines:
                continue

            spans = []
            line_texts = []

            for line in lines:

                line_spans = line.get("spans", [])

                if not line_spans:
                    continue

                spans.extend(line_spans)

                text = clean_pdf_text(
                    " ".join(
                        span.get("text", "")
                        for span in line_spans
                        if span.get("text", "").strip()
                    )
                )

                if text:
                    line_texts.append(text)

            if not line_texts or not spans:
                continue

            text = clean_pdf_text(
                " ".join(line_texts)
            )

            if not text:
                continue

            x0, y0, x1, y1 = block["bbox"]

            font_sizes = [
                float(span.get("size", 10))
                for span in spans
                if span.get("text", "").strip()
            ]

            font_size = (
                max(font_sizes)
                if font_sizes
                else 10
            )

            blocks.append({
                "block_id": (
                    f"page:{page_number}:"
                    f"block:{block_index}"
                ),
                "page_number": page_number,
                "text": text,
                "x0": float(x0),
                "y0": float(y0),
                "x1": float(x1),
                "y1": float(y1),
                "font_size": font_size,
                "character_count": len(text),
            })

    return blocks


def classify_pdf_blocks(blocks):
    """
    Dynamically classify blocks.

    We do NOT depend on specific professions or
    hard-coded resume section names.
    """

    classified = []

    for block in blocks:

        text = block["text"]

        # Ignore tiny decorative fragments.
        if len(text.strip()) < 15:
            continue

        # Ignore obvious page numbers.
        if text.strip().isdigit():
            continue

        classified.append({
            **block,
            "editable": True,
        })

    return classified


def build_pdf_optimization_prompt(
    blocks,
    job_description
):
    return f"""
You are an expert resume optimization specialist.

You are optimizing a resume for a target job.

The resume can belong to ANY profession, including:

Software Engineering
Data Science
AI/ML
Finance
Accounting
Marketing
Sales
HR
Healthcare
Teaching
Law
Operations
Design
Consulting
Government
Hospitality
Customer Support
Business
or any other profession.

IMPORTANT:

Do NOT assume the resume has sections called
Summary, Projects, Skills, Experience, etc.

Analyze the actual text blocks provided.

JOB DESCRIPTION:

{job_description[:8000]}

RESUME TEXT BLOCKS:

{json.dumps(blocks, ensure_ascii=False)}

YOUR TASK:

Identify text blocks where wording can genuinely be improved
for the target job.

You may improve:

- professional wording
- clarity
- relevance
- action verbs
- ATS-friendly terminology
- sentence structure
- keyword alignment
- concise presentation

STRICT FACTUAL RULES:

1. NEVER invent experience.

2. NEVER invent skills.

3. NEVER invent projects.

4. NEVER invent certifications.

5. NEVER invent qualifications.

6. NEVER invent achievements.

7. NEVER invent metrics.

8. NEVER invent employers.

9. NEVER invent job titles.

10. NEVER invent dates.

11. NEVER invent education.

12. NEVER invent technologies.

13. NEVER invent responsibilities.

14. NEVER change names.

15. NEVER change email addresses.

16. NEVER change phone numbers.

17. NEVER change URLs.

18. NEVER change numerical values.

19. NEVER change dates.

20. NEVER change certification names.

21. NEVER change degree names.

22. Preserve the original meaning.

23. Only rewrite text that already contains
candidate information.

24. Do not create new resume sections.

25. Do not remove important factual information.

26. Keep rewritten text approximately the same length
as the original text.

27. If a block is already good, return it unchanged
or do not include it.

28. Do not optimize contact information.

29. Do not optimize page numbers.

30. Do not optimize decorative text.

31. Do not optimize section headings.

32. Do not optimize isolated names.

33. Do not optimize isolated dates.

34. Do not optimize email addresses.

35. Do not optimize URLs.

36. Do not optimize phone numbers.

37. Do not optimize degree names.

38. Do not optimize certification names.

39. Do not optimize company names.

40. Do not optimize job titles.

IMPORTANT:

The block_id MUST remain exactly unchanged.

Return ONLY valid JSON.

Return:

{{
    "changes": [
        {{
            "block_id": "page:0:block:5",
            "improved": "Improved version of the existing text"
        }}
    ]
}}

Only include blocks where an improvement is actually useful.
"""


def is_protected_pdf_block(text: str) -> bool:

    value = text.strip()

    if not value:
        return True

    # Email
    if "@" in value and "." in value:
        return True

    # URLs
    lowered = value.lower()

    if (
        "http://" in lowered
        or "https://" in lowered
        or "www." in lowered
    ):
        return True

    # Phone-like blocks
    digits = sum(
        character.isdigit()
        for character in value
    )

    if digits >= 7 and digits / max(len(value), 1) > 0.35:
        return True

    # Date-like blocks
    date_tokens = [
        "jan",
        "feb",
        "mar",
        "apr",
        "may",
        "jun",
        "jul",
        "aug",
        "sep",
        "oct",
        "nov",
        "dec",
    ]

    lowered_value = value.lower()

    if any(
        token in lowered_value
        for token in date_tokens
    ):

        if any(
            character.isdigit()
            for character in value
        ):
            return True

    return False


def insert_replacement_text(
    page,
    block,
    improved_text
):

    original_rect = fitz.Rect(
        block["x0"],
        block["y0"],
        block["x1"],
        block["y1"],
    )

    # Slightly enlarge the available width,
    # but never outside the page.
    page_width = page.rect.width

    replacement_rect = fitz.Rect(
        original_rect.x0,
        original_rect.y0,
        min(
            original_rect.x1 + 20,
            page_width - 10,
        ),
        original_rect.y1 + 5,
    )

    original_font_size = max(
        float(block.get("font_size", 10)),
        7,
    )

    font_sizes = [
        original_font_size,
        original_font_size - 0.5,
        original_font_size - 1,
        original_font_size - 1.5,
        original_font_size - 2,
    ]

    for font_size in font_sizes:

        font_size = max(
            font_size,
            7,
        )

        result = page.insert_textbox(
            replacement_rect,
            improved_text,
            fontsize=font_size,
            fontname="helv",
            color=(0, 0, 0),
            align=fitz.TEXT_ALIGN_LEFT,
        )

        if result >= 0:
            return True

    return False


async def optimize_pdf(
    file: UploadFile,
    job_description: str,
):

    if not file.filename:

        raise HTTPException(
            status_code=400,
            detail="Please upload a PDF file.",
        )

    if not file.filename.lower().endswith(".pdf"):

        raise HTTPException(
            status_code=400,
            detail="Please upload a PDF file.",
        )

    if not job_description.strip():

        raise HTTPException(
            status_code=400,
            detail="Please provide a job description.",
        )

    pdf_bytes = await file.read()

    if not pdf_bytes:

        raise HTTPException(
            status_code=400,
            detail="The uploaded PDF is empty.",
        )

    document = None

    try:

        document = fitz.open(
            stream=pdf_bytes,
            filetype="pdf",
        )

        # ----------------------------------------------------
        # 1. Extract ALL meaningful blocks
        # ----------------------------------------------------

        blocks = extract_pdf_blocks(
            document
        )

        blocks = classify_pdf_blocks(
            blocks
        )

        # ----------------------------------------------------
        # 2. Remove protected blocks
        # ----------------------------------------------------

        editable_blocks = []

        for block in blocks:

            if not block["editable"]:
                continue

            if is_protected_pdf_block(
                block["text"]
            ):
                continue

            editable_blocks.append(
                block
            )

        if not editable_blocks:

            raise HTTPException(
                status_code=400,
                detail=(
                    "No editable resume content "
                    "was found in this PDF."
                ),
            )

        # ----------------------------------------------------
        # 3. Limit AI input size
        # ----------------------------------------------------

        ai_blocks = []

        total_characters = 0

        for block in editable_blocks:

            block_size = len(
                block["text"]
            )

            if (
                total_characters
                + block_size
                > 18000
            ):
                break

            ai_blocks.append({
                "block_id":
                    block["block_id"],

                "text":
                    block["text"],

                "page_number":
                    block["page_number"],

                "character_count":
                    block["character_count"],
            })

            total_characters += block_size

        # ----------------------------------------------------
        # 4. Ask Gemini what to improve
        # ----------------------------------------------------

        prompt = build_pdf_optimization_prompt(
            ai_blocks,
            job_description,
        )

        result = generate_json(
            prompt
        )

        changes = result.get(
            "changes",
            [],
        )

        if not isinstance(
            changes,
            list,
        ):
            changes = []

        block_map = {
            block["block_id"]:
                block
            for block in editable_blocks
        }

        valid_changes = []

        for change in changes:

            if not isinstance(
                change,
                dict,
            ):
                continue

            block_id = change.get(
                "block_id"
            )

            improved = change.get(
                "improved",
                "",
            )

            original_block = (
                block_map.get(
                    block_id
                )
            )

            if not original_block:
                continue

            if not isinstance(
                improved,
                str,
            ):
                continue

            improved = safe_pdf_text(
                improved
            )

            if not improved:
                continue

            # Never allow Gemini to alter protected
            # factual information blocks.
            if is_protected_pdf_block(
                improved
            ):
                continue

            # Don't allow huge expansion.
            original_length = len(
                original_block["text"]
            )

            maximum_length = max(
                int(original_length * 1.30),
                original_length + 20,
            )

            if len(improved) > maximum_length:

                improved = improved[
                    :maximum_length
                ]

                if " " in improved:
                    improved = improved.rsplit(
                        " ",
                        1
                    )[0]

                improved = improved.rstrip(
                    " ,;:-"
                )

            # Don't replace with identical text.
            if improved == original_block["text"]:
                continue

            valid_changes.append({
                "block_id":
                    block_id,

                "improved":
                    improved,
            })

        # ----------------------------------------------------
        # 5. If Gemini has nothing useful to change
        # ----------------------------------------------------

        if not valid_changes:

            output = BytesIO()

            document.save(
                output,
                garbage=4,
                deflate=True,
            )

            output.seek(0)

            document.close()
            document = None

            return StreamingResponse(
                output,
                media_type="application/pdf",
                headers={
                    "Content-Disposition":
                        'attachment; filename="optimized_resume.pdf"',
                },
            )

        # ----------------------------------------------------
        # 6. Redact original text
        # ----------------------------------------------------

        for change in valid_changes:

            block = block_map[
                change["block_id"]
            ]

            page = document[
                block["page_number"]
            ]

            rect = fitz.Rect(
                block["x0"] - 1,
                block["y0"] - 1,
                block["x1"] + 2,
                block["y1"] + 2,
            )

            page.add_redact_annot(
                rect,
                fill=(1, 1, 1),
            )

        for page in document:

            page.apply_redactions()

        # ----------------------------------------------------
        # 7. Insert improved text
        # ----------------------------------------------------

        applied_changes = 0

        for change in valid_changes:

            block = block_map[
                change["block_id"]
            ]

            page = document[
                block["page_number"]
            ]

            success = insert_replacement_text(
                page,
                block,
                change["improved"],
            )

            if success:

                applied_changes += 1

        # ----------------------------------------------------
        # 8. Save optimized PDF
        # ----------------------------------------------------

        output = BytesIO()

        document.save(
            output,
            garbage=4,
            deflate=True,
        )

        output.seek(0)

        document.close()
        document = None

        return StreamingResponse(
            output,
            media_type="application/pdf",
            headers={
                "Content-Disposition":
                    'attachment; filename="optimized_resume.pdf"',

                "X-Applied-Changes":
                    str(applied_changes),
            },
        )

    except HTTPException:

        if document is not None:
            document.close()

        raise

    except Exception as error:

        if document is not None:
            document.close()

        print(
            "PDF optimization error:",
            error,
        )

        raise HTTPException(
            status_code=500,
            detail=(
                f"Could not optimize PDF: "
                f"{str(error)}"
            ),
        )
    