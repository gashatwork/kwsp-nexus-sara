from pydantic import BaseModel
from typing import Optional, Dict, Any


# Define request/response models

class VerifyUserRequest(BaseModel):
    user_id: str

class UserProfileResponse(BaseModel):
    user_id: str = "12345678"
    age: Optional[int] = "35"  # No age provided in the first line
    gender: Optional[str] = "Male"
    race: Optional[str] = "Malay"
    residentstatus: Optional[str] = "Resident"
    religion: Optional[str] = "Islam"
    savingrange: Optional[str] = "RM2,000 – RM5,000"
    accounttype: Optional[str] = "Conventional"
    csik: Optional[str] = "iSaraan"  # Represents iSaraan/i-Suri
    meetingcode: Optional[str] = "12345678"

class UserMessagePayload(BaseModel):
    group_name: str
    user_id: str
    user_qry: str

class EmployeeMessagePayload(BaseModel):
    group_name: str
    user_id: str
    employee_approved_msg: str

class TranscriptionRequest(BaseModel):
    audio_base64: str
    options: Optional[Dict[str, Any]] = None


class TranscriptionResponse(BaseModel):
    text: str
    confidence: Optional[float] = None


class SynthesisRequest(BaseModel):
    text: str
    voice_id: Optional[str] = None
    options: Optional[Dict[str, Any]] = None


class SynthesisResponse(BaseModel):
    audio_data: bytes
    audio_url: Optional[str] = None


class ProductRecommendationRequest(BaseModel):
    input: str
    options: Optional[Dict[str, Any]] = None


class ProductRecommendationResponse(BaseModel):
    output: str
    metadata: Optional[Dict[str, Any]] = None

class FinanceAdvisoryRequest(BaseModel):
    input: str
    options: Optional[Dict[str, Any]] = None

class FinanceAdvisoryResponse(BaseModel):
    input: str
    options: Optional[Dict[str, Any]] = None
