const { Notification } = require('../models');

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll({
            where: { user_id: req.user.id },
            order: [['createdAt', 'DESC']],
            limit: 50
        });
        res.json({ success: true, data: notifications });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        await Notification.update({ is_read: true }, {
            where: { id, user_id: req.user.id }
        });
        res.json({ success: true, message: 'Đã đánh dấu là đã đọc' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.update({ is_read: true }, {
            where: { user_id: req.user.id, is_read: false }
        });
        res.json({ success: true, message: 'Đã đánh dấu tất cả là đã đọc' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
