# Sử dụng Node.js phiên bản LTS làm base image
FROM node:18-alpine

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json và package-lock.json để cài đặt dependencies
COPY package*.json ./

# Cài đặt các thư viện phụ thuộc
RUN npm install --production

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Mở cổng 5000 cho ứng dụng
EXPOSE 5000

# Lệnh khởi chạy backend
CMD ["node", "server.js"]