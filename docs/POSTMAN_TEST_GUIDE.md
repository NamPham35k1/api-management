# 🧪 Test API với Postman

## 📋 Chuẩn bị

### 1. Import Collection
- Mở Postman
- Click **"Import"**
- Chọn file: `docs/Postman_Channel_Test.postman_collection.json`

### 2. Cấu hình Environment
- Tạo Environment mới: **"API Management Dev"**
- Thêm biến:
  ```
  base_url = http://localhost:3000
  ```

### 3. Lấy JWT Token
Trước khi test tạo channel, bạn cần đăng nhập để lấy token:

```bash
# Đăng ký user mới
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "123456",
    "name": "Admin User"
  }'

# Đăng nhập để lấy token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "123456"
  }'
```

Copy token từ response và thay thế `YOUR_JWT_TOKEN_HERE` trong Postman.

---

## 🎯 Test Tạo Channel

### Request Details:
- **Method:** `POST`
- **URL:** `{{base_url}}/api/channels`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_JWT_TOKEN_HERE`
- **Body (JSON):**
  ```json
  {
    "channelId": "VTV1",
    "name": "VTV1 - Kênh truyền hình quốc gia",
    "category": "News",
    "logo": "https://example.com/vtv1-logo.png",
    "streamUrl": "https://example.com/vtv1-stream.m3u8",
    "country": "Vietnam",
    "language": "Vietnamese",
    "isGlobal": true
  }
  ```

### ✅ Response thành công (201):
```json
{
  "message": "Channel created successfully",
  "channel": {
    "_id": "...",
    "channelId": "VTV1",
    "name": "VTV1 - Kênh truyền hình quốc gia",
    "category": "News",
    "logo": "https://example.com/vtv1-logo.png",
    "streamUrl": "https://example.com/vtv1-stream.m3u8",
    "country": "Vietnam",
    "language": "Vietnamese",
    "isGlobal": true,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### ❌ Response lỗi (400):
```json
{
  "message": "Channel đã tồn tại"
}
```

---

## 📝 Các trường bắt buộc:
- `channelId` (string, unique, uppercase)
- `name` (string, min 2 chars)
- `streamUrl` (string, required)

## 📝 Các trường tùy chọn:
- `category` (string, default: "Unknown")
- `logo` (string, default: "")
- `country` (string, default: "")
- `language` (string, default: "")
- `isGlobal` (boolean, default: true)

---

## 🚀 Chạy test:

1. **Start server:** `npm run dev`
2. **Import collection** vào Postman
3. **Đăng nhập** để lấy JWT token
4. **Update Authorization header** với token
5. **Send request** và kiểm tra response!

🎉 **Happy Testing!**