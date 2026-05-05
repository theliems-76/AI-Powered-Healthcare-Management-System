import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';
import { Activity, FileText, AlertTriangle } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const risk = payload[0].value;
        let riskLevel = 'An toàn';
        let riskColor = 'text-emerald-500';
        let riskIcon = <Activity className="w-4 h-4" />;

        if (risk > 66) {
            riskLevel = 'Nguy hiểm';
            riskColor = 'text-rose-500';
            riskIcon = <AlertTriangle className="w-4 h-4" />;
        } else if (risk > 33) {
            riskLevel = 'Cảnh báo';
            riskColor = 'text-yellow-500';
            riskIcon = <Activity className="w-4 h-4" />;
        }

        return (
            <div className="bg-white/95 backdrop-blur-xl p-5 rounded-2xl shadow-xl border border-slate-100/50 min-w-[250px] z-50">
                <p className="text-sm font-bold text-slate-800 mb-4 border-b pb-2">{data.fullDate || label}</p>
                
                <div className="space-y-3">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-rose-500" />
                            <span className="font-semibold text-sm text-slate-600">Rủi ro AI:</span>
                        </div>
                        <span className="font-black text-rose-600 text-base">{payload[0].value}%</span>
                    </div>

                    {data.diagnosis && (
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-2 mb-1">
                                <FileText className="w-4 h-4 text-blue-500" />
                                <span className="font-semibold text-xs text-slate-600">Chẩn đoán:</span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                {data.diagnosis}
                            </p>
                        </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-1">
                        <span className="font-semibold text-xs text-slate-500">Sức khỏe (CDC):</span>
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

export default function RiskChart({ data }) {
    return (
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 transition-all hover:shadow-md group">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-rose-100 text-rose-600 rounded-xl group-hover:scale-110 transition-transform"><Activity className="w-6 h-6" /></div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Biến thiên Rủi ro AI (%)</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mục tiêu: Dưới 50%</p>
                </div>
            </div>
            
            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart syncId="historyChart" data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.6}/>
                                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                            </linearGradient>
                            {}
                            <filter id="shadowRisk" height="200%">
                                <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#f43f5e" floodOpacity="0.4"/>
                            </filter>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} dy={10} />
                        <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: '#f43f5e', fontSize: 12, fontWeight: 'bold'}} />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }} />
                        
                        {}
                        <ReferenceArea y1={0} y2={33} fill="#10b981" fillOpacity={0.05} />
                        <ReferenceArea y1={33} y2={66} fill="#eab308" fillOpacity={0.05} />
                        <ReferenceArea y1={66} y2={100} fill="#f43f5e" fillOpacity={0.05} />

                        <Area 
                            type="monotone" 
                            dataKey="risk" 
                            stroke="#f43f5e" 
                            strokeWidth={4} 
                            fill="url(#colorRisk)" 
                            activeDot={{ r: 8, fill: '#f43f5e', stroke: '#fff', strokeWidth: 3 }} 
                            style={{ filter: 'url(#shadowRisk)' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            
            {}
            <div className="flex justify-center gap-6 mt-6">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-400 opacity-60"></div><span className="text-xs font-semibold text-slate-500">An toàn (0-33)</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-400 opacity-60"></div><span className="text-xs font-semibold text-slate-500">Cảnh báo (33-66)</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-400 opacity-60"></div><span className="text-xs font-semibold text-slate-500">Nguy hiểm (&gt;66)</span></div>
            </div>
        </div>
    );
}