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
            return toast.error("? M?t kh?u xác nh?n không kh?p!");
        }

        setIsLoading(true);
        try {
            await registerAPI(formData.email, formData.password, formData.full_name, formData.phone);
            toast.success('?? Ðang ký thành công! Vui lòng dang nh?p.');
            navigate('/login');
        } catch (error) {
            toast.error(`? ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout 
            title="T?o Tài Kho?n M?i" 
            subtitle="B?t d?u hành trình cham sóc s?c kh?e c?a b?n cùng AI."
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="H? và Tên" name="full_name" icon={User} type="text" required
                    value={formData.full_name} onChange={handleChange} placeholder="Nguy?n Van A" />

                <Input label="Email" name="email" icon={Mail} type="email" required
                    value={formData.email} onChange={handleChange} placeholder="name@example.com" />

                <Input label="S? di?n tho?i" name="phone" icon={Phone} type="tel" 
                    value={formData.phone} onChange={handleChange} placeholder="0987654321" />

                <Input label="M?t kh?u" name="password" icon={Lock} type="password" required
                    value={formData.password} onChange={handleChange} placeholder="••••••••" />

                <Input label="Xác nh?n M?t kh?u" name="confirmPassword" icon={Lock} type="password" required
                    value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" />

                <Button type="submit" isLoading={isLoading} className="mt-2">
                    {isLoading ? 'Ðang t?o tài kho?n...' : 'Ðang Ký Mi?n Phí'}
                </Button>

                <p className="text-center text-sm text-slate-500 font-medium pt-4">
                    Ðã có tài kho?n? <Link to="/login" className="font-bold text-blue-600 hover:underline">Ðang nh?p ngay</Link>
                </p>
            </form>
        </AuthLayout>
    );
}
