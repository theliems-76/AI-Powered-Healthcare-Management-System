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
            toast.error(error.response?.data?.error || 'L?i khi thêm b?nh nhân!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 border-b border-slate-200 mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800  flex items-center gap-2">
                        <Users className="w-7 h-7 text-blue-600" /> Qu?n Lý B?nh Nhân
                    </h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium">
                        Danh sách h? so b?nh nhân dang du?c b?n theo dõi và di?u tr?.
                    </p>
                </div>
                <div className="flex gap-3 mt-4 sm:mt-0">
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-md shadow-blue-200 transition-all active:scale-95"
                    >
                        <UserPlus className="w-4 h-4" /> Thêm b?nh nhân
                    </button>
                </div>
            </div>

            {}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
                        {}
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-slate-800">Thêm B?nh Nhân M?i</h2>
                                <p className="text-xs text-slate-500 mt-0.5">Nh?p email tài kho?n b?nh nhân d? gán vào danh sách c?a b?n.</p>
                            </div>
                            <button
                                onClick={() => { setShowModal(false); setEmail(''); }}
                                className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {}
                        <form onSubmit={handleAssign} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                                    Email b?nh nhân
                                </label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="patient@example.com"
                                        required
                                        autoFocus
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                                <p className="text-[11px] text-slate-400 mt-1.5">
                                    * B?nh nhân ph?i có tài kho?n trong h? th?ng v?i role PATIENT.
                                </p>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => { setShowModal(false); setEmail(''); }}
                                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
                                >
                                    Hu?
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Ðang x? lý...</> : 'Xác nh?n thêm'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
