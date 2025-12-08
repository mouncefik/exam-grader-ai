
import uuid
from typing import List, Dict, Optional
from sqlmodel import Session, select
from backend.features.correction.models import Copy, CopyCreate
import os
import sys

# Add dolphin_tools directory to sys.path to allow internal imports (like utils) to work
dolphin_tools_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../dolphin_tools"))
if dolphin_tools_path not in sys.path:
    sys.path.append(dolphin_tools_path)

try:
    # Now we import directly as demo_page is available in path
    from demo_page import DOLPHIN, process_document
except ImportError:
    # Fallback if path mapping fails or dependencies missing
    print("Warning: dolphin_tools not found or dependencies missing (demo_page), using stub.")
    DOLPHIN = None
    process_document = None

# Global model instance (lazy load or singleton recommended for real app)
_dolphin_model = None

def get_dolphin_model():
    global _dolphin_model
    if _dolphin_model is None:
        # Assuming model path is valid or using HF hub
        # For this environment, let's assume a default or parameterized path
        # Warning: This might be heavy to load on startup
        try:
             _dolphin_model = DOLPHIN("ByteDance/Dolphin-1.5") # Or local path
        except Exception as e:
            print(f"Failed to load Dolphin model: {e}")
            return None 
    return _dolphin_model

class IAService:
    @staticmethod
    def correct_copy(copy_path: str) -> Dict:
        """
        Corrects a copy by first extracting content using Dolphin, 
        then (stub) grading it.
        """
        extracted_text = ""
        try:
            model = get_dolphin_model()
            if model and os.path.exists(copy_path):
                # Temporary output dir for extraction results
                save_dir = os.path.join(os.path.dirname(copy_path), "extraction_results")
                
                # process_document returns (json_path, results_list)
                _, results = process_document(
                    document_path=copy_path,
                    model=model,
                    save_dir=save_dir
                )
                
                # Simple aggregation of extracted text for demonstration
                # results structure depends on if it's PDF (list of pages) or Image
                if isinstance(results, list) and len(results) > 0 and "elements" in results[0]:
                     # Multi-page PDF structure from process_document
                     for page in results:
                         for element in page.get("elements", []):
                             extracted_text += element.get("text", "") + "\n"
                elif isinstance(results, list):
                    # Single page image results list
                    for element in results:
                         extracted_text += element.get("text", "") + "\n"
            else:
                extracted_text = "Dolphin model not loaded or file not found. Using simulation."

        except Exception as e:
            print(f"Error during Dolphin extraction: {e}")
            extracted_text = "Extraction failed."

        # Here we would feed 'extracted_text' to an LLM for grading.
        # For now, we return the stub plus the extracted text for verification.
        
        return {
            "score": 15.5,
            "annotations": {
                "extracted_content": extracted_text[:500] + "...", # Truncate for display
                "q1": "good", 
                "q2": "partial"
            },
            "competencies": {"analysis": 4, "knowledge": 5}
        }

def create_copy(session: Session, copy_create: CopyCreate) -> Copy:
    db_copy = Copy.from_orm(copy_create)
    db_copy.id = str(uuid.uuid4())
    session.add(db_copy)
    session.commit()
    session.refresh(db_copy)
    return db_copy

def get_copies_by_exam(session: Session, exam_id: str) -> List[Copy]:
    statement = select(Copy).where(Copy.exam_id == exam_id)
    return session.exec(statement).all()

def get_copy(session: Session, copy_id: str) -> Optional[Copy]:
    return session.get(Copy, copy_id)

def perform_correction(session: Session, copy_id: str) -> Optional[Copy]:
    copy = session.get(Copy, copy_id)
    if not copy:
        return None
    
    # Simulate getting content from file_path
    # content = "Simulated content"  <-- Removed, passing file_path instead
    
    # We pass the file path to IAService which handles extraction
    # Assuming copy.file_path is a valid absolute or relative path
    # If relative, we might need to join with a base dir
    # For now, let's assume it's usable as is or we make it absolute
    
    # Check if file_path is relative and prepend project root if needed
    # (Simplified logic)
    full_path = copy.file_path
    if full_path and not os.path.isabs(full_path):
        full_path = os.path.abspath(full_path)

    result = IAService.correct_copy(full_path)
    copy.grade = result["score"]
    copy.annotations = result["annotations"]
    
    session.add(copy)
    session.commit()
    session.refresh(copy)
    return copy

def correct_all_exam_copies(session: Session, exam_id: str) -> List[Copy]:
    copies = get_copies_by_exam(session, exam_id)
    corrected_copies = []
    for copy in copies:
        # Ideally async or background task
        perform_correction(session, copy.id)
        corrected_copies.append(copy)
    return corrected_copies
