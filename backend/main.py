from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session

from backend.core.config import settings
from backend.core.database import create_db_and_tables, engine
from backend.features.auth import service as auth_service
from backend.features.auth.models import UserCreate, UserRole
from backend.features.auth.router import router as auth_router
from backend.features.exams.router import router as exams_router
from backend.features.correction.router import router as correction_router
from backend.features.results.router import router as results_router
from backend.features.chatbot.router import router as chatbot_router

app = FastAPI(title=settings.PROJECT_NAME)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        # Allow all GitHub Codespaces URLs
        "https://*.app.github.dev",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origin_regex=r"https://.*\.app\.github\.dev",
)


@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    seed_default_users()


def seed_default_users():
    # Create initial admin/professor/student accounts if they do not already exist
    default_users = [
        {
            "email": "admin@example.com",
            "password": "admin123",
            "role": UserRole.ADMIN,
            "full_name": "Admin User",
        },
        {
            "email": "professor@example.com",
            "password": "professor123",
            "role": UserRole.PROFESSOR,
            "full_name": "Professor User",
        },
        {
            "email": "student@example.com",
            "password": "student123",
            "role": UserRole.STUDENT,
            "full_name": "Student User",
        },
    ]

    with Session(engine) as session:
        for user_data in default_users:
            existing = auth_service.get_user_by_email(session, user_data["email"])
            if existing:
                continue
            user_create = UserCreate(**user_data)
            auth_service.create_user(session, user_create)


app.include_router(auth_router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(exams_router, prefix=f"{settings.API_V1_STR}/exams", tags=["exams"]) # Handles /exams CRUD
app.include_router(correction_router, prefix=f"{settings.API_V1_STR}", tags=["correction"]) # Handles /exams/{id}/copies
app.include_router(results_router, prefix=f"{settings.API_V1_STR}", tags=["results"]) # Handles /exams/{id}/...
app.include_router(chatbot_router, prefix=f"{settings.API_V1_STR}", tags=["chatbot"]) # Handles /exams/{id}/...


@app.get("/")
def read_root():
    return {"message": "Welcome to the Exam Correction System API"}
