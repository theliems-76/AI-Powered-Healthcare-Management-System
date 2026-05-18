import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';
import { Calendar, FileText, Activity } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white/95 backdrop-blur-xl p-5 rounded-2xl shadow-xl border border-slate-100/50 min-w-[250px] z-50">
                <p className="text-sm font-bold text-slate-800 mb-4 border-b pb-2">{data.fullDate || label}</p>
                
                <div className="space-y-3">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-blue-500" />
                            <span className="font-semibold text-sm text-slate-600">Ch? s? BMI:</span>
                        </div>
                        <span className="font-black text-blue-600 text-base">{payload[0].value}</span>
                    </div>

                    {data.diagnosis && (
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-2 mb-1">
                                <FileText className="w-4 h-4 text-blue-500" />
                                <span className="font-semibold text-xs text-slate-600">Ch?n doán:</span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                {data.diagnosis}
                            </p>
                        </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-1">
                        <span className="font-semibold text-xs text-slate-500">S?c kh?e (CDC):</span>
                        <div className="flex gap-1">
                            {[1,2,3,4,5].map(star => (
                                <div key={star} className={`w-1.5 h-4 rounded-sm ${star <= (data.health_status || 0) ? 'bg-emerald-400' : 'bg-slate-200'}`}></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

export default function BMIChart({ data }) {
    return (
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 transition-all hover:shadow-md group">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl group-hover:scale-110 transition-transform"><Calendar className="w-6 h-6" /></div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Ki?m soát Th? tr?ng (BMI)</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vùng an toàn: 18.5 - 24.9</p>
                </div>
            </div>
            
            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart syncId="historyChart" data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            {}
                            <filter id="shadowBMI" height="200%">
                                <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#2563eb" floodOpacity="0.4"/>
                            </filter>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} dy={10} />
                        <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{fill: '#2563eb', fontSize: 12, fontWeight: 'bold'}} />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }} />
                        
                        <ReferenceArea y1={18.5} y2={24.9} fill="#10b981" fillOpacity={0.08} />

                        <Line 
                            type="monotone" 
                            dataKey="bmi" 
                            stroke="#2563eb" 
                            strokeWidth={4} 
                            dot={{ r: 5, fill: '#fff', stroke: '#2563eb', strokeWidth: 2 }} 
                            activeDot={{ r: 8, fill: '#2563eb', stroke: '#fff', strokeWidth: 3 }} 
                            style={{ filter: 'url(#shadowBMI)' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            
            {}
            <div className="flex justify-center gap-6 mt-6">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-400 opacity-30"></div><span className="text-xs font-semibold text-slate-500">M?c tiêu lý tu?ng (18.5-24.9)</span></div>
            </div>
        </div>
    );
}
