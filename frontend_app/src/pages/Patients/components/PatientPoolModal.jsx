import React, { useState, useEffect } from 'react';
import { X, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../../services/api';

export default function PatientPoolModal({ isOpen, onClose, onAssigned }) {
    const [pool, setPool] = useState([]);
    const [loading, setLoading] = useState(true);
    const [claimingId, setClaimingId] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchPool();
        }
    }, [isOpen]);

    const fetchPool = async () => {
        setLoading(true);
        try {
            const res = await api.get('/doctor/pool');
            setPool(res.data.data);
        } catch (error) {
            toast.error("Lỗi tải danh sách bệnh nhân chờ tiếp nhận!");
        } finally {
            setLoading(false);
        }
    };

    const handleClaim = async (patientProfileId) => {
        setClaimingId(patientProfileId);
        try {
            await api.post('/doctor/pool/claim', { patientProfileId });
            toast.success("Tiếp nhận bệnh nhân thành công!");
            onAssigned();
            fetchPool();
        } catch (error) {
            toast.error(error.response?.data?.error || "Lỗi tiếp nhận bệnh nhân!");
        } finally {
            setClaimingId(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl p-8 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                            <AlertTriangle className="text-rose-500 w-6 h-6" /> Bệnh Nhân Chờ Tiếp Nhận
                        </h2>
                        <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Danh sách bệnh nhân nguy cơ cao chưa có bác sĩ</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                    {loading ? (
                        <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>
                    ) : pool.length === 0 ? (
                        <div className="text-center p-10 text-slate-500 font-bold">Không có bệnh nhân chờ nào.</div>
                    ) : (
                        <div className="space-y-4">
                            {pool.map(p => (
                                <div key={p.id} className="flex flex-col sm:flex-row justify-between sm:items-center bg-rose-50 border border-rose-100 p-5 rounded-2xl gap-4">
                                    <div>
                                        <h3 className="font-black text-slate-900">{p.full_name} <span className="text-xs font-medium text-slate-500">({p.phone || p.email})</span></h3>
                                        <p className="text-sm font-bold text-rose-600 mt-1">Nguy cơ: {p.risk_score}% - {p.diagnosis}</p>
                                        <p className="text-xs text-slate-500 mt-1">Lần khám gần nhất: {p.created_at}</p>
                                    </div>
                                    <button
                                        onClick={() => handleClaim(p.id)}
                                        disabled={claimingId === p.id}
                                        className="px-6 py-2 bg-rose-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-rose-700 transition flex items-center justify-center gap-2 shrink-0"
                                    >
                                        {claimingId === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                        Nhận bệnh nhân
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
