# Đề tài: [Tên đề tài của bạn]

## 1. Công nghệ sử dụng
- **Backend:** Node.js / ExpressJS (hoặc Python/Django...)
- **Frontend:** ReactJS / HTML, CSS, JS
- **Database:** MongoDB

## 2. Cấu trúc dự án
- `/backend`: Mã nguồn server API
- `/frontend`: Mã nguồn giao diện người dùng

## 3. Hướng dẫn cài đặt và chạy chương trình

### Backend
1. Di chuyển vào thư mục backend: `cd backend`
2. Cài đặt các thư viện: `npm install`
3. Chạy ứng dụng: `npm start`

### Frontend
1. Di chuyển vào thư mục frontend: `cd frontend`
2. Khi chạy local, frontend mặc định gọi backend tại `http://localhost:5000`.
3. Khi deploy frontend riêng trên Render, đặt URL backend trong `frontend/config.js`, ví dụ thêm dòng `window.FOOD_API_BASE_URL = 'https://ten-backend.onrender.com/api/foods';` trước khi khai báo `API_BASE_URL`.

Frontend tải danh sách món ngay khi trang mở. Nếu chạy trên môi trường không phải localhost mà chưa cấu hình URL backend, trang sẽ báo cấu hình còn thiếu thay vì gửi yêu cầu sai tới máy người dùng.