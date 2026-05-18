import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

const PAGE_SIZE = 5;

export default function InsightsTimeline({ insights }) {
    const navigate = useNavigate();
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    const getRiskStyle = (risk) => {
        if (risk <= 33) return { dot: 'bg-emerald-500', text: 'text-emerald-600', label: 'An toàn' };
        if (risk <= 66) return { dot: 'bg-amber-500', text: 'text-amber-600', label: 'Cảnh báo' };
        return { dot: 'bg-rose-500', text: 'text-rose-600', label: 'Rủi ro cao' };
    };

    if (insights.length === 0) {
        return (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Lịch sử Lâm sàng</p>
                <h2 className="text-base font-black text-slate-900 tracking-tight mb-6">Tóm tắt các lần Khám</h2>
                <p className="text-sm text-slate-400 font-medium">Chưa có phân tích y khoa nào được ghi nhận.</p>
            </div>
        );
    }

    const visibleRows = insights.slice(0, visibleCount);
    const hasMore = visibleCount < insights.length;
    const canCollapse = visibleCount > PAGE_SIZE;

    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Lịch sử Lâm sàng</p>
                    <h2 className="text-base font-black text-slate-900 tracking-tight">Tóm tắt các lần Khám</h2>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {visibleCount > insights.length ? insights.length : visibleCount} / {insights.length} bản ghi
                </span>
            </div>

            {/* Table header */}
            <div className="grid grid-cols-12 px-8 py-3 bg-slate-50/50 border-b border-slate-100">
                <div className="col-span-3"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ngày Khám</p></div>
                <div className="col-span-5"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kết luận AI</p></div>
                <div className="col-span-2 text-center"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rủi ro</p></div>
                <div className="col-span-2 text-center"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trạng thái</p></div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-slate-50">
                {visibleRows.map((item, idx) => {
                    const style = getRiskStyle(item.risk);
                    const [datePart] = item.date.split(', ');

                    return (
                        <div
                            key={item.id ?? idx}
                            onClick={() => navigate(`/history/${item.id}`)}
                            className="grid grid-cols-12 px-8 py-5 items-center hover:bg-slate-50/50 transition-colors cursor-pointer group"
                        >
                            <div className="col-span-3">
                                <p className="text-sm font-bold text-slate-700">{datePart}</p>
                            </div>
                            <div className="col-span-5 pr-4">
                                <p className="text-sm font-semibold text-slate-600 truncate">{item.diagnosis || '—'}</p>
                            </div>
                            <div className="col-span-2 flex items-center justify-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`}></span>
                                <span className={`text-sm font-black ${style.text}`}>{item.risk}%</span>
                            </div>
                            <div className="col-span-2 flex items-center justify-center gap-2">
                                <span className={`text-[10px] font-black uppercase tracking-wider ${style.text}`}>{style.label}</span>
                                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Expand / Collapse Footer */}
            {(hasMore || canCollapse) && (
                <div className="border-t border-slate-100 flex divide-x divide-slate-100">
                    {hasMore && (
                        <button
                            onClick={() => setVisibleCount(v => v + PAGE_SIZE)}
                            className="flex-1 flex items-center justify-center gap-2 py-4 text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                        >
                            <ChevronDown className="w-4 h-4" />
                            Xem thêm {Math.min(PAGE_SIZE, insights.length - visibleCount)} bản ghi
                        </button>
                    )}
                    {canCollapse && (
                        <button
                            onClick={() => setVisibleCount(PAGE_SIZE)}
                            className="flex-1 flex items-center justify-center gap-2 py-4 text-xs font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            <ChevronUp className="w-4 h-4" />
                            Thu gọn
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}