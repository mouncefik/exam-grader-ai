
from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from backend.core.database import get_session
from backend.features.exams import service
from backend.features.exams.models import ExamRead, ExamCreate, ExamUpdate

router = APIRouter()

@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_exam(
    exam_in: ExamCreate,
    session: Annotated[Session, Depends(get_session)],
):
    exam = service.create_exam(session, exam_in)
    return {"examId": exam.id}

@router.get("/", response_model=List[ExamRead])
def list_exams(
    session: Annotated[Session, Depends(get_session)],
):
    return service.get_exams(session)

@router.get("/{exam_id}", response_model=ExamRead)
def get_exam(
    exam_id: str,
    session: Annotated[Session, Depends(get_session)],
):
    exam = service.get_exam(session, exam_id)
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    return exam

@router.patch("/{exam_id}", response_model=ExamRead)
def update_exam(
    exam_id: str,
    exam_update: ExamUpdate,
    session: Annotated[Session, Depends(get_session)],
):
    exam = service.update_exam(session, exam_id, exam_update)
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    return exam

@router.delete("/{exam_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_exam(
    exam_id: str,
    session: Annotated[Session, Depends(get_session)],
):
    success = service.delete_exam(session, exam_id)
    if not success:
        raise HTTPException(status_code=404, detail="Exam not found")
    return None
