import nodemailer from 'nodemailer';

// Gọi biến từ file .env
const EMAIL_USER = process.env.SENDER_EMAIL;
const EMAIL_PASS = process.env.GMAIL_APP_PASSWORD; 

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export const sendOtpEmail = async (toEmail: string, otp: string) => {
  try {
    await transporter.sendMail({
      from: `"Nam API App" <${EMAIL_USER}>`, 
      to: toEmail, 
      subject: 'Mã xác thực OTP',
      html: `<h2>Mã OTP của bạn: <b style="color: blue;">${otp}</b></h2><p>Mã có hiệu lực trong 5 phút.</p>`,
    });
    console.log(`Đã gửi OTP thành công tới: ${toEmail}`);
  } catch (error) {
    console.error(`Lỗi gửi email tới ${toEmail}:`, error);
  }
};