import os
from pathlib import Path
import google.generativeai as genai
from dotenv import load_dotenv

_env_path = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=_env_path)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")

def generate_nutrition_plan(diagnosis_data: dict) -> str:
    """
    Hàm này nhận kết quả từ file inference.py (chứa SHAP) và gọi Gemini
    để sinh ra lộ trình dinh dưỡng và tập luyện.
    """
    
    risk_prob = diagnosis_data.get("risk_probability", 0)
    diagnosis = diagnosis_data.get("diagnosis", "")
    explanation = diagnosis_data.get("explanation", {})
    
    warning_factors = [f"{item['feature']} (Ảnh hưởng: {item['contribution']:.2f})" for item in explanation.get('warning_factors', [])]
    good_factors = [f"{item['feature']} (Tác động tốt: {item['contribution']:.2f})" for item in explanation.get('good_factors',[])]
    
    warnings_str = ", ".join(warning_factors) if warning_factors else "Không có dấu hiệu nguy hiểm rõ rệt."
    goods_str = ", ".join(good_factors) if good_factors else "Cần cải thiện lối sống."

    prompt = f"""
    Bạn là một Bác sĩ nội tiết và Chuyên gia dinh dưỡng hàng đầu.
    Dưới đây là kết quả chẩn đoán bệnh Tiểu đường của một bệnh nhân từ hệ thống AI Machine Learning:
    
    - Nguy cơ mắc bệnh: {risk_prob}% ({diagnosis})
    - Các yếu tố NGUY HIỂM nhất đẩy rủi ro lên cao: {warnings_str}
    - Các thói quen TỐT đang giúp giảm rủi ro: {goods_str}
    
    Nhiệm vụ của bạn:
    Dựa CHÍNH XÁC vào các yếu tố nguy hiểm và thói quen tốt ở trên, hãy lập một kế hoạch hành động cá nhân hóa cho bệnh nhân này. 
    LƯU Ý QUAN TRỌNG VỀ ĐỊNH DẠNG VÀ NỘI DUNG:
    - BẮT BUỘC chỉ sử dụng gạch đầu dòng (Bullet points). Tuyệt đối cấm viết văn xuôi dài dòng. Mỗi ý tối đa 1-2 câu ngắn, in đậm các từ khóa hành động cốt lõi. Bệnh nhân cần thông tin cực kỳ dễ nhớ và không bị mỏi mắt.
    - THỰC ĐƠN BÌNH DÂN: Cấm gợi ý các thực phẩm đắt đỏ hoặc khó ăn (Tuyệt đối không khuyên ăn gạo lứt trừ khi bệnh nhân yêu cầu, cấm hạt chia, cá hồi, măng tây). Bắt buộc phải gợi ý các thực phẩm bình dân, rẻ tiền, truyền thống của người Việt (Ví dụ: Gạo xát dối, bún, khoai lang, rau muống luộc, rau ngót, cá đồng, thịt lợn nạc).
    - CHỈ SỐ MỤC TIÊU Y KHOA: Bắt buộc đưa ra các con số mục tiêu cần đạt được trong mục Đánh giá Y khoa (Ví dụ: Mục tiêu Huyết áp < 130/80 mmHg, Cholesterol LDL < 100 mg/dL theo chuẩn ADA).
    
    Yêu cầu định dạng đầu ra:
    Phần 1: Trình bày bằng Markdown thật đẹp, cực kỳ ngắn gọn (KHÔNG CÓ JSON Ở ĐÂY). TUYỆT ĐỐI KHÔNG dùng lời chào hỏi (như "Chào bạn", "Dưới đây là..."). Đi thẳng vào 3 ý chính tóm tắt sau bằng cấu trúc Bullet points:
    1. 🩺 Đánh giá y khoa (Nhìn nhận rủi ro từ góc độ bác sĩ kèm theo CÁC CHỈ SỐ MỤC TIÊU CẦN ĐẠT ĐƯỢC. BẮT BUỘC trích dẫn chuẩn y khoa như ADA hoặc WHO).
    2. 🥗 Dinh dưỡng (Thực đơn bình dân, dễ kiếm, rẻ tiền gợi ý phù hợp với rủi ro).
    3. 🏃 Tập luyện & Lối sống (Hướng dẫn khắc phục trực tiếp các yếu tố cảnh báo bằng các hành động in đậm).
    
    Chỉ trả về nội dung kế hoạch, không cần chào hỏi rườm rà. Viết bằng tiếng Việt tự nhiên, siêu ngắn gọn và chuyên nghiệp. Bắt đầu ngay lập tức bằng thẻ tiêu đề ### 🩺 Đánh giá y khoa.
    
    Phần 2: Ở ĐOẠN CUỐI CÙNG của câu trả lời, hãy thêm một chuỗi JSON chuẩn (bắt đầu bằng ```json và kết thúc bằng ```). 
    Chuỗi JSON này chứa danh sách các món ăn và bài tập bạn đã gợi ý ở trên. 
    YÊU CẦU BẮT BUỘC: Với mỗi món ăn, bạn phải liệt kê danh sách "ingredients" (nguyên liệu bóc tách) kèm theo khối lượng (weight_g) và dinh dưỡng của từng loại. 
    Ví dụ: Phở bò = Bánh phở (200g) + Thịt bò (50g) + Nước dùng (100g).
    Cấu trúc bắt buộc:
    ```json
    {{
        "recommended_foods": [
            {{
                "name": "Tên món ăn", 
                "category": "Món chính/Phụ", 
                "serving_size_g": 300,
                "calories_per_100g": 120,
                "carbs_per_100g": 20,
                "protein_per_100g": 10,
                "fat_per_100g": 3,
                "ingredients": [
                    {{"name": "Thành phần 1 (vd: Bún)", "weight_g": 200, "calories_per_100g": 110, "carbs_per_100g": 25, "protein_per_100g": 2, "fat_per_100g": 0}},
                    {{"name": "Thành phần 2 (vd: Thịt lợn)", "weight_g": 100, "calories_per_100g": 242, "carbs_per_100g": 0, "protein_per_100g": 27, "fat_per_100g": 14}}
                ]
            }}
        ],
        "recommended_activities": [
            {{"name": "Tên hoạt động", "category": "Cardio/Sức bền", "met_value": 4.5}}
        ]
    }}
    ```
    """
    
    try:
        print("Đang gọi Google Gemini sinh thực đơn...")
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Lỗi khi kết nối với AI Nutritionist: {str(e)}"