import React from 'react';

export default function AdminStats({ stats }) {
    if (!stats) return null;

    const cards =[
        { title: "Tổng người dùng", value: stats.totalUsers, color: "bg-primary", lightBg: "bg-primary-container/10", textColor: "text-primary" },
        { title: "Bệnh nhân", value: stats.totalPatients, color: "bg-tertiary-container", lightBg: "bg-tertiary-fixed/30", textColor: "text-tertiary" },
        { title: "Hồ sơ khám (AI)", value: stats.totalRecords, color: "bg-secondary", lightBg: "bg-surface-container-high", textColor: "text-secondary" },
        { title: "Món ăn Hệ thống", value: stats.totalDishes, color: "bg-emerald-500", lightBg: "bg-emerald-50", textColor: "text-emerald-600" }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cards.map((c, idx) => {
                return (
                    <div key={idx} className="bg-surface border border-outline-variant rounded-xl p-6 flex flex-col gap-4 relative overflow-hidden hover:shadow-sm transition-all">
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${c.color}`}></div>
                        <div className="flex justify-between items-start">
                            <div className={`p-2 ${c.lightBg} rounded-lg`}>
                                <span className={`text-[11px] font-bold ${c.textColor} uppercase tracking-wider`}>Metric</span>
                            </div>
                        </div>
                        <div>
                            <div className="text-secondary text-xs font-bold mb-1 uppercase tracking-wider">{c.title}</div>
                            <div className="text-4xl font-bold text-on-surface tracking-tight">{c.value}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
