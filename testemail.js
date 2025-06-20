require('dotenv').config();
const nodemailer = require('nodemailer');

async function testMailSender() {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: `"Test Sender" <${process.env.MAIL_USER}>`,
      to: 'harsh261.career@gmail.com', // Change this to the recipient's email
      subject: 'Testing OTP Email',
      text: 'Your OTP is 123456',
      html: '<b>Your OTP is <span style="color:blue;">123456</span></b>',
    });

    console.log('✅ Email sent:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info) || 'Not available in production.');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testMailSender();
