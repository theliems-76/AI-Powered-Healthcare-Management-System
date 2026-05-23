import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminOverviewTab({ stats }) {
    if (!stats) return null;

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Chart 1: Risk Distribution */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-md group">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div> Cấu trúc Rủi ro Lâm sàng
                    </h3>
                    <div className="h-64 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <defs>
                                    <linearGradient id="riskHigh" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#ff4b72" />
                                        <stop offset="100%" stopColor="#e11d48" />
                                    </linearGradient>
                                    <linearGradient id="riskMedium" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#fb923c" />
                                        <stop offset="100%" stopColor="#ea580c" />
                                    </linearGradient>
                                    <linearGradient id="riskLow" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#2dd4bf" />
                                        <stop offset="100%" stopColor="#0d9488" />
                                    </linearGradient>
                                    <linearGradient id="riskEmpty" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#f1f5f9" />
                                        <stop offset="100%" stopColor="#e2e8f0" />
                                    </linearGradient>
                                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                                        <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#0f172a" floodOpacity="0.1" />
                                    </filter>
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
                                    style={{ filter: 'url(#shadow)' }}
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
                                        contentStyle={{ borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontWeight: '900', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                                        itemStyle={{ color: '#0f172a' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                        {stats.riskDistribution?.map((item, idx) => {
                            let dotColor = '#e2e8f0';
                            if (item.name === "Nguy cơ cao") dotColor = '#e11d48';
                            if (item.name === "Trung bình") dotColor = '#ea580c';
                            if (item.name === "Khỏe mạnh") dotColor = '#0d9488';
                            if (item.name === "Chưa đánh giá") dotColor = '#cbd5e1';
                            return (
                                <div key={idx} className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: dotColor }}></div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{item.name}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Chart 2: System Growth */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-md group">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> Tăng trưởng Hồ sơ Y tế (6 Tháng)
                    </h3>
                    <div className="h-64 w-full">
                        {stats.recordTrend?.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.recordTrend} barSize={24}>
                                    <defs>
                                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#818cf8" />
                                            <stop offset="100%" stopColor="#4f46e5" />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: '900', fill: '#94a3b8' }} dy={10} />
                                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: '900', fill: '#94a3b8' }} dx={-10} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontWeight: '900', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0f172a' }}
                                        cursor={{ fill: '#f8fafc' }}
                                    />
                                    <Bar dataKey="records" fill="url(#barGradient)" radius={[6, 6, 6, 6]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Chưa có dữ liệu hồ sơ
                            </div>
                        )}
                    </div>
                </div>
                
            </div>
            
            {/* User Roles Bar Chart */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-md">
                 <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div> Tỷ lệ Phân bố Nguồn nhân lực
                 </h3>
                 <div className="w-full flex h-4 rounded-full overflow-hidden bg-slate-100 shadow-inner">
                     <div style={{ width: `${(stats.totalPatients / (stats.totalUsers || 1)) * 100}%` }} className="bg-gradient-to-r from-cyan-400 to-teal-500 h-full transition-all duration-1000"></div>
                     <div style={{ width: `${(stats.totalDoctors / (stats.totalUsers || 1)) * 100}%` }} className="bg-gradient-to-r from-slate-700 to-slate-900 h-full transition-all duration-1000"></div>
                 </div>
                 <div className="flex justify-between mt-4 px-2">
                     <div className="text-[10px] font-bold uppercase tracking-widest text-teal-600">Bệnh nhân ({stats.totalPatients})</div>
                     <div className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Bác sĩ ({stats.totalDoctors})</div>
                 </div>
            </div>
        </div>
    );
}
