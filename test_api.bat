@echo off
REM API Management Test Script for Windows
REM Colors (Windows CMD doesn't support ANSI colors well, using simple text)

echo 🚀 Testing API Management

REM 1. Register user
echo.
echo 1. Registering user...
curl -s -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"123456\",\"name\":\"Test User\"}" > register_response.json

findstr /C:"accessToken" register_response.json >nul
if %errorlevel% equ 0 (
    echo ✅ User registered successfully
) else (
    echo ❌ User registration failed
    type register_response.json
    goto :error
)

REM 2. Login to get token
echo.
echo 2. Logging in...
curl -s -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"123456\"}" > login_response.json

for /f "tokens=2 delims=:," %%a in ('findstr "accessToken" login_response.json') do (
    set TOKEN=%%a
    goto :token_found
)

:token_found
set TOKEN=%TOKEN:"=%
set TOKEN=%TOKEN: =%

if defined TOKEN (
    echo ✅ Login successful, token received
) else (
    echo ❌ Login failed
    type login_response.json
    goto :error
)

REM 3. Create channel
echo.
echo 3. Creating channel...
curl -s -X POST http://localhost:3000/api/channels -H "Content-Type: application/json" -H "Authorization: Bearer %TOKEN%" -d "{\"channelId\":\"VTV1\",\"name\":\"VTV1 - Kênh truyền hình quốc gia\",\"category\":\"News\",\"logo\":\"https://example.com/vtv1-logo.png\",\"streamUrl\":\"https://example.com/vtv1-stream.m3u8\",\"country\":\"Vietnam\",\"language\":\"Vietnamese\",\"isGlobal\":true}" > channel_response.json

findstr /C:"Channel created successfully" channel_response.json >nul
if %errorlevel% equ 0 (
    echo ✅ Channel created successfully
) else (
    echo ❌ Channel creation failed
    type channel_response.json
)

REM 4. Get channels
echo.
echo 4. Getting channels list...
curl -s -X GET http://localhost:3000/api/channels > channels_list.json

findstr /C:"VTV1" channels_list.json >nul
if %errorlevel% equ 0 (
    echo ✅ Channels retrieved successfully
) else (
    echo ❌ Failed to retrieve channels
)

REM 5. Test recommendations
echo.
echo 5. Testing AI recommendations...
curl -s -X GET http://localhost:3000/api/recommendations -H "Authorization: Bearer %TOKEN%" > recommendations.json

findstr /C:"data" recommendations.json >nul
if %errorlevel% equ 0 (
    echo ✅ AI Recommendations working
) else (
    echo ❌ AI Recommendations failed
    type recommendations.json
)

echo.
echo 🎉 API Testing Complete!

REM Cleanup
del register_response.json login_response.json channel_response.json channels_list.json recommendations.json 2>nul
goto :end

:error
echo.
echo ❌ Test failed! Check responses above.
del *.json 2>nul
exit /b 1

:end