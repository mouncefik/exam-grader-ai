
from typing import Optional
from sqlmodel import Field, SQLModel
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    PROFESSOR = "professor"
    STUDENT = "student"

class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    full_name: Optional[str] = None
    role: UserRole = UserRole.STUDENT

class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int

class Token(SQLModel):
    access_token: str
    token_type: str
