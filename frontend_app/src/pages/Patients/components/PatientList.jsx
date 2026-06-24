import React from 'react';
import { Loader2, Users, Calendar, Activity, ChevronRight, Trash2 } from 'lucide-react';

const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    return parts.length >= 2
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : name.substring(0, 2).toUpperCase();
};

const getRiskStyle = (score) => {
    if (score === null || score === undefined) return null;
    if (score > 66) return { bg: 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20', label: 'Cao' };
    if (score > 33) return { bg: 'bg-[#f97316]/10 text-[#f97316] border-[#f97316]/20', label: 'Trung bình' };
    return { bg: 'bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20', label: 'Thấp' };
};

export default function PatientList({ loading, patients, onPatientClick, onRemovePatient }) {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant bg-surface-container-lowest rounded-lg border-2 border-outline-variant">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                <p className="text-sm font-bold">Đang tải hồ sơ...</p>
            </div>
        );
    }

    if (patients.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 bg-surface-container-lowest rounded-lg border border-outline-variant">
                <h3 className="text-xl font-black text-on-surface uppercase tracking-tight mb-2">Chưa Có Dữ Liệu</h3>
                <p className="text-sm text-on-surface-variant font-medium max-w-sm text-center">Bạn chưa theo dõi bệnh nhân nào. Vui lòng thêm bệnh nhân để bắt đầu quy trình quản lý lâm sàng.</p>
            </div>
        );
    }

    return (
        <div className="bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-surface-container-low border-b border-outline-variant">
                            <th className="px-5 py-3.5 text-[11px] font-extrabold text-on-surface-variant uppercase tracking-widest">Bệnh nhân</th>
                            <th className="px-5 py-3.5 text-[11px] font-extrabold text-on-surface-variant uppercase tracking-widest hidden md:table-cell">Liên hệ</th>
                            <th className="px-5 py-3.5 text-[11px] font-extrabold text-on-surface-variant uppercase tracking-widest hidden lg:table-cell">Lần khám cuối</th>
                            <th className="px-5 py-3.5 text-[11px] font-extrabold text-on-surface-variant uppercase tracking-widest">Rủi ro AI</th>
                            <th className="px-5 py-3.5 text-[11px] font-extrabold text-on-surface-variant uppercase tracking-widest hidden sm:table-cell">Chẩn đoán</th>
                            <th className="w-12"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                        {patients.map((patient) => {
                            const riskStyle = getRiskStyle(patient.latest_risk_score);
                            return (
                                <tr
                                    key={patient.id}
                                    onClick={() => onPatientClick(patient)}
                                    className="hover:bg-surface-container transition-colors cursor-pointer group"
                                >
                                    {/* Bệnh nhân */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-black text-sm shrink-0">
                                                {getInitials(patient.full_name)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-on-surface text-sm group-hover:text-primary transition-colors leading-tight">
                                                    {patient.full_name}
                                                </p>
                                                <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">
                                                    {patient.gender === 'M' ? 'Nam' : patient.gender === 'F' ? 'Nữ' : 'Khác'}
                                                    {patient.date_of_birth ? ` · ${new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear()} tuổi` : ''}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Liên hệ */}
                                    <td className="px-5 py-4 hidden md:table-cell">
                                        <p className="text-sm font-semibold text-on-surface">{patient.phone || '—'}</p>
                                        <p className="text-[11px] text-on-surface-variant mt-0.5 truncate max-w-[180px]">{patient.email}</p>
                                    </td>

                                    {/* Lần khám cuối */}
                                    <td className="px-5 py-4 hidden lg:table-cell">
                                        <span className="text-sm font-semibold text-on-surface-variant">
                                            {patient.last_visit || <span className="opacity-50">Chưa khám</span>}
                                        </span>
                                    </td>

                                    {/* Rủi ro AI */}
                                    <td className="px-5 py-4">
                                        {riskStyle ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-base font-black text-on-surface">
                                                    {parseFloat(patient.latest_risk_score).toFixed(1)}%
                                                </span>
                                                <span className={`hidden sm:inline text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${riskStyle.bg}`}>
                                                    {riskStyle.label}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-[11px] font-bold text-on-surface-variant bg-surface-container px-2 py-1 rounded-md">Chưa có</span>
                                        )}
                                    </td>

                                    {/* Chẩn đoán */}
                                    <td className="px-5 py-4 hidden sm:table-cell">
                                        <span className="text-xs font-semibold text-on-surface-variant leading-snug">
                                            {patient.latest_diagnosis || '—'}
                                        </span>
                                    </td>

                                    {/* Hành động */}
                                    <td className="pr-5 py-4 text-right">
                                        <button 
                                            onClick={(e) => onRemovePatient(e, patient)}
                                            className="p-2 text-outline hover:text-error hover:bg-error-container/50 rounded-xl transition-colors"
                                            title="Ngừng quản lý"
                                        >
                                            <Trash2 className="w-4 h-4" />
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