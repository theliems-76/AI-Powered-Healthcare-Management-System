import React from 'react';
import { Loader2, Users, Calendar, Activity, ChevronRight } from 'lucide-react';

const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    return parts.length >= 2
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : name.substring(0, 2).toUpperCase();
};

const getRiskStyle = (score) => {
    if (score === null || score === undefined) return null;
    if (score > 66) return { bg: 'bg-red-50 text-red-600 border-red-200', label: 'Cao' };
    if (score > 33) return { bg: 'bg-amber-50 text-amber-600 border-amber-200', label: 'Trung bình' };
    return { bg: 'bg-emerald-50 text-emerald-600 border-emerald-200', label: 'Thấp' };
};

export default function PatientList({ loading, patients, onPatientClick, onRemovePatient }) {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white rounded-[2rem] border-2 border-slate-200">
                <Loader2 className="w-8 h-8 animate-spin text-slate-900 mb-2" />
                <p className="text-sm font-bold">Đang tải hồ sơ...</p>
            </div>
        );
    }

    if (patients.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Chưa Có Dữ Liệu</h3>
                <p className="text-sm text-slate-500 font-medium max-w-sm text-center">Bạn chưa theo dõi bệnh nhân nào. Vui lòng thêm bệnh nhân để bắt đầu quy trình quản lý lâm sàng.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white border-b border-slate-100">
                            <th className="px-5 py-3.5 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Bệnh nhân</th>
                            <th className="px-5 py-3.5 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest hidden md:table-cell">Liên hệ</th>
                            <th className="px-5 py-3.5 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest hidden lg:table-cell">Lần khám cuối</th>
                            <th className="px-5 py-3.5 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Rủi ro AI</th>
                            <th className="px-5 py-3.5 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest hidden sm:table-cell">Chẩn đoán</th>
                            <th className="w-8"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {patients.map((patient) => {
                            const riskStyle = getRiskStyle(patient.latest_risk_score);
                            return (
                                <tr
                                    key={patient.id}
                                    onClick={() => onPatientClick(patient)}
                                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                                >
                                    {}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 flex items-center justify-center font-black text-sm border border-slate-200 shrink-0">
                                                {getInitials(patient.full_name)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 text-sm group-hover:text-slate-900 transition-colors leading-tight">
                                                    {patient.full_name}
                                                </p>
                                                <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                                                    {patient.gender === 'M' ? 'Nam' : patient.gender === 'F' ? 'Nữ' : 'Khác'}
                                                    {patient.date_of_birth ? ` · ${new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear()} tuổi` : ''}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {}
                                    <td className="px-5 py-4 hidden md:table-cell">
                                        <p className="text-sm font-semibold text-slate-700">{patient.phone || '—'}</p>
                                        <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[180px]">{patient.email}</p>
                                    </td>

                                    {}
                                    <td className="px-5 py-4 hidden lg:table-cell">
                                        <span className="text-sm font-semibold text-slate-600">
                                            {patient.last_visit || <span className="text-slate-300 font-medium">Chưa khám</span>}
                                        </span>
                                    </td>

                                    {}
                                    <td className="px-5 py-4">
                                        {riskStyle ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-base font-black text-slate-800">
                                                    {parseFloat(patient.latest_risk_score).toFixed(1)}%
                                                </span>
                                                <span className={`hidden sm:inline text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${riskStyle.bg}`}>
                                                    {riskStyle.label}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">Chưa có</span>
                                        )}
                                    </td>

                                    {}
                                    <td className="px-5 py-4 hidden sm:table-cell">
                                        <span className="text-xs font-semibold text-slate-500 leading-snug">
                                            {patient.latest_diagnosis || '—'}
                                        </span>
                                    </td>

                                    {}
                                    <td className="pr-5 py-4 text-right">
                                        <button 
                                            onClick={(e) => onRemovePatient(e, patient)}
                                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                                            title="Ngừng quản lý"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}