
from sqlmodel import Session
from backend.features.chatbot.models import Claim, ClaimCreate, ChatMessage

def create_claim(session: Session, claim_create: ClaimCreate) -> Claim:
    db_claim = Claim.from_orm(claim_create)
    session.add(db_claim)
    session.commit()
    session.refresh(db_claim)
    return db_claim

def process_message(message: ChatMessage) -> str:
    # Placeholder for LLM interaction
    return f"Processed message: {message.message}. logic to be implemented."
