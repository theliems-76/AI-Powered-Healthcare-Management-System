import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('Đang xác thực email của bạn...');

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Không tìm thấy mã xác thực. Đường dẫn không hợp lệ.');
                return;
            }

            try {
                const res = await api.get(`/auth/verify-email?token=${token}`);
                if (res.data.status === 'success') {
                    setStatus('success');
                    setMessage(res.data.message || 'Xác thực email thành công!');
                }
            } catch (err) {
                setStatus('error');
                setMessage(err.response?.data?.error || 'Xác thực thất bại. Đường dẫn có thể đã hết hạn hoặc không hợp lệ.');
            }
        };

        verifyToken();
    }, [token]);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl shadow-slate-200/50 text-center animate-in zoom-in-95 duration-500">
                <div className="flex justify-center mb-6">
                    {status === 'loading' && (
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
                            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                        </div>
                    )}
                    {status === 'success' && (
                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-10 h-10 text-emerald-500" />
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                            <XCircle className="w-10 h-10 text-red-500" />
                        </div>
                    )}
                </div>

                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-3">
                    {status === 'loading' ? 'Đang Xử Lý' : status === 'success' ? 'Thành Công' : 'Thất Bại'}
                </h1>
                
                <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">
                    {message}
                </p>

                {status !== 'loading' && (
                    <Link 
                        to="/login"
                        className="inline-flex justify-center items-center px-8 py-4 bg-slate-900 text-white font-black text-[11px] uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95 w-full"
                    >
                        Trở Về Đăng Nhập
                    </Link>
                )}
            </div>
        </div>
    );
}
