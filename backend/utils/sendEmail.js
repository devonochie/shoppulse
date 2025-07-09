const nodemailer = require('nodemailer');
require('dotenv').config();


const FRONTEND_URL = "http://localhost:3000"

const sendEmail = async (user) => {

    try {
        if (!user.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
            throw new Error('Invalid or missing email address');
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"William Ecoomerce" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Password Reset Request',
            text: `You requested a password reset. Click the link below:\n\n${FRONTEND_URL}/reset-password?token=${user.resetToken}\n\nIf you did not request this, please ignore this email.`,
        };
        // 
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);

        return { success: true, message: 'Reset link sent to your email' };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, message: 'Failed to send reset link' };
    }
};

module.exports = sendEmail;
