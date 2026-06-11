const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.SENDER_EMAIL;

export const sendOtpEmail = async (toEmail: string, otp: string) => {
  try {
    if (!BREVO_API_KEY) {
      console.warn('Cảnh báo: Chưa cấu hình BREVO_API_KEY trong .env');
    }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY as string,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          name: "App API Management",
          email: SENDER_EMAIL
        },
        to: [
          {
            email: toEmail
          }
        ],
        subject: "Mã xác thực OTP của bạn",
        htmlContent: `<h2>Mã OTP của bạn: <b style="color: blue;">${otp}</b></h2><p>Mã có hiệu lực trong 5 phút. Vui lòng không chia sẻ mã này.</p>`
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Brevo API Error:', errorData);
      throw new Error('Lỗi từ máy chủ Brevo');
    }

    console.log(`✅ Đã gửi OTP thành công tới: ${toEmail} qua Brevo`);
  } catch (error: any) {
    console.error(`❌ Lỗi gửi email tới ${toEmail}:`, error.message);
  }
};