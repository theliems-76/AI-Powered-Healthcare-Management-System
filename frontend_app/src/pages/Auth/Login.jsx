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
                            className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer" 
                        />
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest select-none">Ghi nhớ phiên</span>
                    </label>
                    {}
                    <Link to="/forgot-password" className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest transition-colors">
                        Quên mật khẩu?
                    </Link>
                </div>

                <div className="pt-2 flex flex-col gap-3">
                    <Button type="submit" isLoading={isLoading}>
                        {isLoading ? 'Đang xác thực...' : 'Đăng Nhập Hệ Thống'}
                    </Button>
                    
                    {needsVerification && (
                        <button 
                            type="button"
                            onClick={handleResendVerification}
                            disabled={isResending}
                            className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border-2 border-amber-500 text-amber-600 font-black text-[11px] uppercase tracking-widest hover:bg-amber-50 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
                        >
                            {isResending ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                                <Mail className="w-4 h-4" />
                            )}
                            {isResending ? 'Đang gửi lại...' : 'Gửi lại Email Xác Thực'}
                        </button>
                    )}
                </div>

                <div className="pt-6 space-y-3">
                    <p className="text-center text-[11px] text-slate-500 font-bold uppercase tracking-widest">
                        Chưa có tài khoản? <Link to="/register" className="font-black text-indigo-600 hover:underline">Đăng ký ngay</Link>
                    </p>
                    <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        <a href="mailto:admin@hiepsitieuduong.online?subject=Yêu cầu cấp tài khoản Y Tế" 
                           className="hover:text-slate-600 transition-colors">
                           Liên hệ Quản trị viên
                        </a>
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
}