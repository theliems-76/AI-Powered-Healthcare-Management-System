import React from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

export default function MiniRiskChart({ data }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Xu hướng rủi ro (các lần gần nhất)</p>
            <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <Line type="monotone" dataKey="risk_score" stroke="#e11d48" strokeWidth={3} dot={{ r: 4 }} />
                        <Tooltip contentStyle={{ borderRadius: '12px' }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}