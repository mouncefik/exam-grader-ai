
from typing import Annotated, List, Dict
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from backend.core.database import get_session
from backend.features.correction.service import get_copy
from backend.features.correction.models import CopyRead

# Results router:
# GET /exams/{examId}/copies/{copyId}/grade
# GET /exams/{examId}/report
# GET /exams/{examId}/copies/{copyId}/annotations

router = APIRouter()

@router.get("/exams/{exam_id}/copies/{copy_id}/grade", response_model=Dict[str, float])
def get_copy_grade(
    exam_id: str,
    copy_id: str,
    session: Annotated[Session, Depends(get_session)],
):
    copy = get_copy(session, copy_id)
    if not copy:
         raise HTTPException(status_code=404, detail="Copy not found")
    return {"grade": copy.grade}

@router.get("/exams/{exam_id}/report")
def get_exam_report(
    exam_id: str,
    session: Annotated[Session, Depends(get_session)],
    type: str = "summary",
):
    detailed = (type == "detailed")
    # Placeholder logic
    return {
        "exam_id": exam_id,
        "type": type,
        "report": "detailed report" if detailed else "summary report"
    }

@router.get("/exams/{exam_id}/copies/{copy_id}/annotations")
def get_copy_annotations(
    exam_id: str,
    copy_id: str,
    session: Annotated[Session, Depends(get_session)],
):
    copy = get_copy(session, copy_id)
    if not copy:
         raise HTTPException(status_code=404, detail="Copy not found")
    return {"annotations": copy.annotations}
