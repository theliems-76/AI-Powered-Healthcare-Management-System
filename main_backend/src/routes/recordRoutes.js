const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const recordController = require('../controllers/recordController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateDiagnosticInput } = require('../middlewares/validationMiddleware');

// Lưới bảo vệ riêng cho AI: Chống DDoS và chống cạn Quota Gemini (5 lần/15 phút)
const aiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: { error: "Bạn đã vượt quá số lần sử dụng Trợ lý AI miễn phí. Vui lòng thử lại sau 15 phút." },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/analyze', authMiddleware.verifyToken, aiRateLimiter, validateDiagnosticInput, recordController.createDiagnosticRecord);
router.get('/history', authMiddleware.verifyToken, recordController.getPatientHistory);
router.get('/:id', authMiddleware.verifyToken, recordController.getRecordById);

module.exports = router;