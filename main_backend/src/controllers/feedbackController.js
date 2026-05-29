const db = require('../models');

exports.submitFeedback = async (req, res) => {
    try {
        const { rating, content } = req.body;
        const user_id = req.user.id;

        if (!rating) {
            return res.status(400).json({ success: false, message: 'Vui lòng cung cấp số sao đánh giá.' });
        }

        const feedback = await db.Feedback.create({
            user_id,
            rating,
            content
        });

        res.status(201).json({ success: true, data: feedback });
    } catch (error) {
        console.error('Lỗi khi gửi đánh giá:', error);
        res.status(500).json({ success: false, message: 'Lỗi server khi gửi đánh giá.' });
    }
};

exports.getFeedbacks = async (req, res) => {
    try {
        const feedbacks = await db.Feedback.findAll({
            include: [{ model: db.User, as: 'Patient', attributes: ['id', 'full_name', 'email'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json({ success: true, data: feedbacks });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách đánh giá:', error);
        res.status(500).json({ success: false, message: 'Lỗi server.' });
    }
};
