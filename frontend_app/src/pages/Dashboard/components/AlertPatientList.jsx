import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, TrendingUp, TrendingDown, Minus, ArrowRight, Clock, FileText } from 'lucide-react';

export default function AlertPatientList({ patients }) {
    const navigate = useNavigate();

    const getRiskStyle = (risk) => {
        const r = parseFloat(risk);
        if (r > 66) return { badge: 'bg-rose-100 text-rose-700 border-rose-200', bar: 'bg-rose-500', dot: 'bg-rose-500' };
        if (r > 33) return { badge: 'bg-amber-100 text-amber-700 border-amber-200', bar: 'bg-amber-400', dot: 'bg-amber-400' };
        return { badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', bar: 'bg-emerald-500', dot: 'bg-emerald-500' };
    };

    const getDeltaIcon = (delta) => {
        if (delta === null) return <Minus className="w-3 h-3 text-slate-400" />;
        if (parseFloat(delta) > 0) return <TrendingUp className="w-3 h-3 text-rose-500" />;
        if (parseFloat(delta) < 0) return <TrendingDown className="w-3 h-3 text-emerald-500" />;
        return <Minus className="w-3 h-3 text-slate-400" />;
    };

    const urgentPatients = patients.filter(p => parseFloat(p.latest_risk_score) > 66);
    const otherPatients = patients.filter(p => parseFloat(p.latest_risk_score) <= 66);

    const renderPatient = (patient) => {
        const style = getRiskStyle(patient.latest_risk_score);
        return (
            <div
                key={patient.id}
                className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer"
                onClick={() => navigate('/history', { state: { patientId: patient.id, patientName: patient.full_name } })}
            >
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm text-white flex-shrink-0 ${style.dot}`}>
                    {patient.full_name?.charAt(0)?.toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-800 text-sm truncate">{patient.full_name}</p>
                        {!patient.has_doctor_notes && (
                            <span className="text-[9px] font-black bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-md border border-blue-200 uppercase">Chờ ghi chú</span>
                        )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-400 font-medium truncate">{patient.latest_diagnosis || 'Chưa có chẩn đoán'}</span>
                    </div>
                </div>

                {/* Risk + Delta */}
                <div className="flex-shrink-0 text-right">
                    <div className="flex items-center gap-1 justify-end">
                        {getDeltaIcon(patient.risk_delta)}
                        <span className={`text-sm font-black px-2 py-0.5 rounded-lg border ${style.badge}`}>
                            {patient.latest_risk_score}%
                        </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 justify-end text-slate-400">
                        <Clock className="w-2.5 h-2.5" />
                        <span className="text-[10px] font-medium">{patient.last_visit || '—'}</span>
                    </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </div>
        );
    };

    if (patients.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <FileText className="w-10 h-10 mb-3 opacity-50" />
                <p className="font-semibold">Chưa có bệnh nhân nào được gán.</p>
            </div>
        );
    }

    return (
        <div className="space-y-1">
            {urgentPatients.length > 0 && (
                <div className="mb-3">
                    <div className="flex items-center gap-1.5 mb-2 px-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                        <span className="text-xs font-black text-rose-500 uppercase tracking-wider">Cần chú ý ngay ({urgentPatients.length})</span>
                    </div>
                    {urgentPatients.map(renderPatient)}
                </div>
            )}
            {otherPatients.length > 0 && (
                <div>
                    {urgentPatients.length > 0 && (
                        <div className="flex items-center gap-2 px-2 mb-2 mt-4">
                            <div className="flex-1 h-px bg-slate-100" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Các bệnh nhân khác</span>
                            <div className="flex-1 h-px bg-slate-100" />
                        </div>
                    )}
                    {otherPatients.map(renderPatient)}
                </div>
            )}
        </div>
    );
}
