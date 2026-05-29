const nodemailer = require('nodemailer');

const createTransporter = () => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('⚠️ EMAIL_USER or EMAIL_PASS is not set in .env! Emails will be printed to console instead of being sent.');
    }

    if (process.env.EMAIL_HOST) {
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT || 587,
            secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    // Fallback to Gmail for simple local testing
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

const sendEmail = async (to, subject, htmlContent) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log('\n================== MOCK EMAIL ==================');
            console.log(`To: ${to}`);
            console.log(`Subject: ${subject}`);
            console.log(`Body (HTML): ${htmlContent}`);
            console.log('================================================\n');
            return true;
        }

        const transporter = createTransporter();
        // Lấy EMAIL_FROM và loại bỏ dấu ngoặc kép nếu có
        let senderEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER;
        if (senderEmail) senderEmail = senderEmail.replace(/['"]/g, '');

        const mailOptions = {
            from: `"Hệ thống Y Tế AI" <${senderEmail}>`,
            to,
            subject,
            html: htmlContent
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

module.exports = {
    sendEmail
};
