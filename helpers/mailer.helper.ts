import { google } from 'googleapis';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
const SENDER_EMAIL = process.env.SENDER_EMAIL;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

export const sendOtpEmail = async (toEmail: string, otp: string) => {
  try {
    const subject = 'Mã xác thực OTP';
    // Mã hóa Tiêu đề để hỗ trợ tiếng Việt có dấu
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    
    // Cấu trúc nội dung Email chuẩn MIME
    const messageParts = [
      `From: Nam API App <${SENDER_EMAIL}>`,
      `To: ${toEmail}`,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${utf8Subject}`,
      '', // Dòng trống bắt buộc phân tách header và body
      `<h2>Mã OTP của bạn: <b style="color: blue;">${otp}</b></h2><p>Mã có hiệu lực trong 5 phút.</p>`,
    ];
    
    const message = messageParts.join('\n');

    // Chuyển đổi sang định dạng base64url mà Google API yêu cầu
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    // Gửi qua giao thức HTTPS (Cổng 443) thay vì SMTP (Cổng 465)
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log(`Đã gửi OTP thành công tới: ${toEmail} qua Gmail API`);
  } catch (error: any) {
    console.error(`Lỗi gửi email tới ${toEmail}:`, error.message);
  }
};