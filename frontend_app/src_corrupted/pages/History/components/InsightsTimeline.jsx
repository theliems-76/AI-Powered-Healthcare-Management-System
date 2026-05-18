import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, Info, ArrowRight, TrendingUp, Activity, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const INITIAL_VISIBLE = 3;

export default function InsightsTimeline({ insights, patientId, patientName }) {
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(false);

    const visibleInsights = isExpanded ? insights : insights.slice(0, INITIAL_VISIBLE);
    const hasMore = insights.length > INITIAL_VISIBLE;

    const getInsightStyle = (type) => {
        switch (type) {
            case 'Thành tựu':
                return { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-500' };
            case 'Cảnh báo':
                return { icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-500' };
            case 'Thông tin':
                return { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-500' };
            default:
                return { icon: Info, color: 'text-slate-500', bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-500' };
        }
    };

    const parseTopRiskFactors = (explanation) => {
        if (!explanation || typeof explanation !== 'object') return [];
        return Object.entries(explanation)
            .filter(([_, value]) => value > 0)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([key, value]) => ({ key, value: (value * 100).toFixed(1) }));
    };

    return (
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm h-full">
            <h2 className="font-extrabold text-2xl text-slate-800 mb-8 ">Phân tích chuyên sâu từ AI</h2>
            
            <div className="relative pl-6 space-y-8 before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-slate-100">
                {insights.length === 0 && <p className="text-slate-400 font-medium">Chưa có phân tích y khoa nào được ghi nhận.</p>}
                
                {visibleInsights.map((item) => {
                    const style = getInsightStyle(item.type);
                    const Icon = style.icon;
                    const [datePart, timePart] = item.date.split(', ');
                    const topFactors = parseTopRiskFactors(item.explanation);

                    return (
                        <div key={item.id} className="relative group">
                            {}
                            <div className={`absolute -left-[30px] bg-white rounded-full p-1 border-2 ${style.border} z-10 shadow-sm group-hover:scale-110 transition-transform`}>
                                <Icon className={`w-4 h-4 ${style.color}`} />
                            </div>
                            
                            {}
                            <div className={`${style.bg} p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-all`}>
                                <div className="flex justify-between items-center mb-4 border-b border-white/50 pb-3">
                                    <div>
                                        <span className={`text-sm font-black ${style.text}`}>{datePart}</span>
                                        <span className="text-xs font-bold text-slate-400 uppercase ml-2">{timePart}</span>
                                    </div>
                                    <div className="flex items-center gap-1 bg-white/50 px-2 py-1 rounded-lg">
                                        <Activity className="w-3 h-3 text-slate-500" />
                                        <span className="text-xs font-bold text-slate-600">Sức khỏe: {item.health_status}/5</span>
                                    </div>
                                </div>
                                
                                <div className="mb-4">
                                    <h3 className={`font-bold text-lg mb-1 ${style.text}`}>Chẩn đoán: {item.diagnosis || 'Không có ghi chú'}</h3>
                                    <p className="text-slate-500 text-sm font-medium">Nguy cơ dự đoán: <span className="font-bold">{item.risk}%</span></p>
                                </div>

                                {}
                                {topFactors.length > 0 && (
                                    <div className="bg-white/60 p-4 rounded-xl mb-4">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                            <TrendingUp className="w-4 h-4 text-rose-500" />
                                            Yếu tố cốt lõi làm tăng rủi ro
                                        </h4>
                                        <div className="space-y-2">
                                            {topFactors.map(factor => (
                                                <div key={factor.key} className="flex justify-between items-center text-sm">
                                                    <span className="font-semibold text-slate-700">{factor.key}</span>
                                                    <span className="font-black text-rose-500">+{factor.value}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <button 
                                    onClick={() => navigate(`/history/${item.id}`, {
                                        state: patientId ? { patientId, patientName } : undefined
                                    })}
                                    className={`flex items-center gap-2 text-sm font-bold mt-2 ${style.text} hover:opacity-80 transition-opacity active:scale-95`}
                                >
                                    Xem Phác đồ Điều trị <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Gradient overlay + toggle button */}
            {hasMore && (
                <div className="relative mt-2">
                    {!isExpanded && (
                        <div className="absolute -top-16 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-b-3xl" />
                    )}
                    <button
                        onClick={() => setIsExpanded(prev => !prev)}
                        className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800 active:scale-[0.98] transition-all"
                    >
                        {isExpanded ? (
                            <><ChevronUp className="w-4 h-4" /> Thu gọn</>
                        ) : (
                            <><ChevronDown className="w-4 h-4" /> Xem tất cả {insights.length} bản ghi</>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
