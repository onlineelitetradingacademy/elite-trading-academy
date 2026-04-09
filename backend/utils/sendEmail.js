const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const brandColor = '#F0A500';
const darkBg = '#0A0A0F';

const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f4f4; }
    .wrapper { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: ${darkBg}; padding: 30px 40px; text-align: center; }
    .header h1 { color: ${brandColor}; font-size: 24px; font-weight: 700; letter-spacing: 2px; }
    .header p { color: #888; font-size: 12px; margin-top: 4px; }
    .body { padding: 40px; }
    .body h2 { color: #0A0A0F; font-size: 22px; margin-bottom: 12px; }
    .body p { color: #444; line-height: 1.7; margin-bottom: 16px; font-size: 15px; }
    .otp-box { background: ${darkBg}; color: ${brandColor}; font-size: 36px; font-weight: 700; letter-spacing: 12px; text-align: center; padding: 20px; border-radius: 8px; margin: 24px 0; }
    .btn { display: inline-block; background: ${brandColor}; color: #000; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 15px; margin: 16px 0; }
    .info-box { background: #f8f9fa; border-left: 4px solid ${brandColor}; padding: 16px 20px; border-radius: 4px; margin: 20px 0; }
    .footer { background: ${darkBg}; padding: 24px 40px; text-align: center; }
    .footer p { color: #666; font-size: 12px; line-height: 1.6; }
    .footer a { color: ${brandColor}; text-decoration: none; }
    .social { margin: 12px 0; }
    .social a { color: ${brandColor}; text-decoration: none; margin: 0 8px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>ELITE Trading Academy</h1>
      <p>Where Traders Become Elite</p>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      <div class="social">
        <a href="https://instagram.com/elitetradingacademy">Instagram</a>
        <a href="https://youtube.com/@elitetradingacademy">YouTube</a>
        <a href="https://t.me/elitetradingacademy">Telegram</a>
      </div>
      <p>© ${new Date().getFullYear()} ELITE Trading Academy. All rights reserved.<br>
      Ludhiana, Punjab, India | <a href="mailto:info@elitetradingacademy.in">info@elitetradingacademy.in</a></p>
      <p style="margin-top:8px; font-size:11px; color:#555;">If you didn't request this email, please ignore it.</p>
    </div>
  </div>
</body>
</html>`;

// ── Email Templates ───────────────────────────────────────────────
const templates = {
  emailOTP: (name, otp) =>
    baseTemplate(`
    <h2>Verify Your Email 📧</h2>
    <p>Hi ${name},</p>
    <p>Use the OTP below to verify your email address. This code expires in <strong>10 minutes</strong>.</p>
    <div class="otp-box">${otp}</div>
    <p>Do not share this OTP with anyone. ELITE Trading Academy will never ask for your OTP.</p>`),

  welcome: (name) =>
    baseTemplate(`
    <h2>Welcome to ELITE Trading Academy! 🎉</h2>
    <p>Hi ${name},</p>
    <p>You've successfully joined <strong>ELITE Trading Academy</strong> — your journey to becoming an elite trader starts today!</p>
    <div class="info-box">
      <p>✅ Your account is now active<br>
      ✅ Browse our courses and batches<br>
      ✅ Join our Telegram community<br>
      ✅ Follow us on Instagram @elitetradingacademy</p>
    </div>
    <a href="${process.env.CLIENT_URL}/courses" class="btn">Explore Courses →</a>`),

  enrollmentConfirmation: (name, courseName, amount) =>
    baseTemplate(`
    <h2>Enrollment Confirmed! 🎓</h2>
    <p>Hi ${name},</p>
    <p>You've successfully enrolled in <strong>${courseName}</strong>. Start learning right away!</p>
    <div class="info-box">
      <p>💳 Amount Paid: <strong>₹${amount}</strong><br>
      📚 Course: <strong>${courseName}</strong><br>
      🚀 Access: <strong>Instant</strong></p>
    </div>
    <a href="${process.env.CLIENT_URL}/dashboard/courses" class="btn">Start Learning →</a>`),

  resetPassword: (name, resetUrl) =>
    baseTemplate(`
    <h2>Reset Your Password 🔐</h2>
    <p>Hi ${name},</p>
    <p>You requested a password reset. Click the button below. This link expires in <strong>10 minutes</strong>.</p>
    <a href="${resetUrl}" class="btn">Reset Password →</a>
    <p style="margin-top:16px; color:#888; font-size:13px;">If you didn't request this, please ignore this email and your password will remain unchanged.</p>`),

  affiliateApproved: (name, code) =>
    baseTemplate(`
    <h2>You're Now an Affiliate! 🤝</h2>
    <p>Hi ${name},</p>
    <p>Congratulations! Your affiliate application has been <strong>approved</strong>.</p>
    <div class="info-box">
      <p>🔗 Your Affiliate Code: <strong>${code}</strong><br>
      💰 Earn commission on every successful referral<br>
      📊 Track your earnings in your dashboard</p>
    </div>
    <a href="${process.env.CLIENT_URL}/dashboard/affiliate" class="btn">View Affiliate Dashboard →</a>`),

  webinarReminder: (name, webinarTitle, scheduledAt, link) =>
    baseTemplate(`
    <h2>Webinar Reminder 📅</h2>
    <p>Hi ${name},</p>
    <p>Your webinar is starting soon!</p>
    <div class="info-box">
      <p>📌 <strong>${webinarTitle}</strong><br>
      🕐 ${new Date(scheduledAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST<br>
      🔗 Join Link: <a href="${link}">${link}</a></p>
    </div>
    <a href="${link}" class="btn">Join Webinar →</a>`),

  franchiseLeadAck: (name) =>
    baseTemplate(`
    <h2>Application Received! 🤝</h2>
    <p>Hi ${name},</p>
    <p>Thank you for your interest in the <strong>ELITE Trading Academy Franchise Programme</strong>.</p>
    <p>Our team has received your application and will reach out to you within <strong>24-48 hours</strong> for an initial screening call.</p>
    <div class="info-box">
      <p>⚠️ Please note: Complete franchise details are shared only after the initial screening. This process ensures we partner with the right individuals who are serious about building a trading education business.</p>
    </div>`),

  newDeviceLogin: (name, device, time) =>
    baseTemplate(`
    <h2>New Login Detected ⚠️</h2>
    <p>Hi ${name},</p>
    <p>A new login was detected on your account.</p>
    <div class="info-box">
      <p>📱 Device: ${device}<br>⏰ Time: ${time}</p>
    </div>
    <p>If this was you, no action needed. If not, please <a href="${process.env.CLIENT_URL}/account/security">secure your account immediately</a>.</p>`),
};

// ── Send Email Function ───────────────────────────────────────────
const sendEmail = async ({ to, subject, template, data = {} }) => {
  let html;
  switch (template) {
    case 'emailOTP':
      html = templates.emailOTP(data.name, data.otp);
      break;
    case 'welcome':
      html = templates.welcome(data.name);
      break;
    case 'enrollmentConfirmation':
      html = templates.enrollmentConfirmation(
        data.name,
        data.courseName,
        data.amount,
      );
      break;
    case 'resetPassword':
      html = templates.resetPassword(data.name, data.resetUrl);
      break;
    case 'affiliateApproved':
      html = templates.affiliateApproved(data.name, data.code);
      break;
    case 'webinarReminder':
      html = templates.webinarReminder(
        data.name,
        data.webinarTitle,
        data.scheduledAt,
        data.link,
      );
      break;
    case 'franchiseLeadAck':
      html = templates.franchiseLeadAck(data.name);
      break;
    case 'newDeviceLogin':
      html = templates.newDeviceLogin(data.name, data.device, data.time);
      break;
    default:
      html = baseTemplate(`<p>${data.body || ''}</p>`);
  }
  await transporter.sendMail({
    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
