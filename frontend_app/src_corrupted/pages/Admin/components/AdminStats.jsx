import React from 'react';
import { Users, UserCircle, Activity, Apple } from 'lucide-react';

export default function AdminStats({ stats }) {
    if (!stats) return null;

    const cards =[
        { title: "Tổng người dùng", value: stats.totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
        { title: "Bệnh nhân", value: stats.totalPatients, icon: UserCircle, color: "text-emerald-600", bg: "bg-emerald-100" },
        { title: "Hồ sơ AI", value: stats.totalRecords, icon: Activity, color: "text-rose-600", bg: "bg-rose-100" },
        { title: "Món ăn Hệ thống", value: stats.totalDishes, icon: Apple, color: "text-amber-600", bg: "bg-amber-100" }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((c, idx) => {
                const Icon = c.icon;
                return (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{c.title}</p>
                            <h3 className="text-3xl font-black text-slate-800 mt-1">{c.value}</h3>
                        </div>
                        <div className={`p-4 rounded-xl ${c.bg}`}>
                            <Icon className={`w-6 h-6 ${c.color}`} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
