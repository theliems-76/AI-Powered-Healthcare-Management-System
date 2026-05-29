import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerAPI } from '../../services/authService';
import { toast } from 'react-toastify';
import { Mail, Lock, User, Phone } from 'lucide-react';

import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function Register() {
    const [formData, setFormData] = useState({
        full_name: '', email: '', phone: '', password: '', confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData,[e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return toast.error("❌ Mật khẩu xác nhận không khớp!");
        }

        setIsLoading(true);
        try {
            const res = await registerAPI(formData.email, formData.password, formData.full_name, formData.phone);
            toast.success(res.message || '🎉 Đăng ký thành công! Vui lòng KIỂM TRA EMAIL (cả hộp thư Rác/Spam) để xác thực tài khoản trước khi đăng nhập.', { autoClose: 10000 });
            navigate('/login');
        } catch (error) {
            toast.error(`❌ ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout 
            title="Tạo Tài Khoản Mới" 
            subtitle="Bắt đầu hành trình chăm sóc sức khỏe của bạn cùng AI."
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Họ và Tên" name="full_name" icon={User} type="text" required
                    value={formData.full_name} onChange={handleChange} placeholder="Nguyễn Văn A" />

                <Input label="Email" name="email" icon={Mail} type="email" required
                    value={formData.email} onChange={handleChange} placeholder="name@example.com" />

                <Input label="Số điện thoại" name="phone" icon={Phone} type="tel" 
                    value={formData.phone} onChange={handleChange} placeholder="0987654321" />

                <Input label="Mật khẩu" name="password" icon={Lock} type="password" required
                    value={formData.password} onChange={handleChange} placeholder="••••••••" />

                <Input label="Xác nhận Mật khẩu" name="confirmPassword" icon={Lock} type="password" required
                    value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" />

                <div className="pt-4">
                    <Button type="submit" isLoading={isLoading}>
                        {isLoading ? 'Đang tạo tài khoản...' : 'Đăng Ký Miễn Phí'}
                    </Button>
                </div>

                <p className="text-center text-[11px] text-slate-500 font-bold uppercase tracking-widest pt-6">
                    Đã có tài khoản? <Link to="/login" className="font-black text-indigo-600 hover:underline">Đăng nhập ngay</Link>
                </p>
            </form>
        </AuthLayout>
    );
}