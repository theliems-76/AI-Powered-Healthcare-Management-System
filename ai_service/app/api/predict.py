from fastapi import APIRouter, HTTPException
from app.schemas.request import PatientDataRequest
from app.schemas.response import PredictionResponse
from app.services.inference import predict_and_explain

router = APIRouter()

@router.post("/predict", response_model=PredictionResponse, summary="Dự đoán nguy cơ & Giải thích XAI")
async def get_prediction(data: PatientDataRequest):
    try:
        input_data = data.dict()
        
        result = predict_and_explain(input_data)
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi hệ thống AI: {str(e)}")