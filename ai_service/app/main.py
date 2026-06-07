from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import os
from app.api import predict, nutrition, chat

class ChatRequest(BaseModel):
    messages: List[Dict[str, str]]
    user_info: Optional[Dict] = {}

class KnowledgeEmbedRequest(BaseModel):
    document_id: str
    file_path: str
    filename: str

app = FastAPI(
    title="Healthcare AI Microservice",
    description="Microservice AI cung cấp tính năng dự đoán bệnh và giải thích bằng SHAP.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict.router, prefix="/api/v1/ai", tags=["Dự đoán & Giải thích (XAI)"])
app.include_router(nutrition.router, prefix="/api/v1/ai", tags=["Bác sĩ Dinh dưỡng (GenAI)"])
app.include_router(chat.router, prefix="/api/v1/ai", tags=["Bác sĩ Ảo (Chatbot)"])

@app.get("/", tags=["Hệ thống"])
def health_check():
    return {"status": "AI Microservice đang chạy ngon lành!"}