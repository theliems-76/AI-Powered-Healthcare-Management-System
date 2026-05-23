import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { loginAPI } from '../../services/authService';
import { toast } from 'react-toastify';
import { Mail, Lock } from 'lucide-react';

import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const[rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const data = await loginAPI(email, password);
            await login(data.token, data.role, rememberMe);
            toast.success('Đăng nhập thành công!');
            navigate('/dashboard'); 
        } catch (error) {
            toast.error(typeof error === 'string' ? error : (error.message || 'Đăng nhập thất bại!'));
        } finally {
            setIsLoading(false);
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

                <div className="pt-2">
                    <Button type="submit" isLoading={isLoading}>
                        {isLoading ? 'Đang xác thực...' : 'Đăng Nhập Hệ Thống'}
                    </Button>
                </div>

                <div className="pt-6 space-y-3">
                    <p className="text-center text-[11px] text-slate-500 font-bold uppercase tracking-widest">
                        Chưa có tài khoản? <Link to="/register" className="font-black text-indigo-600 hover:underline">Đăng ký ngay</Link>
                    </p>
                    <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        <a href="mailto:admin@clinicalai.com?subject=Yêu cầu cấp tài khoản Y Tế" 
                           className="hover:text-slate-600 transition-colors">
                           Liên hệ Quản trị viên
                        </a>
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
}