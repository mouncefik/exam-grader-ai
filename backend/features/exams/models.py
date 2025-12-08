
from typing import Optional
from datetime import date
from sqlmodel import Field, SQLModel

class ExamBase(SQLModel):
    course: str = Field(index=True)
    date: date

class Exam(ExamBase, table=True):
    id: Optional[str] = Field(default=None, primary_key=True) # UUID
    # professor_id: int = Field(foreign_key="user.id") # Keeping this for ownership, even if not in simple spec

class ExamCreate(ExamBase):
    pass

class ExamUpdate(SQLModel):
    course: Optional[str] = None
    date: Optional[date] = None

class ExamRead(ExamBase):
    id: str
