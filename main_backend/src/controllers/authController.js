const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, PatientProfile } = require('../models');

exports.register = async (req, res) => {
    try {
        const { email, password, full_name, role, phone } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "Email này đã được sử dụng!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            email,
            password_hash: hashedPassword,
            full_name,
            role,
            phone,
            is_active: true
        });

        if (role === 'PATIENT') {
            await PatientProfile.create({ user_id: newUser.id });
        }

        res.status(201).json({ status: "success", message: "Đăng ký thành công!", user_id: newUser.id });
    } catch (error) {
        res.status(500).json({ error: "Lỗi Server: " + error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: "Email không tồn tại!" });
        }

        // Kiểm tra trạng thái tài khoản
        if (user.is_active === false || user.is_active === 0) {
            return res.status(403).json({ error: "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Quản trị viên!" });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: "Sai mật khẩu!" });
        }

        const payload = { id: user.id, role: user.role, name: user.full_name };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ 
            status: "success", 
            message: "Đăng nhập thành công!", 
            token: token,
            role: user.role 
        });
    } catch (error) {
        res.status(500).json({ error: "Lỗi Server: " + error.message });
    }
};