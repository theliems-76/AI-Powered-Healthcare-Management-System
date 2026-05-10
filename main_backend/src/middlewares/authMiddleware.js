const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: "Từ chối truy cập! Không tìm thấy Token." });
    }

    try {
        const cleanToken = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;
        
        const verified = jwt.verify(cleanToken, process.env.JWT_SECRET);
        
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