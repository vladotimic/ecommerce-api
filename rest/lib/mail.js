const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
};

const sendVerificationEmail = async (name, email, token, origin) => {
  const url = `${origin}/user/verify-email?token=${token}&email=${email}`;
  const subject = 'Email Confirmation';
  const message = `
  <h4>Hello ${name}</h4>
  <p>Please confirm your email by clicking on the following link : 
  <a href="${url}" target="_blank">Verify Email</a></p>
  `;

  await sendEmail(email, subject, message);
};

const sendResetPasswordEmail = async (name, email, token, origin) => {
  const url = `${origin}/user/reset-password?token=${token}&email=${email}`;
  const subject = 'Reset Password';
  const message = `
  <h4>Hello ${name}</h4>
  <p>Please reset password by clicking on the following link : 
  <a href="${url}" target="_blank">Reset Password</a></p>
  `;

  await sendEmail(email, subject, message);
};

module.exports = { sendVerificationEmail, sendResetPasswordEmail };
