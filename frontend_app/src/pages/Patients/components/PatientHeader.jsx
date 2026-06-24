import React, { useState } from 'react';
import { Users, UserPlus, X, Loader2, Mail } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../../services/api';

import PatientPoolModal from './PatientPoolModal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

export default function PatientHeader({ onAssigned }) {
    const [showModal, setShowModal] = useState(false);
    const [showPool, setShowPool] = useState(false);
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAssign = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await api.post('/users/patients/assign', { patient_email: email });
            toast.success(res.data.message);
            setEmail('');
            setShowModal(false);
            onAssigned();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Lỗi khi thêm bệnh nhân!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-outline-variant mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-on-surface tracking-tight uppercase">
                        Quản Lý Bệnh Nhân
                    </h1>
                    <p className="text-xs text-on-surface-variant mt-2 font-bold uppercase tracking-widest">
                        Danh sách hồ sơ bệnh nhân đang được bạn theo dõi và điều trị
                    </p>
                </div>
                <div className="flex gap-3 mt-4 sm:mt-0">
                    <Button
                        variant="secondary"
                        onClick={() => setShowPool(true)}
                        className="flex items-center gap-2"
                    >
                        Hồ sơ chờ tiếp nhận
                    </Button>
                    <Button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2"
                    >
                        Gửi Yêu Cầu
                    </Button>
                </div>
            </div>

            {/* Modal Pool */}
            <PatientPoolModal 
                isOpen={showPool} 
                onClose={() => setShowPool(false)} 
                onAssigned={onAssigned} 
            />

            {/* Modal Thêm */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-scrim/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-surface-container-lowest rounded-lg w-full max-w-md p-8 animate-in zoom-in-95 duration-200 border border-outline-variant">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center mb-8 border-b border-outline-variant pb-4">
                            <div>
                                <h2 className="text-lg font-black text-on-surface uppercase tracking-wide">Yêu Cầu Kết Nối</h2>
                                <p className="text-[10px] font-bold text-on-surface-variant mt-1 uppercase tracking-widest">Nhập email tài khoản bệnh nhân</p>
                            </div>
                            <button
                                onClick={() => { setShowModal(false); setEmail(''); }}
                                className="p-2 rounded-xl hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleAssign} className="space-y-6">
                            <div>
                                <Input
                                    label="Email bệnh nhân"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="patient@example.com"
                                    required
                                    autoFocus
                                    icon={Mail}
                                />
                                <p className="text-[10px] font-bold text-on-surface-variant mt-2">
                                    * Bệnh nhân phải có tài khoản trong hệ thống.
                                </p>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => { setShowModal(false); setEmail(''); }}
                                    className="flex-1"
                                >
                                    Huỷ
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1"
                                >
                                    {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Đang xử lý</> : 'Gửi Yêu Cầu'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
