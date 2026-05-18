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
            toast.success('Ðã g?i du?ng d?n khôi ph?c m?t kh?u vào Email c?a b?n!');
            setEmail('');
            setIsLoading(false);
        }, 1500);
    };

    return (
        <AuthLayout 
            title="Khôi Ph?c M?t Kh?u" 
            subtitle="Nh?p email c?a b?n, chúng tôi s? g?i du?ng d?n d?t l?i m?t kh?u."
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input 
                    label="Ð?a ch? Email dã dang ký"
                    icon={Mail} type="email" placeholder="name@hospital.com" required
                    value={email} onChange={(e) => setEmail(e.target.value)}
                />

                <Button type="submit" isLoading={isLoading}>
                    {isLoading ? 'Ðang g?i yêu c?u...' : 'G?i Yêu C?u Khôi Ph?c'}
                </Button>

                <div className="text-center pt-2">
                    <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">
                        <ArrowLeft size={16} />
                        Quay l?i trang Ðang Nh?p
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
