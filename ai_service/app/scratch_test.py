import google.generativeai as genai
import os
from dotenv import load_dotenv
load_dotenv('../.env')

genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

def test_tool():
    """Hàm test."""
    return "success"

model = genai.GenerativeModel('gemini-2.5-flash', tools=[test_tool])
chat = model.start_chat(enable_automatic_function_calling=True)
response = chat.send_message('Hãy dùng công cụ test_tool và báo lại kết quả.')
print(response.text)
