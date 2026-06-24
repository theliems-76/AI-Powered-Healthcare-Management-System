# BẢN GHI NHỚ PHÁT TRIỂN TƯƠNG LAI (FUTURE ROADMAP)

*Tài liệu này lưu trữ các ý tưởng và kế hoạch kỹ thuật nâng cao để tiếp tục phát triển dự án "Hiệp Sĩ Tiểu Đường" sau khi hoàn thành báo cáo (Report) hiện tại.*

---

## 1. Nâng cấp Hệ thống Agentic RAG
- **Tình trạng hiện tại:** Đang sử dụng RAG truyền thống (Tìm kiếm Vector 1 chiều) kết hợp với Function Calling cơ bản thông qua SDK của Google (`gemini-3.1-flash-lite`).
- **Hướng phát triển:** 
  - Đưa LLM lên làm "Não bộ điều phối" (Orchestrator) thực thụ với vòng lặp **ReAct (Reasoning and Acting)**.
  - Xây dựng cơ chế **Manual Tool Calling** (Gọi hàm thủ công có kiểm soát) bằng cách tự parse chuỗi JSON trả về. Điều này giúp hệ thống tương thích với các mô hình mã nguồn mở cực mạnh nhưng kén API (như `Gemma 4 31B`, `DeepSeek`).
  - Cho phép AI tự động chéo hóa dữ liệu (Tự lấy RAG Phác đồ + Tự Query SQL Bệnh án + Tổng hợp kết luận) trước khi trả lời bệnh nhân.

## 2. Tích hợp WebSocket (Real-time Communication)
- **Tình trạng hiện tại:** Hệ thống Chatbot và Thông báo (Notification) đang chạy qua giao thức HTTP Requests (Gọi API RESTful truyền thống). Người dùng gửi tin nhắn và phải đợi nguyên một khối text trả về.
- **Hướng phát triển:**
  - Triển khai **Socket.IO** (hoặc native WebSockets) trên Node.js Backend.
  - **Streaming Chat:** Trả về từng chữ của AI Chatbot theo thời gian thực (hiệu ứng gõ phím giống hệt trải nghiệm dùng ChatGPT). Việc này giúp giảm triệt để cảm giác chờ đợi khi model (nhất là các model Agentic) phải suy nghĩ lâu.
  - **Live Notifications:** Bác sĩ nhận được thông báo ngay lập tức (Real-time) ngay trên thanh Header khi bệnh nhân vừa nhờ Chatbot đặt lịch khám xong, không cần phải tải lại trang F5.

## 3. Mở rộng Hệ sinh thái Tools cho Chatbot (Agent Tools)
- **Tình trạng hiện tại:** Chatbot mới chỉ được trang bị 1 tool duy nhất là Đặt lịch khám (`book_appointment_tool`).
- **Hướng phát triển:**
  - `get_patient_records_tool`: Cho phép Chatbot tự động đọc các chỉ số sinh tồn và lịch sử khám bệnh gần nhất từ MySQL thay vì phải mớm sẵn vào Context ban đầu.
  - `add_meal_tool`: Cho phép bệnh nhân nhắn "Hôm nay tôi ăn 1 bát phở lúc 8h sáng", Chatbot sẽ tự gọi API thêm món đó vào nhật ký dinh dưỡng trong ngày của bệnh nhân.
  - `generate_report_tool`: Chatbot tự động tổng hợp sức khỏe 7 ngày qua thành 1 file PDF và gửi tự động qua email cho bác sĩ phụ trách.

## 4. Tối ưu hóa Model & Chiến lược gọi API
- **Tình trạng hiện tại:** Đang sử dụng `gemini-3.1-flash-lite` vì tốc độ nhanh và hỗ trợ gọi hàm tự động mượt mà.
- **Hướng phát triển:**
  - Đối với các luồng suy luận ngầm (hidden reasoning loops của Agentic RAG), tiếp tục sử dụng dòng **Flash / Flash Lite** vì giới hạn RPM dồi dào (15 RPM) và chi phí thấp.
  - Đối với câu trả lời tổng hợp cuối cùng dành cho người dùng (Final Answer), có thể cân nhắc chuyển sang gọi API của các model lớn hơn (như `Pro` hoặc `Gemma 31B`) để hành văn trau chuốt và chuẩn mực y khoa hơn, do không còn bị phụ thuộc vào Function Calling. 

---
**Note:** File này được lưu trực tiếp trong thư mục gốc của dự án để đảm bảo không bao giờ bị thất lạc. Hãy tập trung viết Report, hệ thống code hiện tại đã hoàn toàn ổn định!
