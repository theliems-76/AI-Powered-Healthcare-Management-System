const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const rateLimit = require('express-rate-limit');

// Chống dò mật khẩu (Brute-force protection)
const loginLimiter = rateLimit({
    windowMs: 3 * 60 * 1000, // 3 phút
    max: 5, // Tối đa 5 lần
    message: { error: 'Bạn đã đăng nhập sai quá nhiều lần. Vui lòng thử lại sau 3 phút.' },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/register', authController.register);
router.post('/login', loginLimiter, authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerification);

module.exports = router;