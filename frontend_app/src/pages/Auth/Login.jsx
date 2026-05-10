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
                            className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer" 
                        />
                        <span className="text-slate-600 font-medium select-none">Ghi nhớ tôi</span>
                    </label>
                    {}
                    <Link to="/forgot-password" className="font-bold text-blue-600 hover:text-blue-800 transition-colors">
                        Quên mật khẩu?
                    </Link>
                </div>

                <Button type="submit" isLoading={isLoading}>
                    {isLoading ? 'Đang xác thực...' : 'Đăng Nhập Hệ Thống'}
                </Button>

                <p className="text-center text-sm text-slate-500 font-medium">
                    Chưa có tài khoản? <Link to="/register" className="font-bold text-blue-600 hover:underline">Đăng ký ngay</Link>
                </p>
                {}
                <p className="text-center text-sm text-slate-500 font-medium">
                    <a href="mailto:admin@clinicalai.com?subject=Yêu cầu cấp tài khoản Y Tế" 
                       className="font-bold text-blue-600 hover:underline">
                       Liên hệ Quản trị viên
                    </a>
                </p>
            </form>
        </AuthLayout>
    );
}