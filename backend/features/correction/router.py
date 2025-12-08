
from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, UploadFile, File
from sqlmodel import Session

from backend.core.database import get_session
from backend.features.correction import service
from backend.features.correction.models import CopyRead, CopyCreate

# We use prefix /exams explicitly here or handled in main.py?
# Spec: /exams/{examId}/copies
# So I'll define this router with prefix "" but include it under /exams prefix in main or 
# define full paths here. The simplest for hierarchical is nested routers or full paths.
# Let's use full paths here to match the spec precisely, mounted at root or /exams.
# Actually, sticking to feature-based, this route belongs to "correction" domain but path is "/exams...".
# I'll mount this router at "/" in main.py, and define full paths here.

router = APIRouter()

@router.post("/exams/{exam_id}/copies", response_model=dict)
def upload_copies(
    exam_id: str,
    files: List[UploadFile] = File(...),
    session: Annotated[Session, Depends(get_session)] = None,
):
    # Retrieve exam? (omitted for speed)
    created_ids = []
    for file in files:
        # TODO: Save file
        # file_path = save_file(file)
        file_path = f"uploads/{file.filename}"
        
        copy_in = CopyCreate(exam_id=exam_id, file_path=file_path)
        copy = service.create_copy(session, copy_in)
        created_ids.append(copy.id)
        
    return {"uploaded_count": len(created_ids), "first_copy_id": created_ids[0] if created_ids else None}

@router.get("/exams/{exam_id}/copies", response_model=List[CopyRead])
def list_copies(
    exam_id: str,
    session: Annotated[Session, Depends(get_session)],
):
    return service.get_copies_by_exam(session, exam_id)

@router.get("/exams/{exam_id}/copies/{copy_id}", response_model=CopyRead)
def get_copy(
    exam_id: str,
    copy_id: str,
    session: Annotated[Session, Depends(get_session)],
):
    copy = service.get_copy(session, copy_id)
    if not copy:
        raise HTTPException(status_code=404, detail="Copy not found")
    return copy

@router.post("/exams/{exam_id}/copies/{copy_id}/correct", response_model=CopyRead)
def correct_copy(
    exam_id: str,
    copy_id: str,
    session: Annotated[Session, Depends(get_session)],
):
    copy = service.perform_correction(session, copy_id)
    if not copy:
        raise HTTPException(status_code=404, detail="Copy not found")
    return copy

@router.post("/exams/{exam_id}/correct", response_model=List[CopyRead])
def correct_all(
    exam_id: str,
    session: Annotated[Session, Depends(get_session)],
):
    return service.correct_all_exam_copies(session, exam_id)
