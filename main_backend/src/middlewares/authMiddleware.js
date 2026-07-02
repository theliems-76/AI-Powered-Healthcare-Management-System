const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.verifyToken = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: "Từ chối truy cập! Không tìm thấy Token." });
    }

    try {
        const cleanToken = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;
        
        const verified = jwt.verify(cleanToken, process.env.JWT_SECRET);
        
        // Kiểm tra xem tài khoản có bị admin khóa (is_active = false) không
        const user = await User.findByPk(verified.id, { attributes: ['is_active'] });
        if (!user) {
            return res.status(401).json({ error: "Tài khoản không tồn tại!" });
        }
        if (!user.is_active) {
            return res.status(403).json({ error: "Tài khoản của bạn đã bị khóa! Không thể tiếp tục truy cập." });
        }

        req.user = verified;
        
        next();
    } catch (error) {
        res.status(400).json({ error: "Token không hợp lệ hoặc đã hết hạn!" });
    }
};

exports.checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Access Denied: Bạn không có quyền thực hiện hành động này!" });
        }
        next();
    };
};