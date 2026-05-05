import os
import joblib
import pandas as pd
import shap
FEATURE_DICT_VI = {
    "HighBP": "Huyết áp cao",
    "HighChol": "Cholesterol cao",
    "CholCheck": "Kiểm tra Cholesterol định kỳ",
    "BMI": "Chỉ số khối cơ thể (BMI)",
    "Smoker": "Hút thuốc lá",
    "Stroke": "Tiền sử đột quỵ",
    "HeartDiseaseorAttack": "Bệnh lý tim mạch",
    "PhysActivity": "Ít vận động thể chất",
    "Fruits": "Chế độ ăn thiếu trái cây",
    "Veggies": "Chế độ ăn thiếu rau xanh",
    "HvyAlcoholConsump": "Lạm dụng rượu bia",
    "AnyHealthcare": "Bảo hiểm y tế",
    "NoDocbcCost": "Bỏ khám bệnh do chi phí",
    "GenHlth": "Sức khỏe tổng quát (Tự đánh giá)",
    "MentHlth": "Căng thẳng tâm lý kéo dài",
    "PhysHlth": "Ngày ốm yếu thể chất",
    "DiffWalk": "Khó khăn khi đi lại",
    "Sex": "Giới tính",
    "Age": "Độ tuổi",
    "Education": "Trình độ học vấn",
    "Income": "Mức thu nhập"
}
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")

try:
    print("Đang tải AI Model & SHAP Explainer vào bộ nhớ...")
    pipeline = joblib.load(os.path.join(MODELS_DIR, 'catboost_pipeline.joblib'))
    selected_features = joblib.load(os.path.join(MODELS_DIR, 'selected_features.joblib'))
    original_features = joblib.load(os.path.join(MODELS_DIR, 'original_features.joblib'))
    
    cat_model = pipeline.named_steps['classifier']
    
    explainer = shap.TreeExplainer(cat_model)
    print("Tải AI Model thành công!")
except Exception as e:
    print(f"LỖI TẢI MÔ HÌNH: {e}. Vui lòng kiểm tra lại thư mục models/")

def predict_and_explain(input_data: dict) -> dict:
    input_df = pd.DataFrame([input_data], columns=original_features)
    
    risk_prob = pipeline.predict_proba(input_df)[0][1]
    prediction_label = int(pipeline.predict(input_df)[0])
    
    diagnosis = "Nguy cơ cao mắc Bệnh Tiểu đường" if prediction_label == 1 else "Sức khỏe bình thường"
    
    X_selected = pipeline.named_steps['feature_selection'].transform(input_df)
    X_scaled = pipeline.named_steps['scaler'].transform(X_selected)
    
    shap_values = explainer.shap_values(X_scaled)[0]
    
    shap_dict =[
        {
            "feature": FEATURE_DICT_VI.get(f, f), 
            "contribution": float(c)
        } 
        for f, c in zip(selected_features, shap_values)
    ]
    
    shap_dict_sorted = sorted(shap_dict, key=lambda x: abs(x["contribution"]), reverse=True)
    
    warning_factors = [item for item in shap_dict_sorted if item["contribution"] > 0][:3]
    
    good_factors =[item for item in shap_dict_sorted if item["contribution"] < 0][:3]

    return {
        "status": "success",
        "diagnosis": diagnosis,
        "risk_probability": round(risk_prob * 100, 2),
        "explanation": {
            "warning_factors": warning_factors,
            "good_factors": good_factors
        }
    }