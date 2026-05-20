import nodemailer from 'nodemailer';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

const SENDER_EMAIL = process.env.SENDER_EMAIL!;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD!;

export const sendOtpEmail = async (toEmail: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: SENDER_EMAIL,
      pass: GMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"IPTV App" <${SENDER_EMAIL}>`,
    to: toEmail,
    subject: 'Mã xác thực OTP',
    html: `<h2>Mã OTP của bạn: <b>${otp}</b></h2><p>Mã có hiệu lực trong 5 phút.</p>`,
  });
};