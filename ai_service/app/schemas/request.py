from pydantic import BaseModel, Field

class PatientDataRequest(BaseModel):
    HighBP: float = Field(..., description="Huyết áp cao: 0 = Không, 1 = Có")
    HighChol: float = Field(..., description="Cholesterol cao: 0 = Không, 1 = Có")
    CholCheck: float = Field(..., description="Đã kiểm tra Cholesterol trong 5 năm qua: 0 = Không, 1 = Có")
    BMI: float = Field(..., description="Chỉ số khối cơ thể (Body Mass Index)")
    Smoker: float = Field(..., description="Hút thuốc ít nhất 100 điếu trong đời: 0 = Không, 1 = Có")
    Stroke: float = Field(..., description="Từng bị đột quỵ: 0 = Không, 1 = Có")
    HeartDiseaseorAttack: float = Field(..., description="Bệnh tim mạch vành / Nhồi máu cơ tim: 0 = Không, 1 = Có")
    PhysActivity: float = Field(..., description="Có hoạt động thể chất trong 30 ngày qua: 0 = Không, 1 = Có")
    Fruits: float = Field(..., description="Ăn trái cây mỗi ngày: 0 = Không, 1 = Có")
    Veggies: float = Field(..., description="Ăn rau mỗi ngày: 0 = Không, 1 = Có")
    HvyAlcoholConsump: float = Field(..., description="Nghiện rượu nặng: 0 = Không, 1 = Có")
    AnyHealthcare: float = Field(..., description="Có bất kỳ loại bảo hiểm y tế nào: 0 = Không, 1 = Có")
    NoDocbcCost: float = Field(..., description="Bỏ khám bác sĩ vì chi phí trong 12 tháng qua: 0 = Không, 1 = Có")
    GenHlth: float = Field(..., description="Tự đánh giá sức khỏe chung: 1 = Xuất sắc -> 5 = Kém")
    MentHlth: float = Field(..., description="Số ngày sức khỏe tâm thần kém trong 30 ngày qua (0-30)")
    PhysHlth: float = Field(..., description="Số ngày sức khỏe thể chất kém hoặc chấn thương trong 30 ngày qua (0-30)")
    DiffWalk: float = Field(..., description="Gặp khó khăn nghiêm trọng khi đi bộ hoặc leo cầu thang: 0 = Không, 1 = Có")
    Sex: float = Field(..., description="Giới tính: 0 = Nữ, 1 = Nam")
    Age: float = Field(..., description="Nhóm tuổi: Từ 1 (18-24 tuổi) đến 13 (80 tuổi trở lên)")
    Education: float = Field(..., description="Trình độ học vấn: Từ 1 (Chưa học xong tiểu học) đến 6 (Tốt nghiệp đại học)")
    Income: float = Field(..., description="Mức thu nhập hộ gia đình: Từ 1 (Dưới $10,000) đến 8 ($75,000 trở lên)")

    class Config:
        json_schema_extra = {
            "example": {
                "HighBP": 1.0,
                "HighChol": 1.0,
                "CholCheck": 1.0,
                "BMI": 32.5,
                "Smoker": 1.0,
                "Stroke": 0.0,
                "HeartDiseaseorAttack": 0.0,
                "PhysActivity": 0.0,
                "Fruits": 0.0,
                "Veggies": 1.0,
                "HvyAlcoholConsump": 0.0,
                "AnyHealthcare": 1.0,
                "NoDocbcCost": 0.0,
                "GenHlth": 4.0,
                "MentHlth": 15.0,
                "PhysHlth": 20.0,
                "DiffWalk": 1.0,
                "Sex": 1.0,
                "Age": 9.0,
                "Education": 4.0,
                "Income": 5.0
            }
        }