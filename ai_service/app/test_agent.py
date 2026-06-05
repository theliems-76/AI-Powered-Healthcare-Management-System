import google.generativeai as genai
import os
from dotenv import load_dotenv
load_dotenv('../.env')
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

def book_appointment_tool(date: str, time: str, reason: str) -> str:
    """
    Sử dụng công cụ này ĐỂ TẠO LỊCH KHÁM CHỮA BỆNH mỗi khi bệnh nhân yêu cầu đặt lịch khám.
    Args:
        date: Ngày khám theo định dạng YYYY-MM-DD (Ví dụ: 2026-10-25).
        time: Giờ khám theo định dạng HH:MM (Ví dụ: 09:30, 14:00).
        reason: Lý do muốn khám bệnh.
    """
    print(f"[TOOL CALLED] date={date}, time={time}, reason={reason}")
    return "Đã đặt lịch thành công."

model = genai.GenerativeModel(
    model_name='gemini-2.5-flash', 
    tools=[book_appointment_tool]
)
chat = model.start_chat(enable_automatic_function_calling=True)
response = chat.send_message("Chào bác sĩ, tôi bị đau đầu quá, hãy đặt lịch khám cho tôi vào 9h sáng thứ Hai tuần sau nhé.")

with open('output_test.txt', 'w', encoding='utf-8') as f:
    f.write(str(response.parts))
