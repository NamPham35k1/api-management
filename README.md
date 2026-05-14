# API Management - Express.js với TypeScript & MongoDB

Dự án API quản lý người dùng với các tính năng đăng ký, đăng nhập, quản lý profile, quên mật khẩu và đổi mật khẩu sử dụng MongoDB.

## 📁 Cấu trúc dự án

```
├── config/              # Cấu hình ứng dụng (database, env)
├── controllers/         # Controllers xử lý request/response
├── docs/               # Tài liệu API
├── helpers/            # Helper functions (JWT, etc.)
├── middlewares/        # Middleware (authentication, etc.)
├── models/             # Mongoose models và schemas
├── repositories/       # Data access layer
├── routers/            # Route definitions
├── services/           # Business logic
├── utils/              # Utility functions
├── validations/        # Request validation
├── .env                # Environment variables
├── .env.example        # Environment variables template
├── .gitignore          # Git ignore file
├── nodemon.json        # Nodemon configuration
├── package.json        # Dependencies
└── tsconfig.json       # TypeScript configuration
```

## 🚀 Cài đặt

1. Clone repository:
```bash
git clone <repository-url>
cd api-management
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Cài đặt MongoDB:
Xem hướng dẫn chi tiết tại [docs/MONGODB_SETUP.md](docs/MONGODB_SETUP.md)

4. Cấu hình file `.env`:
```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
MONGODB_URI=mongodb://localhost:27017/api-management
NODE_ENV=development
```

## 🏗️ Chạy dự án

### Development:
```bash
npm run dev
```

### Production:
```bash
npm run build
npm start
```

## 🚀 Deploy lên Render

1. **Push code lên GitHub**

2. **Tạo service trên Render:**
   - Chọn "Web Service"
   - Connect GitHub repository
   - Chọn branch `main`

3. **Cấu hình Build & Deploy:**
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`

4. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=<your-secret-key>
   MONGODB_URI=<your-mongodb-connection-string>
   ```

5. **Deploy!** 🎉

## 📚 API Documentation

Xem chi tiết API tại [docs/API.md](docs/API.md)

## 🧪 Test API

Xem hướng dẫn test tại [docs/TEST_API.md](docs/TEST_API.md)

## 💻 Chạy ứng dụng

### Development mode (với nodemon):
```bash
npm run dev
```

### Build và chạy production:
```bash
npm run build
npm start
```

## 📚 API Endpoints

### Public Routes

#### 1. Đăng ký
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "Nguyen Van A"
}
```

#### 2. Đăng nhập
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### 3. Quên mật khẩu
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### 4. Reset mật khẩu
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset-token-here",
  "newPassword": "newpassword123"
}
```

### Protected Routes (cần token)

#### 5. Lấy thông tin profile
```http
GET /api/auth/profile
Authorization: Bearer <your-jwt-token>
```

#### 6. Đổi mật khẩu
```http
POST /api/auth/change-password
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "newpassword123"
}
```

## 🔧 Scripts

- `npm run dev` - Chạy development server với nodemon
- `npm run build` - Build TypeScript sang JavaScript
- `npm start` - Chạy production server

## 📖 Tài liệu chi tiết

- [API Documentation](docs/API.md)
- [MongoDB Setup Guide](docs/MONGODB_SETUP.md)

## 🛠️ Technologies

- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB** - NoSQL Database
- **Mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **dotenv** - Environment variables
- **cors** - CORS middleware
- **uuid** - Generate unique IDs

## 📝 Database Schema

### User Model
```typescript
{
  email: String (unique, required)
  password: String (required, hashed)
  name: String (required)
  resetToken: String (optional)
  resetTokenExpiry: Date (optional)
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

## 🔐 Bảo mật

- Mật khẩu được hash bằng bcrypt với salt rounds = 10
- JWT token được sử dụng cho authentication
- Validation được thực hiện ở tầng middleware
- Protected routes yêu cầu JWT token hợp lệ
- Reset token có thời gian hết hạn (1 giờ)
- Email validation với regex pattern
- Password minimum length: 6 ký tự

## 🧪 Test API

### Sử dụng cURL

#### 1. Đăng ký user mới
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@example.com","password":"123456","name":"Nguyen Van B"}'
```

**Response:**
```json
{
  "message": "Đăng ký thành công",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 2. Đăng nhập
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@example.com","password":"123456"}'
```

**Response:**
```json
{
  "message": "Đăng nhập thành công",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Lưu accessToken để sử dụng cho các request tiếp theo!**

#### 3. Lấy thông tin profile
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response:**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "newuser@example.com",
    "name": "Nguyen Van B",
    "createdAt": "2026-04-28T10:00:00.000Z"
  }
}
```

#### 4. Đổi mật khẩu
```bash
curl -X POST http://localhost:3000/api/auth/change-password \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"currentPassword":"123456","newPassword":"newpass789"}'
```

**Response:**
```json
{
  "message": "Đổi mật khẩu thành công"
}
```

#### 5. Quên mật khẩu
```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@example.com"}'
```

**Response:**
```json
{
  "message": "Nếu email tồn tại, link reset mật khẩu đã được gửi",
  "resetToken": "abc123xyz789"
}
```

#### 6. Reset mật khẩu
```bash
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"RESET_TOKEN_HERE","newPassword":"newpass123"}'
```

**Response:**
```json
{
  "message": "Đổi mật khẩu thành công"
}
```

---

### Sử dụng Postman

#### Setup Environment
1. Tạo environment mới trong Postman
2. Thêm biến:
   - `base_url`: `http://localhost:3000`
   - `accessToken`: (để trống, sẽ tự động set)

#### Auto-save Token
Trong request **Login** hoặc **Register**, vào tab **Tests** và thêm:
```javascript
var jsonData = pm.response.json();
pm.environment.set("accessToken", jsonData.accessToken);
```

#### Sử dụng Token
Trong các request cần authentication:
1. Tab **Authorization**
2. Type: **Bearer Token**
3. Token: `{{accessToken}}`

#### Collection Structure
```
📁 API Management
  📂 Auth
    ├── POST Register
    ├── POST Login
    ├── GET Profile (protected)
    ├── POST Change Password (protected)
    ├── POST Forgot Password
    └── POST Reset Password
```

---

### Test Flow Hoàn Chỉnh

```bash
# 1. Đăng ký user mới
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test'$(date +%s)'@example.com","password":"123456","name":"Test User"}' \
  | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

echo "Access Token: $TOKEN"

# 2. Lấy profile
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"

# 3. Đổi mật khẩu
curl -X POST http://localhost:3000/api/auth/change-password \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"currentPassword":"123456","newPassword":"newpass789"}'
```

---

### Seed Database

Tạo user test trong database:
```bash
npm run seed
```

User test được tạo:
- Email: `test@example.com`
- Password: `123456`

## 📄 License

ISC
