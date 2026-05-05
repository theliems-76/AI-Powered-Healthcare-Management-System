import React from 'react';

export default function StatsCard({ title, value, unit, icon: Icon, colorClass, desc }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-blue-100 transition-all">
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
                <div className="flex items-baseline gap-1 mt-1">
                    <h2 className="text-3xl font-black text-slate-800">{value || '--'}</h2>
                    {unit && <span className="text-sm font-bold text-slate-400">{unit}</span>}
                </div>
                <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase">{desc}</p>
            </div>
            <div className={`p-4 rounded-xl ${colorClass}`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    );
}