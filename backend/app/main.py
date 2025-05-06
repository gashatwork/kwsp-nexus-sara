# from backend.app.api.routers import tts_stt_translation
# filepath: c:\WORK\wincode\ai-voice-nexus\backend\app\main.py
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from app.api.routers import chat, tts_stt_translation, meetingmgmt

app = FastAPI(title="Migrant Worker AI Backend", version="0.1.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include routers
# app.include_router(translation.router, prefix="/translate", tags=["translation"])
app.include_router(chat.router, prefix="/chat", tags=["chat"])
app.include_router(meetingmgmt.router, prefix="/kwspcore", tags=["kwspcore"])
app.include_router(tts_stt_translation.router, prefix="/speech", tags=["speech"])


@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok"}
