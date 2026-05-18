import React, { useState, useEffect } from 'react';
import { X, Calendar, Loader2 } from 'lucide-react';
import api from '../../services/api';

export default function RecordHistoryModal({ isOpen, onClose, onSelectRecord }) {
    const[records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) fetchRecords();
    }, [isOpen]);

    const fetchRecords = async () => {
        setLoading(true);
        try {
            const response = await api.get('/records/history');
            if (response.data.data) {
                setRecords(response.data.data.reverse());
            }
        } catch (error) {
            console.error("L?i l?y l?ch s?:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[80vh]">
                <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                    <h2 className="text-lg font-semibold text-slate-800">Ch?n H? So Khám B?nh</h2>
                    <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-md"><X size={20} /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-white">
                    {loading ? (
                        <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
                    ) : records.length === 0 ? (
                        <div className="text-center py-10 text-slate-500 text-sm">Chua có h? so khám b?nh nào.</div>
                    ) : (
                        records.map(rec => (
                            <button 
                                key={rec.id}
                                onClick={() => onSelectRecord(rec)}
                                className="w-full text-left bg-white p-4 rounded-lg border border-slate-200 hover:border-slate-400 hover:shadow-sm transition-all flex justify-between items-center"
                            >
                                <div>
                                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1">
                                        <Calendar className="w-4 h-4 text-slate-400" /> {rec.date}
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                        rec.risk_score > 66 ? 'bg-red-50 text-red-700' : rec.risk_score > 33 ? 'bg-orange-50 text-orange-700' : 'bg-emerald-50 text-emerald-700'
                                    }`}>
                                        {rec.ai_diagnosis || 'Chua rõ'}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xl font-bold text-slate-800">{rec.risk_score}%</span>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
