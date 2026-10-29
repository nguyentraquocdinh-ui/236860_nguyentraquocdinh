let foodModal, detailModal;

document.addEventListener('DOMContentLoaded', () => {
  foodModal = new bootstrap.Modal(document.getElementById('foodModal'));
  detailModal = new bootstrap.Modal(document.getElementById('detailModal'));
  
  // Tải danh sách món ăn ban đầu
  fetchFoods();

  // Bắt sự kiện nhấn Enter trong ô tìm kiếm
  document.getElementById('searchInput').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') handleSearch();
  });
});

// Hàm hiển thị thông báo Alert
function showAlert(message, type = 'success') {
  const alertContainer = document.getElementById('alertContainer');
  alertContainer.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;
  setTimeout(() => { alertContainer.innerHTML = ''; }, 4000);
}

// 1 & 6. Lấy danh sách món ăn & Tìm kiếm
async function fetchFoods(searchQuery = '') {
  const spinner = document.getElementById('loadingSpinner');
  const tableBody = document.getElementById('foodTableBody');
  
  spinner.classList.remove('d-none');
  tableBody.innerHTML = '';

  try {
    let url = API_BASE_URL;
    if (searchQuery) {
      url += `?search=${encodeURIComponent(searchQuery)}`;
    }

    const res = await fetch(url);
    const result = await res.json();

    if (result.success) {
      renderTable(result.data);
    } else {
      showAlert(result.message || 'Không thể lấy dữ liệu', 'danger');
    }
  } catch (error) {
    showAlert('Lỗi kết nối tới Server Backend!', 'danger');
  } finally {
    spinner.classList.add('d-none');
  }
}

// Hiển thị bảng dữ liệu
function renderTable(foods) {
  const tableBody = document.getElementById('foodTableBody');
  if (!foods || foods.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">Không tìm thấy món ăn nào.</td></tr>`;
    return;
  }

  tableBody.innerHTML = foods.map(food => `
    <tr>
      <td><span class="badge bg-secondary">${food.foodId}</span></td>
      <td class="fw-bold">${food.name}</td>
      <td>${food.category}</td>
      <td>${food.cuisine}</td>
      <td class="text-success fw-bold">${Number(food.price).toLocaleString()} đ</td>
      <td>${food.quantity}</td>
      <td class="text-center">
        <button class="btn btn-sm btn-info text-white me-1" onclick="viewDetail('${food._id}')">
          <i class="bi bi-eye"></i>
        </button>
        <button class="btn btn-sm btn-warning text-white me-1" onclick="openEditModal('${food._id}')">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-sm btn-danger" onclick="deleteFood('${food._id}', '${food.name}')">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

// Tìm kiếm món ăn
function handleSearch() {
  const query = document.getElementById('searchInput').value.trim();
  fetchFoods(query);
}

// 2. Xem chi tiết món ăn
async function viewDetail(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/${id}`);
    const result = await res.json();

    if (result.success) {
      const food = result.data;
      document.getElementById('detailModalContent').innerHTML = `
        <p><strong>Mã món ăn (foodId):</strong> ${food.foodId}</p>
        <p><strong>Tên món ăn:</strong> ${food.name}</p>
        <p><strong>Loại món:</strong> ${food.category}</p>
        <p><strong>Vùng miền:</strong> ${food.cuisine}</p>
        <p><strong>Giá bán:</strong> ${Number(food.price).toLocaleString()} VNĐ</p>
        <p><strong>Số lượng còn:</strong> ${food.quantity}</p>
        <p><strong>Thành phần:</strong> ${Array.isArray(food.ingredients) ? food.ingredients.join(', ') : food.ingredients}</p>
        <p><strong>Mô tả:</strong> ${food.description || 'Không có mô tả'}</p>
      `;
      detailModal.show();
    } else {
      showAlert(result.message, 'danger');
    }
  } catch (error) {
    showAlert('Không thể lấy thông tin chi tiết', 'danger');
  }
}

// Mở Modal Thêm mới
function openAddModal() {
  document.getElementById('foodModalTitle').innerText = 'Thêm món ăn mới';
  document.getElementById('foodForm').reset();
  document.getElementById('mongoId').value = '';
  document.getElementById('foodId').disabled = false;
}

// Mở Modal Cập nhật
async function openEditModal(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/${id}`);
    const result = await res.json();

    if (result.success) {
      const food = result.data;
      document.getElementById('foodModalTitle').innerText = 'Cập nhật món ăn';
      document.getElementById('mongoId').value = food._id;
      document.getElementById('foodId').value = food.foodId;
      document.getElementById('foodId').disabled = true; // Không cho sửa foodId
      document.getElementById('foodName').value = food.name;
      document.getElementById('foodCategory').value = food.category;
      document.getElementById('foodCuisine').value = food.cuisine;
      document.getElementById('foodPrice').value = food.price;
      document.getElementById('foodQuantity').value = food.quantity;
      document.getElementById('foodIngredients').value = Array.isArray(food.ingredients) ? food.ingredients.join(', ') : food.ingredients;
      document.getElementById('foodDescription').value = food.description || '';

      foodModal.show();
    }
  } catch (error) {
    showAlert('Không thể tải thông tin món ăn để sửa', 'danger');
  }
}

// 3 & 4. Lưu dữ liệu (Thêm mới / Cập nhật)
async function saveFood() {
  const mongoId = document.getElementById('mongoId').value;
  const foodId = document.getElementById('foodId').value.trim();
  const name = document.getElementById('foodName').value.trim();
  const category = document.getElementById('foodCategory').value.trim();
  const cuisine = document.getElementById('foodCuisine').value.trim();
  const price = Number(document.getElementById('foodPrice').value);
  const quantity = Number(document.getElementById('foodQuantity').value);
  const ingredientsStr = document.getElementById('foodIngredients').value.trim();
  const description = document.getElementById('foodDescription').value.trim();

  if (!foodId || !name || !category || !cuisine) {
    showAlert('Vui lòng điền đầy đủ thông tin bắt buộc!', 'warning');
    return;
  }

  const ingredients = ingredientsStr ? ingredientsStr.split(',').map(item => item.trim()) : [];

  const bodyData = { foodId, name, category, cuisine, price, quantity, ingredients, description };

  try {
    let res, result;
    if (mongoId) {
      // Cập nhật (PUT)
      res = await fetch(`${API_BASE_URL}/${mongoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });
    } else {
      // Thêm mới (POST)
      res = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });
    }

    result = await res.json();

    if (result.success) {
      showAlert(result.message || 'Thao tác thành công!');
      foodModal.hide();
      fetchFoods();
    } else {
      showAlert(result.message || 'Thao tác thất bại!', 'danger');
    }
  } catch (error) {
    showAlert('Có lỗi xảy ra khi kết nối tới hệ thống!', 'danger');
  }
}

// 5. Xóa món ăn
async function deleteFood(id, name) {
  if (!confirm(`Bạn có chắc chắn muốn xóa món "${name}" không?`)) return;

  try {
    const res = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
    const result = await res.json();

    if (result.success) {
      showAlert(result.message || 'Đã xóa món ăn thành công!');
      fetchFoods();
    } else {
      showAlert(result.message || 'Xóa không thành công!', 'danger');
    }
  } catch (error) {
    showAlert('Lỗi kết nối khi xóa món ăn!', 'danger');
  }
}
