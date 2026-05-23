import React from 'react';
import { Users, UserCircle, Activity, Apple } from 'lucide-react';

export default function AdminStats({ stats }) {
    if (!stats) return null;

    const cards =[
        { title: "Tổng người dùng", value: stats.totalUsers },
        { title: "Bệnh nhân", value: stats.totalPatients },
        { title: "Hồ sơ AI", value: stats.totalRecords },
        { title: "Món ăn Hệ thống", value: stats.totalDishes }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((c, idx) => {
                return (
                    <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-center transition-all hover:shadow-md">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{c.title}</p>
                        <h3 className="text-4xl font-bold text-slate-900 mt-2 tracking-tight">{c.value}</h3>
                    </div>
                );
            })}
        </div>
    );
}
