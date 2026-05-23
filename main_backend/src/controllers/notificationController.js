const { Notification, User, AuditLog } = require('../models');

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

exports.broadcast = async (req, res) => {
    try {
        const { title, message, type, targetRoles } = req.body;
        
        let whereClause = {};
        if (targetRoles && targetRoles.length > 0 && !targetRoles.includes('ALL')) {
            whereClause.role = targetRoles;
        }

        const users = await User.findAll({
            where: whereClause,
            attributes: ['id']
        });

        const notifications = users.map(user => ({
            user_id: user.id,
            title,
            message,
            type: type || 'SYSTEM',
            is_read: false
        }));

        await Notification.bulkCreate(notifications);
        
        if (req.user && req.user.id) {
            await AuditLog.create({
                user_id: req.user.id,
                action: 'BROADCAST_NOTIFICATION',
                resource_type: 'Notification',
                details: JSON.stringify({ title, message, type, count: notifications.length, targetRoles }),
                ip_address: req.ip
            });
        }
        
        res.json({ success: true, message: `Đã gửi thông báo thành công tới ${notifications.length} người dùng.` });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
