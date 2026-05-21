import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtpEmail = async (toEmail: string, otp: string) => {
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: toEmail,
    subject: 'Mã xác thực OTP',
    html: `<h2>Mã OTP của bạn: <b>${otp}</b></h2><p>Mã có hiệu lực trong 5 phút.</p>`,
  });
};