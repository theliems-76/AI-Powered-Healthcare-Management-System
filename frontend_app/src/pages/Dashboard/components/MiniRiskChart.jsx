import React from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

export default function MiniRiskChart({ data, className }) {
    return (
        <div className={`w-full h-full ${className || ''}`}>
            <ResponsiveContainer width="99%" height="100%">
                <LineChart data={data}>
                    <Line type="monotone" dataKey="risk_score" stroke="#004ac6" strokeWidth={3} dot={{ r: 4, fill: '#004ac6' }} activeDot={{ r: 6 }} />
                    <Tooltip 
                        contentStyle={{ borderRadius: '0.5rem', border: '1px solid #c3c5d9', backgroundColor: '#ffffff', fontSize: '12px', fontWeight: 'bold' }}
                        itemStyle={{ color: '#004ac6' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}