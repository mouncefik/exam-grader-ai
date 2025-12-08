
import uuid
from typing import List, Optional
from sqlmodel import Session, select
from backend.features.exams.models import Exam, ExamCreate, ExamUpdate

def create_exam(session: Session, exam_create: ExamCreate) -> Exam:
    db_exam = Exam.from_orm(exam_create)
    db_exam.id = str(uuid.uuid4())
    session.add(db_exam)
    session.commit()
    session.refresh(db_exam)
    return db_exam

def get_exams(session: Session) -> List[Exam]:
    statement = select(Exam)
    return session.exec(statement).all()

def get_exam(session: Session, exam_id: str) -> Optional[Exam]:
    return session.get(Exam, exam_id)

def update_exam(session: Session, exam_id: str, exam_update: ExamUpdate) -> Optional[Exam]:
    db_exam = session.get(Exam, exam_id)
    if not db_exam:
        return None
    
    exam_data = exam_update.dict(exclude_unset=True)
    for key, value in exam_data.items():
        setattr(db_exam, key, value)
        
    session.add(db_exam)
    session.commit()
    session.refresh(db_exam)
    return db_exam

def delete_exam(session: Session, exam_id: str) -> bool:
    db_exam = session.get(Exam, exam_id)
    if not db_exam:
        return False
    session.delete(db_exam)
    session.commit()
    return True
