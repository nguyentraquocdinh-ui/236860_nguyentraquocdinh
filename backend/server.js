const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const foodRoutes = require('./routes/foodRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint kiểm tra trạng thái hoạt động (Yêu cầu 8)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date(), 
    dbState: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected' 
  });
});

// Định tuyến API món ăn
app.use('/api/foods', foodRoutes);

// Cấu hình cổng và kết nối MongoDB từ biến môi trường (Yêu cầu 7)
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Kết nối MongoDB Atlas thành công!');
    app.listen(PORT, () => {
      console.log(`Server đang chạy tại cổng: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Lỗi kết nối cơ sở dữ liệu:', err.message);
    process.exit(1);
  });
  