import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, ArrowLeft } from 'lucide-react';
import api from '../../services/api';

import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resetLink, setResetLink] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setResetLink(null);
        try {
            const res = await api.post('/auth/forgot-password', { email });
            toast.success(res.data.message || 'Yêu cầu thành công!');
            // Demo mode: Hiển thị link reset trực tiếp trên màn hình
            if (res.data.token) {
                setResetLink(`/reset-password?token=${res.data.token}`);
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Lỗi khi gửi yêu cầu!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout 
            title="Khôi Phục Mật Khẩu" 
            subtitle="Nhập email của bạn, chúng tôi sẽ cấp lại quyền truy cập."
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input 
                    label="Địa chỉ Email đã đăng ký"
                    icon={Mail} type="email" placeholder="name@hospital.com" required
                    value={email} onChange={(e) => setEmail(e.target.value)}
                />

                <div className="pt-2">
                    <Button type="submit" isLoading={isLoading}>
                        {isLoading ? 'Đang xử lý...' : 'Gửi Yêu Cầu Khôi Phục'}
                    </Button>
                </div>
                
                {resetLink && (
                    <div className="mt-4 p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl animate-in fade-in zoom-in duration-300">
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2">Chế độ Demo - Link Đặt lại:</p>
                        <Link to={resetLink} className="text-sm font-bold text-indigo-700 underline break-all">
                            Bấm vào đây để đặt lại mật khẩu
                        </Link>
                    </div>
                )}

                <div className="text-center pt-4">
                    <Link to="/login" className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
                        <ArrowLeft size={14} />
                        Quay lại Đăng Nhập
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}