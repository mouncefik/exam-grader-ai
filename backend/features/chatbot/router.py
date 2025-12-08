
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from pydantic import BaseModel

from backend.core.database import get_session
from backend.features.chatbot import service
from backend.features.chatbot.models import Claim

# Chatbot endpoints:
# POST /exams/{examId}/copies/{copyId}/rectify
# POST /exams/{examId}/copies/{copyId}/flag

router = APIRouter()

class RectifyRequest(BaseModel):
    message: str

class FlagRequest(BaseModel):
    reason: str

@router.post("/exams/{exam_id}/copies/{copy_id}/rectify")
def request_rectification(
    exam_id: str,
    copy_id: str,
    body: RectifyRequest,
    session: Annotated[Session, Depends(get_session)],
):
    # Logic to process rectification
    # return service.process_rectification(...)
    return {"status": "rectification requested", "message": body.message}

@router.post("/exams/{exam_id}/copies/{copy_id}/flag")
def flag_anomaly(
    exam_id: str,
    copy_id: str,
    body: FlagRequest,
    session: Annotated[Session, Depends(get_session)],
):
    # Logic to flag anomaly
    return {"status": "flagged", "reason": body.reason}
