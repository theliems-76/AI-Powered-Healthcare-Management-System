import React from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

export default function MiniRiskChart({ data, className = "h-32" }) {
    return (
        <div className={`w-full ${className}`}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <Line 
                        type="monotone" 
                        dataKey="risk_score" 
                        stroke="#e11d48" 
                        strokeWidth={4} 
                        dot={{ r: 5, fill: "#fff", strokeWidth: 2 }} 
                        activeDot={{ r: 7 }}
                    />
                    <Tooltip 
                        contentStyle={{ 
                            borderRadius: '12px', 
                            border: 'none', 
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                            fontWeight: 'bold',
                            color: '#0f172a'
                        }} 
                        itemStyle={{ color: '#e11d48' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
