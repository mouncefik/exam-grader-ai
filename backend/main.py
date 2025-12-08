
from fastapi import FastAPI
from backend.core.config import settings
from backend.core.database import create_db_and_tables




from backend.features.auth.router import router as auth_router

from backend.features.exams.router import router as exams_router

from backend.features.correction.router import router as correction_router
from backend.features.results.router import router as results_router
from backend.features.chatbot.router import router as chatbot_router

app = FastAPI(title=settings.PROJECT_NAME)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

app.include_router(auth_router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(exams_router, prefix=f"{settings.API_V1_STR}/exams", tags=["exams"]) # Handles /exams CRUD
app.include_router(correction_router, prefix=f"{settings.API_V1_STR}", tags=["correction"]) # Handles /exams/{id}/copies
app.include_router(results_router, prefix=f"{settings.API_V1_STR}", tags=["results"]) # Handles /exams/{id}/...
app.include_router(chatbot_router, prefix=f"{settings.API_V1_STR}", tags=["chatbot"]) # Handles /exams/{id}/...

@app.get("/")
def read_root():
    return {"message": "Welcome to the Exam Correction System API"}
