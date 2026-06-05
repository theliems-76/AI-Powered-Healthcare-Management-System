const express = require('express');
const router = express.Router();
const aiChatController = require('../controllers/aiChatController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/history', authMiddleware.verifyToken, aiChatController.getChatHistory);
router.post('/', authMiddleware.verifyToken, aiChatController.processChat);
router.post('/webhook/appointment', aiChatController.webhookBookAppointment);

module.exports = router;
