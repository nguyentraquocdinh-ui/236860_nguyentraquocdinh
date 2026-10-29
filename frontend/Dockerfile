# Sử dụng Nginx Alpine làm máy chủ web siêu nhẹ
FROM nginx:alpine

# Sao chép toàn bộ mã nguồn frontend vào thư mục mặc định của Nginx
COPY . /usr/share/nginx/html

# Mở cổng 80 cho web server
EXPOSE 80

# Chạy Nginx ở chế độ nền
CMD ["nginx", "-g", "daemon off;"]
