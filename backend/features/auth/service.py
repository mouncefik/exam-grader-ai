
from sqlmodel import Session, select
from backend.features.auth.models import User, UserCreate
from backend.core.security import get_password_hash, verify_password

def create_user(session: Session, user_create: UserCreate) -> User:
    # Build User explicitly to avoid validation error on missing hashed_password
    db_user = User(
        email=user_create.email,
        full_name=user_create.full_name,
        role=user_create.role,
        hashed_password=get_password_hash(user_create.password),
    )
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user

def get_user_by_email(session: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email)
    return session.exec(statement).first()

def authenticate_user(session: Session, email: str, password: str) -> User | None:
    user = get_user_by_email(session, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user
