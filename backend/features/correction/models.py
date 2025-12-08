
from typing import Optional, Dict
from sqlmodel import Field, SQLModel, JSON

class CopyBase(SQLModel):
    exam_id: str = Field(foreign_key="exam.id", index=True)
    # student_id: Optional[int] = Field(foreign_key="user.id", default=None) # Optional for now as per spec
    file_path: Optional[str] = None

class Copy(CopyBase, table=True):
    id: Optional[str] = Field(default=None, primary_key=True) # UUID
    grade: Optional[float] = None
    annotations: Optional[dict] = Field(default=None, sa_type=JSON) 

class CopyCreate(CopyBase):
    pass

class CopyRead(CopyBase):
    id: str
    grade: Optional[float]
    annotations: Optional[dict]
