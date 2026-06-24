import React, { useState, useEffect } from 'react';
import { X, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import Button from '../../../components/ui/Button';

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-scrim/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-surface-container-lowest rounded-[2rem] shadow-2xl w-full max-w-3xl p-8 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200 border border-outline-variant">
                <div className="flex justify-between items-center mb-6 border-b border-outline-variant pb-4">
                    <div>
                        <h2 className="text-xl font-black text-on-surface uppercase tracking-wide flex items-center gap-2">
                            <AlertTriangle className="text-error w-6 h-6" /> Bệnh Nhân Chờ Tiếp Nhận
                        </h2>
                        <p className="text-xs font-bold text-on-surface-variant mt-1 uppercase tracking-widest">Danh sách bệnh nhân nguy cơ cao chưa có bác sĩ</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                    {loading ? (
                        <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-on-surface-variant" /></div>
                    ) : pool.length === 0 ? (
                        <div className="text-center p-10 text-on-surface-variant font-bold">Không có bệnh nhân chờ nào.</div>
                    ) : (
                        <div className="space-y-4">
                            {pool.map(p => (
                                <div key={p.id} className="flex flex-col sm:flex-row justify-between sm:items-center bg-error-container border border-error-container p-5 rounded-2xl gap-4">
                                    <div>
                                        <h3 className="font-black text-on-error-container">{p.full_name} <span className="text-xs font-medium opacity-80">({p.phone || p.email})</span></h3>
                                        <p className="text-sm font-bold text-error mt-1">Nguy cơ: {p.risk_score}% - {p.diagnosis}</p>
                                        <p className="text-xs text-on-error-container opacity-80 mt-1">Lần khám gần nhất: {p.created_at}</p>
                                    </div>
                                    <Button
                                        onClick={() => handleClaim(p.id)}
                                        disabled={claimingId === p.id}
                                        className="flex items-center justify-center gap-2 shrink-0 bg-error text-on-error hover:bg-error/90"
                                    >
                                        {claimingId === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                        Nhận bệnh nhân
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
