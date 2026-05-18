# Clinical AI — Design Humanization Log

> **Mục tiêu:** Chuyển đổi giao diện từ phong cách "AI-generated default" sang **Minimalist SaaS** chuyên nghiệp, phù hợp môi trường lâm sàng & trình bày khóa luận.
> **Font chủ đạo:** `Plus Jakarta Sans`
> **Phiên làm việc:** 18–19/05/2026

---

## ✅ Đã hoàn thành

### 1. Design System — Quy tắc thống nhất
- **Typography:** `Plus Jakarta Sans` toàn hệ thống. Label nhỏ: `text-[10px] uppercase tracking-widest font-bold`.
- **Layout:** Dùng `divide-x / divide-y` chia cột thay vì viền bao ngoài. Một khối thống nhất (Unified Panel) thay cho "Card-itis".
- **Màu sắc:** Không dùng gradient trang trí. Màu Solid: Emerald (an toàn) / Amber (cảnh báo) / Rose (rủi ro) / Slate-900 (nút hành động).
- **Icon:** Không bọc icon trong khối tròn màu mè. Chỉ dùng icon trần + chấm màu nhỏ `w-1.5 h-1.5 rounded-full`.

### 2. Layout / Components chung
| File | Thay đổi |
|---|---|
| `src/index.css` | Xác nhận lại `Plus Jakarta Sans` là font chủ đạo |
| `src/layouts/Sidebar.jsx` | Logo Clinical AI tối giản (SVG monogram) |
| `src/layouts/Header.jsx` | Avatar chữ khởi đầu tên, Dropdown tinh gọn |
| `src/components/ui/Logo.jsx` | Thành phần Logo SVG mới |

### 3. Dashboard (`src/pages/Dashboard/`)
- `index.jsx`: Gom Stats (Risk + BMI) và biểu đồ xu hướng vào **1 Unified Panel** duy nhất. Panel "Lời khuyên AI" nền đen tuyền sang trọng.
- `components/StatsCard.jsx`: Flat design, không shadow nặng, không icon trang trí.

### 4. Khám sức khỏe AI (`src/pages/Assessment/`)
- `AssessmentForm.jsx`:
  - Gom 3 cột thành 1 Panel liền khối chia bằng `divide-x`.
  - Thêm input **Chiều cao (cm) + Cân nặng (kg)** → tự động tính và hiển thị BMI (read-only).
  - Nút phân tích: nền `slate-900`, icon `Activity` màu `emerald-400`.
- `AIResults.jsx`:
  - Header: Kết luận + số % chia 2 cột trong 1 Panel.
  - **Thanh rủi ro** mỏng, có vạch chia mốc 33 / 66 / 100, con trỏ trắng viền đen.
  - Yếu tố Cảnh báo & Bảo vệ: table dạng dòng, số % đẩy về lề phải.
  - Phác đồ dinh dưỡng: `prose-slate`, loại bỏ `border-l-4` xanh cũ.
  - Nút "In Bệnh Án" + "Gửi Bệnh nhân": flat, bo góc `rounded-xl`.
- `components/MedicalReportTemplate.jsx`:
  - Dùng `Logo` SVG thay `Activity` icon vòng tròn xanh.
  - Font `Plus Jakarta Sans` trong bản in.
  - Phần cảnh báo y khoa: nền `slate-50` thay vàng `amber-50`.

### 5. Biểu đồ Lịch sử (`src/pages/History/`)
- `index.jsx`:
  - **Bộ lọc thời gian thực:** Parse ngày `vi-VN` → lọc theo tháng thực (3T/6T/1N/Tất cả).
  - 2 biểu đồ gom vào **1 Unified Chart Panel** chia `divide-x`, bộ lọc nằm ở header.
- `components/RiskChart.jsx`: Tooltip đen `slate-900`. `ReferenceLine` ở 33%/66%. Dot nhỏ.
- `components/BMIChart.jsx`: Tooltip đen. Vùng xanh mờ `fillOpacity 0.06`.
- `components/InsightsTimeline.jsx`: **Bảng lâm sàng** — mỗi lần khám = 1 dòng. Nút **Xem thêm / Thu gọn** (+5 dòng/lần). Bộ đếm bản ghi ở header.

---

## 📋 Kế hoạch tiếp theo (Phiên mai)

### Ưu tiên cao
- [ ] **Module Dinh dưỡng** (`src/pages/Meals/index.jsx`): Chuyển danh sách thực đơn sang Daily Board gọn. Ẩn icon thức ăn rườm rà. Nút hành động chuẩn `slate-900`.
- [ ] **Module Tập luyện** (`src/pages/Exercises/index.jsx`): Thiết kế lại thành bảng kế hoạch tập luyện, loại bỏ card màu sặc sỡ.

### Ưu tiên trung bình
- [ ] **Hồ sơ bệnh nhân** (`src/pages/Patients/`): Kiểm tra bảng danh sách và trang chi tiết. Đảm bảo font đúng.
- [ ] **Trang Lịch trình** (`src/pages/Calendar/index.jsx`): Rà soát icon và màu sắc.
- [ ] **Trang chi tiết Hồ sơ** (`src/pages/History/RecordDetail.jsx`): Kiểm tra layout `AssessmentForm` ở chế độ `readOnly`.

### Dọn dẹp trước khi nộp
- [ ] Xóa thư mục `frontend_app/src_corrupted/`.
- [ ] Xóa file `fix_fonts.js` ở gốc project.
- [ ] Kiểm tra responsive màn hình nhỏ (375px) cho tất cả trang đã sửa.

---

## 🔑 Ghi chú kỹ thuật quan trọng

- **Lỗi font:** Không dùng PowerShell để chỉnh sửa hàng loạt (encoding ANSI). Dùng Node.js script hoặc sửa tay.
- **Lỗi JSX:** Luôn đọc lại toàn bộ file trước khi gộp cột/cấu trúc lớn.
- **Backup:** `src_corrupted/` là bản gốc trước khi chỉnh sửa phiên này.
