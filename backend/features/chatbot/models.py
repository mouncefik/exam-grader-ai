
from typing import Optional
from sqlmodel import Field, SQLModel

class ClaimBase(SQLModel):
    copy_id: int = Field(foreign_key="copy.id")
    message: str
    resolved: bool = False

class Claim(ClaimBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

class ClaimCreate(ClaimBase):
    pass

class ChatMessage(SQLModel):
    message: str
    context: Optional[dict] = None
