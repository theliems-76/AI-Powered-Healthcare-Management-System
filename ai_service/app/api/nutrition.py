from fastapi import APIRouter, HTTPException
from app.schemas.response import PredictionResponse
from app.services.llm_agent import generate_nutrition_plan

router = APIRouter()

import re
import json

@router.post("/generate-plan", summary="Sinh Thực đơn & Lộ trình (GenAI)")
async def get_nutrition_plan(diagnosis_data: PredictionResponse):
    try:
        data_dict = diagnosis_data.dict()
        
        raw_response = generate_nutrition_plan(data_dict)
        
        if raw_response.startswith("Lỗi"):
            raise HTTPException(status_code=500, detail=raw_response)

        plan_markdown = raw_response
        recommended_foods = []
        recommended_activities = []
        
        json_match = re.search(r'```json\s*(.*?)\s*```', raw_response, re.DOTALL)
        if json_match:
            try:
                content = json_match.group(1).strip()
                json_data = json.loads(content)
                recommended_foods = json_data.get("recommended_foods", [])
                recommended_activities = json_data.get("recommended_activities", [])
                plan_markdown = raw_response.replace(json_match.group(0), "").strip()
            except Exception as parse_error:
                print(f"⚠️ Lỗi bóc tách JSON từ AI: {str(parse_error)}")

        return {
            "status": "success",
            "ai_nutritionist_plan": plan_markdown,
            "recommended_foods": recommended_foods,
            "recommended_activities": recommended_activities
        }
        
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"🔥 Lỗi hệ thống AI Service: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))