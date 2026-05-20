import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { Agent } from 'https';
import dns from 'dns';

// Ép dùng IPv4
dns.setDefaultResultOrder('ipv4first');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN!;
const SENDER_EMAIL = process.env.SENDER_EMAIL!;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

export const sendOtpEmail = async (toEmail: string, otp: string) => {
  const accessToken = await oAuth2Client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: SENDER_EMAIL,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: accessToken.token!,
    },
    // Ép IPv4
    tls: {
      rejectUnauthorized: false
    }
  });

  await transporter.sendMail({
    from: `"IPTV App" <${SENDER_EMAIL}>`,
    to: toEmail,
    subject: 'Mã xác thực OTP',
    html: `<h2>Mã OTP của bạn: <b>${otp}</b></h2><p>Mã có hiệu lực trong 5 phút.</p>`,
  });
};