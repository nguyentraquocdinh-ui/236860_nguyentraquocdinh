const express = require('express');
const router = express.Router();
const Food = require('../models/Food');

// 1. Lấy danh sách món ăn & Tìm kiếm (GET /api/foods?search=pho)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      // Tìm kiếm theo tên, loại món hoặc vùng miền (không phân biệt hoa thường)
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { cuisine: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const foods = await Food.find(query);
    res.status(200).json({ success: true, data: foods });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy dữ liệu', error: error.message });
  }
});

// 2. Xem thông tin một món ăn theo ID (GET /api/foods/:id)
router.get('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy món ăn' });
    }
    res.status(200).json({ success: true, data: food });
  } catch (error) {
    res.status(400).json({ success: false, message: 'ID không hợp lệ', error: error.message });
  }
});

// 3. Thêm món ăn mới (POST /api/foods) - Kiểm tra trùng foodId & dữ liệu
router.post('/', async (req, res) => {
  try {
    const { foodId, name, category, cuisine, ingredients, price, quantity } = req.body;

    // Kiểm tra dữ liệu đầu vào cơ bản
    if (!foodId || !name || !category || !cuisine || !ingredients || price === undefined || quantity === undefined) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ các trường bắt buộc' });
    }

    // Kiểm tra trùng foodId
    const existingFood = await Food.findOne({ foodId });
    if (existingFood) {
      return res.status(400).json({ success: false, message: 'Mã món ăn (foodId) đã tồn tại' });
    }

    const newFood = new Food(req.body);
    const savedFood = await newFood.save();
    res.status(201).json({ success: true, message: 'Thêm món ăn thành công', data: savedFood });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi thêm món ăn', error: error.message });
  }
});

// 4. Cập nhật thông tin món ăn (PUT /api/foods/:id)
router.put('/:id', async (req, res) => {
  try {
    const updatedFood = await Food.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedFood) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy món ăn để cập nhật' });
    }

    res.status(200).json({ success: true, message: 'Cập nhật thành công', data: updatedFood });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Dữ liệu cập nhật không hợp lệ', error: error.message });
  }
});

// 5. Xóa món ăn (DELETE /api/foods/:id)
router.delete('/:id', async (req, res) => {
  try {
    const deletedFood = await Food.findByIdAndDelete(req.params.id);
    if (!deletedFood) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy món ăn để xóa' });
    }
    res.status(200).json({ success: true, message: 'Xóa món ăn thành công' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'ID không hợp lệ', error: error.message });
  }
});

module.exports = router;