// src/utils/sendMail.js

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendMail = async (options) => {
  try {
    console.log('🔍 FROM address:', process.env.SMTP_FROM);
    const info = await transporter.sendMail({
      ...options,
      from: process.env.SMTP_FROM,
    });
    console.log('✅ Email sent:', info.response);
    return info;
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    throw error;
  }
};

export default sendMail;
