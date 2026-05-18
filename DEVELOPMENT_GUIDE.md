# 🏥 Hướng dẫn Phát triển Dự án Y tế Thông minh (AI-Powered Healthcare)

Tài liệu này được tạo ra để lưu trữ ngữ cảnh dự án, giúp quá trình bàn giao và làm việc giữa các phiên lập trình (session) diễn ra liền mạch, đặc biệt trong giai đoạn "nước rút" hoàn thiện Khóa luận Tốt nghiệp.

---

## 📅 1. Báo cáo Tiến độ mới nhất (Cập nhật: 10/05/2026)

### Những tính năng vừa hoàn thành:
1. **Module Đăng nhập/Điều hướng (Auth & Routing):**
   - Sửa lỗi trang trống khi bấm Đăng ký (đã thêm route `/register` vào `App.jsx`).
   - Sửa logic chuyển hướng sau khi đăng nhập thành công (trỏ đúng về `/dashboard` thay vì Landing page).
   - *Lưu ý:* Trang "Quên mật khẩu" (`/forgot-password`) hiện đang là UI Mockup (chưa tích hợp mail server thật).

2. **Module Quản lý Dinh dưỡng (Patient Meals):**
   - **Backend (`mealController.js`):** Giải quyết hoàn hảo bài toán Đa hình (Polymorphism) giữa món ăn chuẩn của Admin (tính macro trực tiếp) và món ăn tuỳ chỉnh của bệnh nhân (tính macro dựa trên thành phần).
   - **Giao diện Nhật ký món ăn (`MealList.jsx`):** Nâng cấp lên giao diện Dòng thời gian (Timeline) cực kỳ chuyên nghiệp, nhóm món ăn theo Buổi (Sáng, Trưa, Tối, Phụ). Tự động cộng dồn Calo theo từng buổi và định dạng số thập phân chuẩn.
   - **Trải nghiệm tìm kiếm (`FoodSearchModal.jsx`):** 
     - Mở khóa tính năng tinh chỉnh khối lượng (gram) cho món ăn.
     - Bổ sung thanh "Ngân sách động" (Dynamic Budget Hover): tự động hiển thị trước lượng Calo/Carb/Protein tăng thêm khi rê chuột vào 1 món ăn.
     - Giữ nguyên trạng thái mở của Modal sau khi bấm "Thêm" để người dùng thao tác liên tục.

---

## 🚀 2. Quy trình Khởi động Dự án (Setup Guide)

Vào ngày làm việc tiếp theo, để khởi động toàn bộ hệ thống đa dịch vụ (Microservices), bạn cần mở **3 Terminal riêng biệt** và chạy các lệnh sau:

### Terminal 1: Khởi động Backend (Node.js/Express)
```bash
cd main_backend
npm run dev
```
*(Cổng mặc định: `http://localhost:5000`)*

### Terminal 2: Khởi động Frontend (React/Vite)
```bash
cd frontend_app
npm start
```
*(Cổng mặc định: `http://localhost:5173`)*

### Terminal 3: Khởi động AI Service (Python/FastAPI hoặc Flask)
```bash
cd ai_service
# Kích hoạt môi trường ảo (nếu có)
# venv\Scripts\activate
npm start # Hoặc lệnh khởi chạy server Python tùy cấu hình
```

---

## 🎯 3. Các hạng mục cần ưu tiên cho buổi sau (To-do List)

Để đồ án hoàn hảo 100% chuẩn Khóa luận, trong các phiên tới chúng ta nên tập trung vào:

1. **Tích hợp Email Server:** Thay thế UI Mockup của trang "Quên mật khẩu" bằng việc gửi mail thực tế (sử dụng Nodemailer kết nối Gmail SMTP).
2. **Xử lý Ngoại lệ (Error Handling):** Bắt lỗi chặt chẽ hơn khi `ai_service` bị sập để Frontend không bị treo.
3. **Báo cáo Học thuật (Documentation):** 
   - Bắt đầu trích xuất các luồng xử lý chính ra để vẽ Sơ đồ Use-case.
   - Xuất (Export) cấu trúc Database bằng Workbench để đưa vào quyển báo cáo Word.

> **💡 Mẹo cho AI:**
> Khi bắt đầu một phiên làm việc mới, hãy luôn đọc file `DEVELOPMENT_GUIDE.md` này đầu tiên để lấy lại ngữ cảnh toàn cục, hiểu được kiến trúc 3 thành phần (Frontend, Backend, AI) và không phá vỡ logic tính toán dinh dưỡng đa hình (Polymorphism) đã thiết lập.
