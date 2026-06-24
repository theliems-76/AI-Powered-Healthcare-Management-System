import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { loginAPI, resendVerificationAPI } from '../../services/authService';
import { toast } from 'react-toastify';
import { Mail, Lock, RefreshCw } from 'lucide-react';

import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const[rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [needsVerification, setNeedsVerification] = useState(false);
    const [isResending, setIsResending] = useState(false);
    
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setNeedsVerification(false);
        try {
            const data = await loginAPI(email, password);
            await login(data.token, data.role, rememberMe);
            toast.success('Đăng nhập thành công!');
            navigate('/dashboard'); 
        } catch (error) {
            if (error && error.requiresVerification) {
                setNeedsVerification(true);
                toast.error(error.error);
            } else {
                toast.error(typeof error === 'string' ? error : (error.message || 'Đăng nhập thất bại!'));
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendVerification = async () => {
        setIsResending(true);
        try {
            const res = await resendVerificationAPI(email);
            toast.success(res.message);
            setNeedsVerification(false);
        } catch (err) {
            toast.error(err);
        } finally {
            setIsResending(false);
        }
    };

    return (
        <AuthLayout 
            title="Đăng Nhập" 
            subtitle="Vui lòng nhập tài khoản Bác sĩ hoặc Bệnh nhân để tiếp tục."
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input 
                    label="Địa chỉ Email"
                    icon={Mail} type="email" placeholder="name@hospital.com" required
                    value={email} onChange={(e) => setEmail(e.target.value)}
                />

                <Input 
                    label="Mật khẩu"
                    icon={Lock} type="password" placeholder="••••••••" required
                    value={password} onChange={(e) => setPassword(e.target.value)}
                />

                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                        {}
                        <input 
                            type="checkbox" 
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 cursor-pointer" 
                        />
                        <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider select-none">Ghi nhớ phiên</span>
                    </label>
                    {}
                    <Link to="/forgot-password" className="text-xs font-semibold text-primary hover:text-primary-container uppercase tracking-wider transition-colors">
                        Quên mật khẩu?
                    </Link>
                </div>

                <div className="pt-2 flex flex-col gap-3">
                    <Button type="submit" isLoading={isLoading} className="w-full">
                        {isLoading ? 'Đang xác thực...' : 'Đăng Nhập Hệ Thống'}
                    </Button>
                    
                    {needsVerification && (
                        <Button 
                            type="button"
                            variant="secondary"
                            onClick={handleResendVerification}
                            disabled={isResending}
                            className="w-full uppercase tracking-wider text-xs font-semibold"
                        >
                            {isResending ? (
                                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                                <Mail className="w-4 h-4 mr-2" />
                            )}
                            {isResending ? 'Đang gửi lại...' : 'Gửi lại Email Xác Thực'}
                        </Button>
                    )}
                </div>

                <div className="pt-6 space-y-3">
                    <p className="text-center text-xs text-on-surface-variant font-semibold uppercase tracking-wider">
                        Chưa có tài khoản? <Link to="/register" className="text-primary hover:underline">Đăng ký ngay</Link>
                    </p>
                    <p className="text-center text-xs text-outline font-semibold uppercase tracking-wider">
                        <a href="mailto:admin@hiepsitieuduong.online?subject=Yêu cầu cấp tài khoản Y Tế" 
                           className="hover:text-on-surface transition-colors">
                           Liên hệ Quản trị viên
                        </a>
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
}