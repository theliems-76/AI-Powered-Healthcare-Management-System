import React, { useState } from 'react';
import { Users, UserPlus, X, Loader2, Mail } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../../services/api';

export default function PatientHeader({ onAssigned }) {
    const [showModal, setShowModal] = useState(false);
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
            <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-slate-100 mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                        Quản Lý Bệnh Nhân
                    </h1>
                    <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest">
                        Danh sách hồ sơ bệnh nhân đang được bạn theo dõi và điều trị
                    </p>
                </div>
                <div className="flex gap-3 mt-4 sm:mt-0">
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-6 py-3 font-black text-white bg-slate-900 rounded-xl hover:bg-slate-800 shadow-xl shadow-slate-900/10 transition-all active:scale-95 text-[11px] uppercase tracking-widest"
                    >
                        Thêm bệnh nhân
                    </button>
                </div>
            </div>

            {}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                            <div>
                                <h2 className="text-lg font-black text-slate-900 uppercase tracking-wide">Thêm Bệnh Nhân Mới</h2>
                                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Nhập email tài khoản bệnh nhân</p>
                            </div>
                            <button
                                onClick={() => { setShowModal(false); setEmail(''); }}
                                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleAssign} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">
                                    Email bệnh nhân
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="patient@example.com"
                                        required
                                        autoFocus
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all placeholder:font-medium placeholder:text-slate-400"
                                    />
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 mt-2">
                                    * Bệnh nhân phải có tài khoản trong hệ thống.
                                </p>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => { setShowModal(false); setEmail(''); }}
                                    className="flex-1 py-3.5 rounded-xl border-2 border-slate-200 text-slate-600 font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 hover:border-slate-300 transition-colors"
                                >
                                    Huỷ
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 py-3.5 rounded-xl bg-slate-900 text-white font-black text-[11px] uppercase tracking-widest hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10"
                                >
                                    {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Đang xử lý</> : 'Xác nhận thêm'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
