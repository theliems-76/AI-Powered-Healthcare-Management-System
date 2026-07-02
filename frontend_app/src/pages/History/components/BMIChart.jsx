import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceArea, CartesianGrid } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const bmi = payload[0].value;
        const isNormal = bmi >= 18.5 && bmi <= 24.9;

        return (
            <div className="bg-surface-container-lowest border border-outline-variant px-5 py-4 rounded-2xl shadow-[0_8px_30px_rgba(0,24,72,0.12)] min-w-[180px] animate-in fade-in zoom-in-95 duration-200">
                <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-3">{data.fullDate}</p>
                <div className="flex items-baseline justify-between gap-4">
                    <span className="text-sm font-bold text-on-surface-variant">BMI</span>
                    <span className={`text-2xl font-black ${isNormal ? 'text-emerald-500' : 'text-amber-500'}`}>{bmi}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                     <span className={`w-2 h-2 rounded-full ${isNormal ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                     <p className={`text-xs font-bold ${isNormal ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {isNormal ? 'Vùng an toàn' : bmi < 18.5 ? 'Thiếu cân' : 'Thừa cân'}
                     </p>
                </div>
            </div>
        );
    }
    return null;
};

export default function BMIChart({ data }) {
    return (
        <div className="flex flex-col h-full bg-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant shadow-[0_4px_12px_rgba(0,24,72,0.03)] hover:shadow-[0_8px_24px_rgba(0,24,72,0.06)] transition-all">
            <div className="mb-8">
                <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1.5">Kiểm soát thể trọng</p>
                <h2 className="text-xl font-black text-on-surface tracking-tight flex items-center gap-2">
                    Chỉ số Khối cơ thể (BMI)
                    <div className="px-2.5 py-1 bg-surface-container text-primary text-[10px] font-bold uppercase tracking-widest rounded-lg">Theo dõi liên tục</div>
                </h2>
            </div>

            <div className="flex-1 min-h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 10, right: 10, left: -24, bottom: 10 }}>
                        <defs>
                            <filter id="glowBMI" x="-20%" y="-20%" width="140%" height="140%">
                                <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#004ac6" floodOpacity="0.25" />
                            </filter>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#c3c6d7" opacity={0.4} />
                        
                        <ReferenceArea y1={18.5} y2={24.9} fill="#10b981" fillOpacity={0.08} />

                        <XAxis
                            dataKey="month"
                            axisLine={false} tickLine={false}
                            tick={{ fill: '#737686', fontSize: 11, fontWeight: 700 }}
                            dy={8}
                        />
                        <YAxis
                            domain={['auto', 'auto']}
                            axisLine={false} tickLine={false}
                            tick={{ fill: '#737686', fontSize: 11, fontWeight: 700 }}
                            dx={-10}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#c3c6d7', strokeWidth: 1.5, strokeDasharray: '4 4' }} />

                        <Line
                            type="monotone"
                            dataKey="bmi"
                            stroke="#004ac6"
                            strokeWidth={3.5}
                            style={{ filter: 'url(#glowBMI)' }}
                            dot={{ r: 4, fill: '#ffffff', stroke: '#004ac6', strokeWidth: 2.5 }}
                            activeDot={{ r: 7, fill: '#004ac6', stroke: '#ffffff', strokeWidth: 3, className: 'animate-pulse' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="flex items-center gap-6 mt-6 pt-5 border-t border-outline-variant">
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
                    <span className="text-[10px] font-bold text-outline uppercase tracking-wider">Vùng lý tưởng (18.5 – 24.9)</span>
                </div>
            </div>
        </div>
    );
}