import React from 'react';

export default function StatsCard({ title, value, unit, icon: Icon, colorClass, desc }) {
    // Tách mã màu text từ colorClass cũ (vd: "bg-rose-50 text-rose-500" -> "text-rose-500")
    const textColor = colorClass.split(' ').find(c => c.startsWith('text-')) || 'text-slate-500';

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-between items-start mb-4">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{title}</p>
                <Icon className={`w-5 h-5 ${textColor} opacity-80`} strokeWidth={2.5} />
            </div>
            
            <div>
                <div className="flex items-baseline gap-1">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">{value || '--'}</h2>
                    {unit && <span className="text-sm font-bold text-slate-400">{unit}</span>}
                </div>
                <p className="text-[11px] text-slate-400 mt-2 font-semibold uppercase">{desc}</p>
            </div>
        </div>
    );
}
