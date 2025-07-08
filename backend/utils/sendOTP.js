const nodemailer = require('nodemailer');

const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // TLS (STARTTLS)
    auth: {
      user: process.env.EMAIL_USER,  // Example: yourgmail@gmail.com
      pass: process.env.EMAIL_PASS,  // Your Gmail App Password (not your normal Gmail password)
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for Exam Portal Login',
    text: `Your OTP is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOTP;
