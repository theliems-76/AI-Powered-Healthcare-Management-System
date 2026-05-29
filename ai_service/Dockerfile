# 1. Sử dụng image Python 3.9 bản gọn nhẹ (slim) làm nền móng
FROM python:3.9-slim

# 2. Thiết lập thư mục làm việc bên trong Container là /app
WORKDIR /app

# 3. Cài đặt các công cụ hệ thống cần thiết (tránh lỗi khi cài thư viện ML)
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 4. Copy file danh sách thư viện vào Container và cài đặt
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copy toàn bộ mã nguồn của thư mục ai_service vào Container
COPY . .

# 6. Mở cổng 8000 để giao tiếp với các Microservices khác (Frontend/Main Backend)
EXPOSE 8000

# 7. Lệnh khởi chạy Server FastAPI khi Container được bật lên
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]