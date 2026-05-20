# 🧪 Test API với cURL

## 1. Đăng ký user mới
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123456",
    "name": "Test User"
  }'
```

## 2. Đăng nhập để lấy token
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123456"
  }'
```

**Copy token từ response** (sẽ có dạng: `{"accessToken": "eyJhbGciOiJIUzI1NiIs..."}`)

## 3. Tạo Channel mới
```bash
curl -X POST http://localhost:3000/api/channels \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "channelId": "VTV1",
    "name": "VTV1 - Kênh truyền hình quốc gia",
    "category": "News",
    "logo": "https://example.com/vtv1-logo.png",
    "streamUrl": "https://example.com/vtv1-stream.m3u8",
    "country": "Vietnam",
    "language": "Vietnamese",
    "isGlobal": true
  }'
```

## 4. Lấy danh sách channels
```bash
curl -X GET http://localhost:3000/api/channels
```

## 5. Test Recommendations AI
```bash
curl -X GET http://localhost:3000/api/recommendations \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📋 Test Script đầy đủ

```bash
#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Testing API Management${NC}"

# 1. Register user
echo -e "\n${GREEN}1. Registering user...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456","name":"Test User"}')

if echo "$REGISTER_RESPONSE" | grep -q "accessToken"; then
  echo -e "${GREEN}✅ User registered successfully${NC}"
else
  echo -e "${RED}❌ User registration failed${NC}"
  echo "$REGISTER_RESPONSE"
  exit 1
fi

# 2. Login to get token
echo -e "\n${GREEN}2. Logging in...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}')

TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
  echo -e "${GREEN}✅ Login successful, token received${NC}"
else
  echo -e "${RED}❌ Login failed${NC}"
  echo "$LOGIN_RESPONSE"
  exit 1
fi

# 3. Create channel
echo -e "\n${GREEN}3. Creating channel...${NC}"
CHANNEL_RESPONSE=$(curl -s -X POST http://localhost:3000/api/channels \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "channelId": "VTV1",
    "name": "VTV1 - Kênh truyền hình quốc gia",
    "category": "News",
    "logo": "https://example.com/vtv1-logo.png",
    "streamUrl": "https://example.com/vtv1-stream.m3u8",
    "country": "Vietnam",
    "language": "Vietnamese",
    "isGlobal": true
  }')

if echo "$CHANNEL_RESPONSE" | grep -q "Channel created successfully"; then
  echo -e "${GREEN}✅ Channel created successfully${NC}"
else
  echo -e "${RED}❌ Channel creation failed${NC}"
  echo "$CHANNEL_RESPONSE"
fi

# 4. Get channels
echo -e "\n${GREEN}4. Getting channels list...${NC}"
CHANNELS_LIST=$(curl -s -X GET http://localhost:3000/api/channels)

if echo "$CHANNELS_LIST" | grep -q "VTV1"; then
  echo -e "${GREEN}✅ Channels retrieved successfully${NC}"
else
  echo -e "${RED}❌ Failed to retrieve channels${NC}"
fi

# 5. Test recommendations
echo -e "\n${GREEN}5. Testing AI recommendations...${NC}"
RECOMMENDATIONS=$(curl -s -X GET http://localhost:3000/api/recommendations \
  -H "Authorization: Bearer $TOKEN")

if echo "$RECOMMENDATIONS" | grep -q "data"; then
  echo -e "${GREEN}✅ AI Recommendations working${NC}"
else
  echo -e "${RED}❌ AI Recommendations failed${NC}"
  echo "$RECOMMENDATIONS"
fi

echo -e "\n${YELLOW}🎉 API Testing Complete!${NC}"
```

## 🚀 Chạy test script:

```bash
chmod +x test_api.sh
./test_api.sh
```

---

## 📊 Test Cases

### ✅ Success Cases:
- Tạo channel với đầy đủ thông tin
- Tạo channel với thông tin tối thiểu
- Lấy danh sách channels
- AI recommendations hoạt động

### ❌ Error Cases:
- Tạo channel trùng `channelId`
- Thiếu thông tin bắt buộc
- Token không hợp lệ
- Channel không tồn tại

---

## 🔧 Troubleshooting

**Lỗi "Channel đã tồn tại":**
- Đổi `channelId` khác hoặc xóa channel cũ trong DB

**Lỗi "Unauthorized":**
- Kiểm tra JWT token có đúng không
- Đăng nhập lại để lấy token mới

**Lỗi "Thiếu thông tin channel":**
- Đảm bảo có `channelId`, `name`, `streamUrl`

---

**🎯 Happy Testing!**