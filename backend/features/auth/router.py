
from datetime import timedelta
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session

from backend.core.database import get_session
from backend.core.config import settings
from backend.core.security import create_access_token
from backend.features.auth.models import UserRead, UserCreate, Token, User
from backend.features.auth import service
from backend.features.auth.deps import get_current_active_user

router = APIRouter()

@router.post("/login", response_model=Token)
def login_for_access_token(
    session: Annotated[Session, Depends(get_session)],
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
):
    user = service.authenticate_user(session, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user.email, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register", response_model=UserRead)
def register_user(
    session: Annotated[Session, Depends(get_session)],
    user_in: UserCreate,
):
    user = service.get_user_by_email(session, user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system",
        )
    user = service.create_user(session, user_in)
    return user

@router.get("/me", response_model=UserRead)
def read_users_me(
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    return current_user
