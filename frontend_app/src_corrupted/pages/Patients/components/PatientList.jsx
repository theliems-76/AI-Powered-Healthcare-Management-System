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
    return { bg: 'bg-emerald-50 text-emerald-600 border-emerald-200', label: 'Th?p' };
};

export default function PatientList({ loading, patients, onPatientClick }) {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white rounded-2xl border border-slate-200">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                <p className="text-sm font-bold">Ðang t?i h? so...</p>
            </div>
        );
    }

    if (patients.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-bold">Không tìm th?y b?nh nhân nào.</p>
                <p className="text-xs text-slate-400 mt-1">Nh?n "Thêm b?nh nhân" d? b?t d?u qu?n lý.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-5 py-3.5 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">B?nh nhân</th>
                            <th className="px-5 py-3.5 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest hidden md:table-cell">Liên h?</th>
                            <th className="px-5 py-3.5 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest hidden lg:table-cell">
                                <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> L?n khám cu?i</div>
                            </th>
                            <th className="px-5 py-3.5 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
                                <div className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> R?i ro AI</div>
                            </th>
                            <th className="px-5 py-3.5 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest hidden sm:table-cell">Ch?n doán</th>
                            <th className="w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {patients.map((patient) => {
                            const riskStyle = getRiskStyle(patient.latest_risk_score);
                            return (
                                <tr
                                    key={patient.id}
                                    onClick={() => onPatientClick(patient)}
                                    className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                                >
                                    {}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 flex items-center justify-center font-black text-sm border border-slate-200 shrink-0">
                                                {getInitials(patient.full_name)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 text-sm group-hover:text-blue-700 transition-colors leading-tight">
                                                    {patient.full_name}
                                                </p>
                                                <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                                                    {patient.gender === 'M' ? 'Nam' : patient.gender === 'F' ? 'N?' : 'Khác'}
                                                    {patient.date_of_birth ? ` · ${new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear()} tu?i` : ''}
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
                                            {patient.last_visit || <span className="text-slate-300 font-medium">Chua khám</span>}
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
                                            <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">Chua có</span>
                                        )}
                                    </td>

                                    {}
                                    <td className="px-5 py-4 hidden sm:table-cell">
                                        <span className="text-xs font-semibold text-slate-500 leading-snug">
                                            {patient.latest_diagnosis || '—'}
                                        </span>
                                    </td>

                                    {}
                                    <td className="pr-4 py-4">
                                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
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
