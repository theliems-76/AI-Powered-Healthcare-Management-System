import os
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv
from pathlib import Path

from app.services.rag_service import rag_system
import random

router = APIRouter()

_env_path = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=_env_path)

api_keys = []
for key in ["GEMINI_API_KEY_CHATBOT", "GEMINI_API_KEY_1", "GEMINI_API_KEY_2", "GEMINI_API_KEY"]:
    val = os.getenv(key)
    if val and val not in api_keys:
        api_keys.append(val)

if not api_keys:
    print("⚠️ THIẾU GEMINI_API_KEY TRONG ENV!")
else:
    rag_system.initialize(api_keys[0])

def get_random_api_key():
    if not api_keys:
        return None
    return random.choice(api_keys)

class ChatRequest(BaseModel):
    messages: list
    user_info: dict = None

def format_history_for_gemini(messages):
    formatted = []
    for msg in messages:
        role = "model" if msg.get("role") == "model" else "user"
        formatted.append({
            "role": role,
            "parts": [msg.get("content", "")]
        })
        
    if formatted and formatted[0]["role"] == "model":
        formatted.pop(0)
        
    return formatted

@router.post("/chat")
async def chat_with_ai(request: ChatRequest):
    current_api_key = get_random_api_key()
    if not current_api_key:
        raise HTTPException(status_code=500, detail="Thiếu cấu hình API Key.")
    
    genai.configure(api_key=current_api_key)

    try:
        user_info = request.user_info or {}
        patient_name = user_info.get("name", "Bạn")
        medical_context = user_info.get("medical_context")
        patient_profile_id = user_info.get("patient_profile_id")
        doctor_id = user_info.get("doctor_id")
        doctor_name = user_info.get("doctor_name", "phụ trách")
        
        import datetime
        current_time_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        context_str = f"Thời gian thực tế của hệ thống lúc này là: {current_time_str}\n"
        if medical_context:
            context_str += f"""
            THÔNG TIN BỆNH ÁN CỦA BỆNH NHÂN (Lưu ý: Chỉ dùng làm cơ sở tư vấn, không chủ động hù dọa bệnh nhân. Hãy tư vấn sát với thể trạng này):
            - Chỉ số BMI: {medical_context.get('bmi', 'Không rõ')}
            - Tỷ lệ rủi ro tiểu đường AI dự đoán: {medical_context.get('risk_score', 'Không rõ')}%
            - Chẩn đoán sơ bộ: {medical_context.get('diagnosis', 'Chưa có')}
            """

        user_query = ""
        for msg in reversed(request.messages):
            if msg.get("role") == "user":
                user_query = msg.get("content", "")
                break
                
        rag_context = rag_system.retrieve_context(user_query)
        if rag_context:
            context_str += f"\nTHÔNG TIN Y KHOA CHUẨN ĐỂ THAM KHẢO (BẮT BUỘC ưu tiên trả lời theo thông tin này nếu liên quan):\n{rag_context}\n"

        system_instruction = f"""
        Bạn là Trợ lý Y tế ảo của hệ thống Hiệp sĩ Tiểu đường. Bạn đang nói chuyện với bệnh nhân có tên là {patient_name}.
        Quy tắc xưng hô: Luôn xưng là "Tôi" và gọi bệnh nhân là "Bạn". Tuyệt đối không xưng "Bác sĩ" hay "Chúng tôi".
        Giọng văn: Thân thiện, thấu hiểu, chuyên nghiệp và chuẩn xác y khoa.
        Định dạng văn bản: KHÔNG SỬ DỤNG BẤT KỲ ĐỊNH DẠNG MARKDOWN NÀO (Không dùng * hay #). Chỉ trả về văn bản thuần túy (Plain text). Dùng dấu gạch ngang (-) nếu cần liệt kê.
        Nhiệm vụ: Tư vấn sức khỏe, giải đáp thắc mắc về tiểu đường type 2.
        
        QUY TẮC TỐI QUAN TRỌNG ĐỐI VỚI BẠN (AI):
        Tuyệt đối KHÔNG ĐƯỢC in ra các bước suy luận, suy nghĩ, hay kế hoạch của bạn. BẠN PHẢI TRẢ LỜI TRỰC TIẾP VÀO VẤN ĐỀ NGAY LẬP TỨC. Người dùng chỉ muốn đọc câu trả lời cuối cùng dành cho họ.
        
        Quy tắc Trả lời về Thuốc kê đơn:
        1. NẾU trong phần "THÔNG TIN Y KHOA CHUẨN ĐỂ THAM KHẢO" có nhắc đến thuốc đó (ví dụ cách uống, tác dụng phụ), BẮT BUỘC phải trích dẫn thông tin đó ra để hướng dẫn bệnh nhân.
        2. SAU KHI hướng dẫn xong, luôn chốt lại bằng 1 câu chối bỏ trách nhiệm (ví dụ: "Tuy nhiên, bạn không được tự ý đổi liều lượng hay ngưng thuốc, hãy hỏi lại bác sĩ thật của bạn nhé").
        3. Nếu bệnh nhân muốn đặt lịch, hãy nhắc bệnh nhân mở trang Lịch hẹn và chọn đúng Ngày để xem lịch.
        
        {context_str}
        """

        def book_appointment_tool(date: str, time: str, reason: str) -> str:
            """
            Sử dụng công cụ này ĐỂ TẠO LỊCH KHÁM CHỮA BỆNH mỗi khi bệnh nhân yêu cầu đặt lịch khám.
            BẮT BUỘC dùng công cụ này thay vì chỉ trả lời suông.
            Args:
                date: Ngày khám theo định dạng YYYY-MM-DD (Ví dụ: 2026-10-25). Nếu bệnh nhân nói "ngày mai", hãy tự tính ngày.
                time: Giờ khám theo định dạng HH:MM (Ví dụ: 09:30, 14:00).
                reason: Lý do muốn khám bệnh.
            """
            if not patient_profile_id or not doctor_id:
                return "Thất bại: Bệnh nhân chưa chọn Bác sĩ phụ trách. Yêu cầu bệnh nhân vào trang Hồ sơ để kết nối Bác sĩ trước khi đặt lịch."
            
            try:
                import requests
                payload = {
                    "patient_profile_id": patient_profile_id,
                    "doctor_id": doctor_id,
                    "date": date,
                    "time": time,
                    "reason": reason
                }
                res = requests.post("http://127.0.0.1:5000/api/chat/webhook/appointment", json=payload)
                if res.status_code == 201:
                    return f"Đã đặt lịch thành công vào lúc {time} ngày {date} với BS. {doctor_name}. Hãy dặn dò bệnh nhân chọn đúng Ngày trong giao diện Lịch hẹn để xem lịch khám tương lai."
                else:
                    return f"Hệ thống từ chối: {res.text}"
            except Exception as e:
                return f"Lỗi hệ thống khi đặt lịch: {str(e)}"

        model = genai.GenerativeModel(
            model_name="models/gemini-3.1-flash-lite",
            system_instruction=system_instruction,
            tools=[book_appointment_tool],
            generation_config={"temperature": 0.5, "max_output_tokens": 1500}
        )

        history = format_history_for_gemini(request.messages)
        
        last_message = history.pop() if history else None
        
        if not last_message or last_message["role"] != "user":
            raise ValueError("Tin nhắn cuối cùng phải là từ người dùng.")

        chat_session = model.start_chat(history=history, enable_automatic_function_calling=True)
        response = chat_session.send_message(last_message["parts"][0])

        return {"role": "model", "content": response.text}

    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"ERROR Chatbot API: {error_details}")
        raise HTTPException(status_code=500, detail=str(e))

class KnowledgeEmbedRequest(BaseModel):
    document_id: str
    file_path: str
    filename: str

@router.post("/knowledge/embed")
async def embed_knowledge(request: KnowledgeEmbedRequest):
    current_api_key = get_random_api_key()
    if not current_api_key:
        raise HTTPException(status_code=500, detail="Thiếu cấu hình API Key.")
    
    genai.configure(api_key=current_api_key)
    
    try:
        if not os.path.exists(request.file_path):
            raise HTTPException(status_code=404, detail="File không tồn tại.")
            
        added_count = rag_system.add_document(request.file_path, request.filename)
        
        return {
            "status": "success",
            "message": f"Đã nhúng thành công {added_count} đoạn văn bản.",
            "chunks_added": added_count
        }
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"ERROR Knowledge Embed API: {error_details}")
        raise HTTPException(status_code=500, detail=str(e))
