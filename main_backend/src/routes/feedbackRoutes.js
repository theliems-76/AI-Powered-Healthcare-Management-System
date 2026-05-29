const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

// Bệnh nhân gửi đánh giá
router.post('/', verifyToken, feedbackController.submitFeedback);

// Admin xem danh sách đánh giá
router.get('/', verifyToken, checkRole(['ADMIN']), feedbackController.getFeedbacks);

module.exports = router;
