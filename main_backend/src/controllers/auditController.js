const { AuditLog, User } = require('../models');
const { Op } = require('sequelize');

exports.getLogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;
        const { action, search } = req.query;

        let whereClause = {};

        if (action && action !== 'ALL') {
            whereClause.action = action;
        }

        let includeClause = [
            {
                model: User,
                attributes: ['full_name', 'email', 'role']
            }
        ];

        if (search) {
            whereClause = {
                ...whereClause,
                [Op.or]: [
                    { action: { [Op.like]: `%${search}%` } },
                    { details: { [Op.like]: `%${search}%` } },
                    { '$User.full_name$': { [Op.like]: `%${search}%` } },
                    { '$User.email$': { [Op.like]: `%${search}%` } }
                ]
            };
        }

        const { count, rows } = await AuditLog.findAndCountAll({
            where: whereClause,
            include: includeClause,
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        res.status(200).json({
            status: 'success',
            data: rows,
            pagination: {
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                limit
            }
        });
    } catch (error) {
        console.error('Lỗi getLogs:', error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
};

// Helper function để ghi log (dùng trong các controller khác)
exports.logAction = async (userId, action, resourceType, resourceId, ipAddress, details) => {
    try {
        // Chống duplicate log do React StrictMode (gọi API 2 lần liên tiếp trong vài giây)
        const twoSecondsAgo = new Date(Date.now() - 2000);
        const recentLog = await AuditLog.findOne({
            where: {
                user_id: userId,
                action: action,
                resource_id: resourceId,
                createdAt: { [Op.gte]: twoSecondsAgo }
            }
        });

        if (recentLog) {
            return; // Đã ghi log hành động này trong 2s qua, bỏ qua để tránh trùng lặp
        }

        await AuditLog.create({
            user_id: userId,
            action,
            resource_type: resourceType,
            resource_id: resourceId,
            ip_address: ipAddress,
            details: typeof details === 'object' ? JSON.stringify(details) : details
        });
    } catch (err) {
        console.error('Lỗi ghi AuditLog:', err.message);
    }
};
