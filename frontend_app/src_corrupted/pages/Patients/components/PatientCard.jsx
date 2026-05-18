import React from 'react';
import { Calendar, Activity, ChevronRight } from 'lucide-react';

export default function PatientCard({ patient, onClick }) {
    const getInitials = (name) => {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        return parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
    };

    return (
        <div 
            onClick={() => onClick(patient)}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group flex flex-col h-full"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 flex items-center justify-center font-black text-lg border border-slate-300">
                        {getInitials(patient.full_name)}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{patient.full_name}</h3>
                        <p className="text-xs font-semibold text-slate-500 mt-0.5">{patient.phone || 'Chua c?p nh?t SÐT'}</p>
                    </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                </div>
            </div>

            <div className="mt-auto space-y-3 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                        <Calendar className="w-3.5 h-3.5" /> L?n khám cu?i:
                    </div>
                    <span className="text-xs font-bold text-slate-700">{patient.last_visit || '--'}</span>
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                        <Activity className="w-3.5 h-3.5" /> R?i ro AI:
                    </div>
                    {patient.latest_risk_score !== null ? (
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                            patient.latest_risk_score > 66 ? 'bg-red-50 text-red-600 border-red-200' : 
                            patient.latest_risk_score > 33 ? 'bg-amber-50 text-amber-600 border-amber-200' : 
                            'bg-emerald-50 text-emerald-600 border-emerald-200'
                        }`}>
                            {patient.latest_risk_score}% - {patient.latest_diagnosis}
                        </span>
                    ) : (
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Chua khám</span>
                    )}
                </div>
            </div>
        </div>
    );
}
