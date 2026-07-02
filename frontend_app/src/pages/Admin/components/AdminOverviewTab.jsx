import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminOverviewTab({ stats }) {
    if (!stats) return null;

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Chart 1: Risk Distribution */}
                <div className="bg-surface border border-outline-variant rounded-xl p-6 transition-all hover:shadow-sm">
                    <h3 className="text-xs font-bold text-secondary uppercase tracking-widest mb-6 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-error"></div> Cấu trúc Rủi ro Lâm sàng
                    </h3>
                    <div className="h-64 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <defs>
                                    <linearGradient id="riskHigh" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#ba1a1a" />
                                        <stop offset="100%" stopColor="#93000a" />
                                    </linearGradient>
                                    <linearGradient id="riskMedium" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#c53b00" />
                                        <stop offset="100%" stopColor="#9b2d00" />
                                    </linearGradient>
                                    <linearGradient id="riskLow" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#0046cc" />
                                        <stop offset="100%" stopColor="#003baf" />
                                    </linearGradient>
                                    <linearGradient id="riskEmpty" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#e1e1ef" />
                                        <stop offset="100%" stopColor="#c3c5d9" />
                                    </linearGradient>
                                </defs>
                                <Pie
                                    data={stats.riskDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius="65%"
                                    outerRadius="85%"
                                    paddingAngle={2}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {stats.riskDistribution?.map((entry, index) => {
                                        let fillUrl = "url(#riskEmpty)";
                                        if (entry.name === "Nguy cơ cao") fillUrl = "url(#riskHigh)";
                                        if (entry.name === "Trung bình") fillUrl = "url(#riskMedium)";
                                        if (entry.name === "Khỏe mạnh") fillUrl = "url(#riskLow)";
                                        if (entry.name === "Chưa đánh giá") fillUrl = "url(#riskEmpty)";
                                        return <Cell key={`cell-${index}`} fill={fillUrl} />;
                                    })}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ borderRadius: '0.5rem', border: '1px solid #c3c5d9', backgroundColor: '#ffffff', fontSize: '12px', fontWeight: 'bold' }}
                                    itemStyle={{ color: '#191b24' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                        {stats.riskDistribution?.map((item, idx) => {
                            let dotColor = '#e1e1ef';
                            if (item.name === "Nguy cơ cao") dotColor = '#ba1a1a';
                            if (item.name === "Trung bình") dotColor = '#c53b00';
                            if (item.name === "Khỏe mạnh") dotColor = '#0046cc';
                            if (item.name === "Chưa đánh giá") dotColor = '#737688';
                            return (
                                <div key={idx} className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full shadow-[0_4px_12px_rgba(0,24,72,0.04)]" style={{ backgroundColor: dotColor }}></div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">{item.name}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Chart 2: System Growth */}
                <div className="bg-surface border border-outline-variant rounded-xl p-6 transition-all hover:shadow-sm">
                    <h3 className="text-xs font-bold text-secondary uppercase tracking-widest mb-6 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div> Tăng trưởng Hồ sơ Y tế
                    </h3>
                    <div className="h-64 w-full">
                        {stats.recordTrend?.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.recordTrend} barSize={24}>
                                    <defs>
                                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#0046cc" />
                                            <stop offset="100%" stopColor="#003baf" />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#737688' }} dy={10} />
                                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#737688' }} dx={-10} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '0.5rem', border: '1px solid #c3c5d9', backgroundColor: '#ffffff', fontSize: '12px', fontWeight: 'bold' }}
                                        cursor={{ fill: '#f3f2ff' }}
                                    />
                                    <Bar dataKey="records" fill="url(#barGradient)" radius={[4, 4, 4, 4]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-[10px] font-bold text-outline uppercase tracking-widest">
                                Chưa có dữ liệu hồ sơ
                            </div>
                        )}
                    </div>
                </div>
                
            </div>
            
            {/* User Roles Bar Chart */}
            <div className="bg-surface border border-outline-variant rounded-xl p-6 transition-all hover:shadow-sm">
                 <h3 className="text-xs font-bold text-secondary uppercase tracking-widest mb-6 flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-secondary"></div> Phân bố Nguồn nhân lực
                 </h3>
                 <div className="w-full flex h-4 rounded-full overflow-hidden bg-surface-container-high shadow-inner">
                     <div style={{ width: `${(stats.totalPatients / (stats.totalUsers || 1)) * 100}%` }} className="bg-primary h-full transition-all duration-1000"></div>
                     <div style={{ width: `${(stats.totalDoctors / (stats.totalUsers || 1)) * 100}%` }} className="bg-secondary h-full transition-all duration-1000"></div>
                 </div>
                 <div className="flex justify-between mt-4 px-2">
                     <div className="text-[10px] font-bold uppercase tracking-widest text-primary">Bệnh nhân ({stats.totalPatients})</div>
                     <div className="text-[10px] font-bold uppercase tracking-widest text-secondary">Bác sĩ ({stats.totalDoctors})</div>
                 </div>
            </div>
        </div>
    );
}
