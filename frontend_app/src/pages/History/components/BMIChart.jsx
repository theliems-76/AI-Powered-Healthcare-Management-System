import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const bmi = payload[0].value;
        const isNormal = bmi >= 18.5 && bmi <= 24.9;

        return (
            <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl min-w-[160px]">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">{data.fullDate}</p>
                <div className="flex items-baseline justify-between gap-4">
                    <span className="text-sm font-bold text-slate-300">BMI</span>
                    <span className={`text-lg font-black ${isNormal ? 'text-emerald-400' : 'text-amber-400'}`}>{bmi}</span>
                </div>
                <p className={`text-[10px] font-bold mt-1 ${isNormal ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {isNormal ? 'Vùng an toàn' : bmi < 18.5 ? 'Thiếu cân' : 'Thừa cân'}
                </p>
            </div>
        );
    }
    return null;
};

export default function BMIChart({ data }) {
    return (
        <div className="flex flex-col h-full">
            <div className="mb-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Kiểm soát thể trọng</p>
                <h2 className="text-base font-black text-slate-900 tracking-tight">Chỉ số Khối cơ thể (BMI)</h2>
            </div>

            <div className="flex-1 min-h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 10, right: 4, left: -28, bottom: 0 }}>
                        <ReferenceArea y1={18.5} y2={24.9} fill="#10b981" fillOpacity={0.06} />

                        <XAxis
                            dataKey="month"
                            axisLine={false} tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                            dy={10}
                        />
                        <YAxis
                            domain={['auto', 'auto']}
                            axisLine={false} tickLine={false}
                            tick={{ fill: '#cbd5e1', fontSize: 10, fontWeight: 600 }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }} />

                        <Line
                            type="monotone"
                            dataKey="bmi"
                            stroke="#2563eb"
                            strokeWidth={2.5}
                            dot={{ r: 3.5, fill: '#fff', stroke: '#2563eb', strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="flex items-center gap-5 mt-5 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-60"></span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vùng lý tưởng (18.5 – 24.9)</span>
                </div>
            </div>
        </div>
    );
}