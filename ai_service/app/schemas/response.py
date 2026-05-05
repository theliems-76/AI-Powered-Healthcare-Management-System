from pydantic import BaseModel
from typing import List, Dict, Any

class Factor(BaseModel):
    feature: str
    contribution: float

class Explanation(BaseModel):
    warning_factors: List[Factor]
    good_factors: List[Factor]

class PredictionResponse(BaseModel):
    status: str
    diagnosis: str
    risk_probability: float
    explanation: Explanation