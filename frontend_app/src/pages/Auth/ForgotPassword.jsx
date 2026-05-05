import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, ArrowLeft } from 'lucide-react';

import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            toast.success('Đã gửi đường dẫn khôi phục mật khẩu vào Email của bạn!');
            setEmail('');
            setIsLoading(false);
        }, 1500);
    };

    return (
        <AuthLayout 
            title="Khôi Phục Mật Khẩu" 
            subtitle="Nhập email của bạn, chúng tôi sẽ gửi đường dẫn đặt lại mật khẩu."
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input 
                    label="Địa chỉ Email đã đăng ký"
                    icon={Mail} type="email" placeholder="name@hospital.com" required
                    value={email} onChange={(e) => setEmail(e.target.value)}
                />

                <Button type="submit" isLoading={isLoading}>
                    {isLoading ? 'Đang gửi yêu cầu...' : 'Gửi Yêu Cầu Khôi Phục'}
                </Button>

                <div className="text-center pt-2">
                    <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">
                        <ArrowLeft size={16} />
                        Quay lại trang Đăng Nhập
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}