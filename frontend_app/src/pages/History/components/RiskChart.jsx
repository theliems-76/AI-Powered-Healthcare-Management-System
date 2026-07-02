import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const risk = payload[0].value;
        const color = risk <= 33 ? '#10b981' : risk <= 66 ? '#f59e0b' : '#f43f5e';
        const label = risk <= 33 ? 'An toàn' : risk <= 66 ? 'Cảnh báo' : 'Nguy hiểm';

        return (
            <div className="bg-surface-container-lowest border border-outline-variant px-5 py-4 rounded-2xl shadow-[0_8px_30px_rgba(0,24,72,0.12)] min-w-[200px] animate-in fade-in zoom-in-95 duration-200">
                <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-3">{data.fullDate}</p>
                <div className="flex items-baseline justify-between gap-4">
                    <span className="text-sm font-bold text-on-surface-variant">Rủi ro AI</span>
                    <span className="text-2xl font-black" style={{ color }}>{risk}%</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
                    <p className="text-xs font-bold" style={{ color }}>{label}</p>
                </div>
                {data.diagnosis && (
                    <p className="text-[11px] text-on-surface-variant font-medium mt-3 border-t border-outline-variant pt-3 leading-relaxed">{data.diagnosis}</p>
                )}
            </div>
        );
    }
    return null;
};

export default function RiskChart({ data }) {
    return (
        <div className="flex flex-col h-full bg-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant shadow-[0_4px_12px_rgba(0,24,72,0.03)] hover:shadow-[0_8px_24px_rgba(0,24,72,0.06)] transition-all">
            <div className="mb-8">
                <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1.5">Biến thiên theo thời gian</p>
                <h2 className="text-xl font-black text-on-surface tracking-tight flex items-center gap-2">
                    Chỉ số Rủi ro AI (%)
                    <div className="px-2.5 py-1 bg-error-container text-on-error-container text-[10px] font-bold uppercase tracking-widest rounded-lg">Cảnh báo cao</div>
                </h2>
            </div>

            <div className="flex-1 min-h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -24, bottom: 10 }}>
                        <defs>
                            <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                            </linearGradient>
                            <filter id="glowRisk" x="-20%" y="-20%" width="140%" height="140%">
                                <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#f43f5e" floodOpacity="0.3" />
                            </filter>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#c3c6d7" opacity={0.4} />

                        <ReferenceLine y={33} stroke="#10b981" strokeDasharray="4 4" strokeWidth={1.5} opacity={0.5} />
                        <ReferenceLine y={66} stroke="#f59e0b" strokeDasharray="4 4" strokeWidth={1.5} opacity={0.5} />

                        <XAxis
                            dataKey="month"
                            axisLine={false} tickLine={false}
                            tick={{ fill: '#737686', fontSize: 11, fontWeight: 700 }}
                            dy={8}
                        />
                        <YAxis
                            domain={[0, 100]}
                            axisLine={false} tickLine={false}
                            tick={{ fill: '#737686', fontSize: 11, fontWeight: 700 }}
                            ticks={[0, 33, 66, 100]}
                            dx={-10}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#c3c6d7', strokeWidth: 1.5, strokeDasharray: '4 4' }} />

                        <Area
                            type="monotone"
                            dataKey="risk"
                            stroke="#f43f5e"
                            strokeWidth={3.5}
                            fill="url(#riskGrad)"
                            style={{ filter: 'url(#glowRisk)' }}
                            dot={{ r: 4, fill: '#ffffff', stroke: '#f43f5e', strokeWidth: 2.5 }}
                            activeDot={{ r: 7, fill: '#f43f5e', stroke: '#ffffff', strokeWidth: 3, className: 'animate-pulse' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="flex items-center gap-6 mt-6 pt-5 border-t border-outline-variant">
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span><span className="text-[10px] font-bold text-outline uppercase tracking-wider">An toàn (&lt;33)</span></div>
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50"></span><span className="text-[10px] font-bold text-outline uppercase tracking-wider">Cảnh báo (33-66)</span></div>
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50"></span><span className="text-[10px] font-bold text-outline uppercase tracking-wider">Rủi ro (&gt;66)</span></div>
            </div>
        </div>
    );
}