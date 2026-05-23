import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Lock, ArrowLeft } from 'lucide-react';
import api from '../../services/api';

import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            toast.error("Không tìm thấy mã khôi phục!");
            navigate('/login');
        }
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return toast.error("Mật khẩu xác nhận không khớp!");
        }

        setIsLoading(true);
        try {
            const res = await api.post('/auth/reset-password', { token, newPassword: password });
            toast.success(res.data.message || 'Đổi mật khẩu thành công!');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Lỗi đổi mật khẩu!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout 
            title="Đặt Lại Mật Khẩu" 
            subtitle="Vui lòng nhập mật khẩu mới cho tài khoản của bạn."
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input 
                    label="Mật khẩu mới"
                    icon={Lock} type="password" placeholder="••••••••" required
                    value={password} onChange={(e) => setPassword(e.target.value)}
                />

                <Input 
                    label="Xác nhận Mật khẩu mới"
                    icon={Lock} type="password" placeholder="••••••••" required
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <div className="pt-2">
                    <Button type="submit" isLoading={isLoading}>
                        {isLoading ? 'Đang cập nhật...' : 'Xác Nhận Đổi Mật Khẩu'}
                    </Button>
                </div>

                <div className="text-center pt-4">
                    <Link to="/login" className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
                        <ArrowLeft size={14} />
                        Hủy & Quay lại
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
