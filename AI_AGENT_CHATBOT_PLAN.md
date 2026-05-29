# Kế Hoạch Tích Hợp AI Agent & Chatbot - Hiệp Sĩ Tiểu Đường

**Tài liệu này đóng vai trò là "Bản thiết kế kỹ thuật" (Blueprint) để nạp lại ngữ cảnh cho AI trong tương lai khi tiến hành code tính năng Chatbot.**

---

## 1. TỔNG QUAN TÍNH NĂNG (OVERVIEW)
Biến hệ thống "Hiệp Sĩ Tiểu Đường" từ việc sử dụng AI một chiều (chỉ xuất thực đơn) thành một hệ sinh thái AI tương tác hai chiều. Cung cấp cho bệnh nhân một **Bác sĩ ảo (AI Agent)** có khả năng:
- Trò chuyện, giải đáp thắc mắc y khoa (Có nhớ lịch sử trò chuyện).
- **Thấu hiểu ngữ cảnh cá nhân (Context-Aware):** Biết rõ bệnh án, chỉ số BMI, huyết áp của người đang chat.
- **Tự hành (Function Calling/Agentic):** Thay vì chỉ nói chuyện, AI có thể tự động gọi API để thực hiện các thao tác trên hệ thống (Ví dụ: Tự động đặt lịch khám, ghi nhận số liệu đường huyết mới).

---

## 2. KIẾN TRÚC HỆ THỐNG (ARCHITECTURE)

### 2.1. Frontend (React / Vite)
- Tạo component `ChatWidget.jsx`: Một khung chat dạng bong bóng (Floating) ở góc phải màn hình dành riêng cho Bệnh nhân (PATIENT).
- Quản lý trạng thái bằng `useState` hoặc Redux: Lưu mảng `messages` (gồm tin nhắn của `user` và `assistant`).
- Hiệu ứng (UI/UX): Hiệu ứng typing (đang gõ), tự động cuộn (auto-scroll) xuống tin nhắn mới nhất.

### 2.2. Backend AI (Python FastAPI - `ai_service`)
- Tạo Endpoint mới: `POST /api/chat`
- Endpoint này nhận Payload từ Frontend:
  ```json
  {
    "user_id": "uuid-...",
    "message": "Tôi đau đầu quá, hãy đặt lịch khám bác sĩ cho tôi",
    "history": [...] 
  }
  ```
- **Xử lý Ngữ cảnh (Context Injection):** Trước khi gọi Gemini, Backend truy vấn bảng `MedicalRecord` và `PatientProfile` để lấy chỉ số sức khỏe của `user_id` hiện tại, sau đó nhúng vào **System Prompt**.

### 2.3. Cỗ Máy AI (Gemini 1.5 - Function Calling)
- Khai báo Schema JSON cho các công cụ (Tools) mà AI có thể dùng:
  - `book_appointment(doctor_name, time, reason)`
  - `get_health_metrics()`
- Thiết lập luồng đàm thoại (Conversational Loop) qua lại giữa Gemini và Backend để thực thi hàm (Function) trước khi trả về Text cho User.

---

## 3. LỘ TRÌNH THỰC THI (PHASED IMPLEMENTATION)

### Phase 1: Xây Dựng Khung Chat & Trí Nhớ Cơ Bản (UI & Basic Chat)
- [ ] Code Giao diện `ChatWidget.jsx` cực mượt, có thể thu phóng.
- [ ] Thiết lập API `/api/chat` trên FastAPI gọi trực tiếp SDK `google-generativeai`.
- [ ] Chuyển tiếp (Relay) cấu trúc tin nhắn để AI có "Trí nhớ" (Context window) về các câu hỏi trước đó trong cùng phiên chat.

### Phase 2: Tiêm Ngữ Cảnh Y Khoa (Medical Context Injection)
- [ ] Sửa đổi System Prompt: *"Bạn là Bác sĩ chuyên khoa Nội tiết của nền tảng Hiệp Sĩ Tiểu Đường. Bạn đang tư vấn cho bệnh nhân [Tên Bệnh Nhân]. Chỉ số BMI: [25]. Đường huyết: [120]. Mức rủi ro: [Cao]..."*
- [ ] Viết logic ở Python để tự động gọi API sang Node.js Backend lấy dữ liệu bệnh án lắp vào System Prompt.

### Phase 3: AI Agent & Function Calling (Bác sĩ Tự Hành)
- [ ] Định nghĩa JSON Schema cho Tool `bookAppointment`.
- [ ] Code cơ chế xử lý khi Gemini trả về kết quả là `function_call`.
- [ ] Python Backend bắt được lệnh, tự động gọi Database MySQL (hoặc gọi sang Node.js API) để INSERT một bản ghi Đặt lịch khám mới.
- [ ] Thông báo cho Gemini biết hàm đã chạy thành công, Gemini trả về lời xác nhận thân thiện cho người dùng trên màn hình.

---

## 4. CÔNG NGHỆ BỔ TRỢ (MỞ RỘNG TRONG TƯƠNG LAI)
- **RAG (Retrieval-Augmented Generation):** Nếu AI hay trả lời sai kiến thức y khoa, sẽ tích hợp thêm Vector Database (ChromaDB) chứa phác đồ điều trị của Bộ Y tế để ép AI trả lời chuẩn xác.
- **Voice-to-Text:** Thêm nút Micro vào khung chat, dùng Web Speech API để bệnh nhân lớn tuổi có thể nói thay vì gõ phím.

*(Kế hoạch này được niêm phong cho quá trình phát triển Version 1.1 sau khi dự án đã Deploy lên VPS thành công).*
