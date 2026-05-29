const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Op } = require('sequelize');
const { User, PatientProfile } = require('../models');
const { sendEmail } = require('../utils/emailService');

exports.register = async (req, res) => {
    try {
        const { email, password, full_name, role, phone } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            if (existingUser.is_active) {
                return res.status(400).json({ error: "Email này đã được sử dụng và kích hoạt. Vui lòng đăng nhập!" });
            } else {
                // User exists but is NOT active yet. Let's regenerate token and resend email.
                const verificationToken = crypto.randomBytes(32).toString('hex');
                existingUser.verification_token = verificationToken;
                
                // Update password and info if they try to register again
                if (password.length >= 8) {
                    const salt = await bcrypt.genSalt(10);
                    existingUser.password_hash = await bcrypt.hash(password, salt);
                }
                existingUser.full_name = full_name;
                existingUser.phone = phone;
                await existingUser.save();

                const verifyLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}`;
                const emailHtml = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
                        <h2 style="color: #0f172a; text-align: center;">Chào mừng đến với Hệ thống Y Tế AI</h2>
                        <p style="color: #475569; font-size: 16px;">Xin chào <strong>${full_name}</strong>,</p>
                        <p style="color: #475569; font-size: 16px;">Chúng tôi nhận thấy bạn đang yêu cầu đăng ký lại tài khoản. Để hoàn tất, vui lòng xác thực địa chỉ email bằng cách nhấn vào nút bên dưới:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${verifyLink}" style="background-color: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 16px; display: inline-block;">Xác thực Email ngay</a>
                        </div>
                        <p style="color: #94a3b8; font-size: 14px; text-align: center;">Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
                    </div>
                `;
                await sendEmail(email, 'Xác nhận lại tài khoản của bạn', emailHtml);

                return res.status(201).json({ 
                    status: "success", 
                    message: "Tài khoản của bạn chưa được kích hoạt. Chúng tôi vừa gửi lại một mã xác thực mới vào email của bạn!", 
                    user_id: existingUser.id 
                });
            }
        }

        // Validate password strength backend
        if (password.length < 8) {
            return res.status(400).json({ error: "Mật khẩu phải có ít nhất 8 ký tự!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Smart Verification logic: Skip for @test.com or if created by admin (DOCTOR/ADMIN)
        let isActive = false;
        let verificationToken = crypto.randomBytes(32).toString('hex');

        if (email.endsWith('@test.com') || email.endsWith('@healthcare.com') || role !== 'PATIENT') {
            isActive = true;
            verificationToken = null;
        }

        const newUser = await User.create({
            email,
            password_hash: hashedPassword,
            full_name,
            role,
            phone,
            is_active: isActive,
            verification_token: verificationToken
        });

        if (role === 'PATIENT') {
            await PatientProfile.create({ user_id: newUser.id });
        }

        // Send Email if not active
        if (!isActive) {
            const verifyLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}`;
            const emailHtml = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
                    <h2 style="color: #0f172a; text-align: center;">Chào mừng đến với Hệ thống Y Tế AI</h2>
                    <p style="color: #475569; font-size: 16px;">Xin chào <strong>${full_name}</strong>,</p>
                    <p style="color: #475569; font-size: 16px;">Cảm ơn bạn đã đăng ký tài khoản. Để bảo vệ an toàn cho thông tin y tế của bạn, vui lòng xác thực địa chỉ email bằng cách nhấn vào nút bên dưới:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${verifyLink}" style="background-color: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 16px; display: inline-block;">Xác thực Email ngay</a>
                    </div>
                    <p style="color: #94a3b8; font-size: 14px; text-align: center;">Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
                </div>
            `;
            await sendEmail(email, 'Xác thực tài khoản của bạn', emailHtml);
            return res.status(201).json({ status: "success", message: "Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản.", user_id: newUser.id });
        }

        res.status(201).json({ status: "success", message: "Đăng ký thành công!", user_id: newUser.id });
    } catch (error) {
        res.status(500).json({ error: "Lỗi Server: " + error.message });
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) return res.status(400).json({ error: "Token không hợp lệ!" });

        const user = await User.findOne({ where: { verification_token: token } });
        if (!user) {
            return res.status(400).json({ error: "Mã xác thực không hợp lệ hoặc đã được sử dụng!" });
        }

        user.is_active = true;
        user.verification_token = null;
        await user.save();

        res.json({ status: "success", message: "Xác thực email thành công! Bạn có thể đăng nhập ngay." });
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

        if (user.is_active === false || user.is_active === 0) {
            return res.status(403).json({ 
                error: "Tài khoản của bạn chưa được kích hoạt. Vui lòng kiểm tra email.",
                requiresVerification: true,
                email: user.email
            });
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

exports.resendVerification = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        
        if (!user) {
            return res.status(404).json({ error: "Không tìm thấy tài khoản với email này." });
        }
        
        if (user.is_active) {
            return res.status(400).json({ error: "Tài khoản này đã được kích hoạt rồi." });
        }

        const verificationToken = crypto.randomBytes(32).toString('hex');
        user.verification_token = verificationToken;
        await user.save();

        const verifyLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}`;
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
                <h2 style="color: #0f172a; text-align: center;">Xác thực lại tài khoản</h2>
                <p style="color: #475569; font-size: 16px;">Xin chào <strong>${user.full_name}</strong>,</p>
                <p style="color: #475569; font-size: 16px;">Bạn vừa yêu cầu gửi lại email xác thực tài khoản. Vui lòng nhấn vào nút bên dưới để hoàn tất:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verifyLink}" style="background-color: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 16px; display: inline-block;">Xác thực Email ngay</a>
                </div>
                <p style="color: #94a3b8; font-size: 14px; text-align: center;">Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
            </div>
        `;
        await sendEmail(user.email, 'Xác nhận lại tài khoản của bạn', emailHtml);

        res.status(200).json({ status: "success", message: "Đã gửi lại email xác thực thành công. Vui lòng kiểm tra hòm thư của bạn!" });
    } catch (error) {
        res.status(500).json({ error: "Lỗi Server: " + error.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "Email không tồn tại trong hệ thống!" });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.reset_token = resetToken;
        user.reset_token_expires = new Date(Date.now() + 3600000); // 1 hour
        await user.save();

        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
                <h2 style="color: #0f172a; text-align: center;">Yêu cầu Đặt lại Mật khẩu</h2>
                <p style="color: #475569; font-size: 16px;">Xin chào <strong>${user.full_name}</strong>,</p>
                <p style="color: #475569; font-size: 16px;">Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng bấm vào nút dưới đây để tạo mật khẩu mới (Link có hiệu lực trong 1 giờ):</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetLink}" style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 16px; display: inline-block;">Đặt lại Mật khẩu</a>
                </div>
                <p style="color: #94a3b8; font-size: 14px; text-align: center;">Nếu bạn không thực hiện yêu cầu này, hãy đổi mật khẩu hiện tại ngay lập tức để bảo vệ tài khoản.</p>
            </div>
        `;

        await sendEmail(email, 'Khôi phục Mật khẩu Hệ thống Y Tế', emailHtml);

        res.json({ 
            status: "success", 
            message: "Chúng tôi đã gửi một liên kết khôi phục tới email của bạn. Vui lòng kiểm tra hộp thư!"
        });
    } catch (error) {
        res.status(500).json({ error: "Lỗi Server: " + error.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        
        if (newPassword.length < 8) {
            return res.status(400).json({ error: "Mật khẩu mới phải có ít nhất 8 ký tự!" });
        }

        const user = await User.findOne({ 
            where: { 
                reset_token: token,
                reset_token_expires: { [Op.gt]: new Date() }
            } 
        });

        if (!user) {
            return res.status(400).json({ error: "Đường dẫn không hợp lệ hoặc đã hết hạn!" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password_hash = await bcrypt.hash(newPassword, salt);
        user.reset_token = null;
        user.reset_token_expires = null;
        await user.save();

        res.json({ status: "success", message: "Đổi mật khẩu thành công! Hãy đăng nhập lại." });
    } catch (error) {
        res.status(500).json({ error: "Lỗi Server: " + error.message });
    }
};