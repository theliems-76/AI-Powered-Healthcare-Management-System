import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const risk = payload[0].value;
        const color = risk <= 33 ? '#10b981' : risk <= 66 ? '#f59e0b' : '#f43f5e';
        const label = risk <= 33 ? 'An toàn' : risk <= 66 ? 'Cảnh báo' : 'Nguy hiểm';

        return (
            <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl min-w-[180px]">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">{data.fullDate}</p>
                <div className="flex items-baseline justify-between gap-4">
                    <span className="text-sm font-bold text-slate-300">Rủi ro AI</span>
                    <span className="text-lg font-black" style={{ color }}>{risk}%</span>
                </div>
                <p className="text-[10px] font-bold mt-1" style={{ color }}>{label}</p>
                {data.diagnosis && (
                    <p className="text-[11px] text-slate-400 font-medium mt-2 border-t border-slate-700 pt-2 leading-relaxed">{data.diagnosis}</p>
                )}
            </div>
        );
    }
    return null;
};

export default function RiskChart({ data }) {
    return (
        <div className="flex flex-col h-full">
            <div className="mb-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Biến thiên theo thời gian</p>
                <h2 className="text-base font-black text-slate-900 tracking-tight">Chỉ số Rủi ro AI (%)</h2>
            </div>

            <div className="flex-1 min-h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 4, left: -28, bottom: 0 }}>
                        <defs>
                            <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.15} />
                                <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <ReferenceLine y={33} stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth={1} />
                        <ReferenceLine y={66} stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth={1} />

                        <XAxis
                            dataKey="month"
                            axisLine={false} tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                            dy={10}
                        />
                        <YAxis
                            domain={[0, 100]}
                            axisLine={false} tickLine={false}
                            tick={{ fill: '#cbd5e1', fontSize: 10, fontWeight: 600 }}
                            ticks={[0, 33, 66, 100]}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }} />

                        <Area
                            type="monotone"
                            dataKey="risk"
                            stroke="#f43f5e"
                            strokeWidth={2.5}
                            fill="url(#riskGrad)"
                            dot={{ r: 3.5, fill: '#fff', stroke: '#f43f5e', strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: '#f43f5e', stroke: '#fff', strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="flex items-center gap-5 mt-5 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span><span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">An toàn (&lt;33)</span></div>
                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span><span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cảnh báo (33-66)</span></div>
                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span><span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rủi ro (&gt;66)</span></div>
            </div>
        </div>
    );
}