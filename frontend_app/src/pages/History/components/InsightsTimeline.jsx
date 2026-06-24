import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

const PAGE_SIZE = 5;

export default function InsightsTimeline({ insights }) {
    const navigate = useNavigate();
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    const getRiskStyle = (risk) => {
        if (risk <= 33) return { dot: 'bg-[#22c55e]', text: 'text-[#22c55e]', label: 'Nguy cơ thấp', bg: 'bg-primary-container', textLabel: 'text-on-primary-container' };
        if (risk <= 66) return { dot: 'bg-[#f97316]', text: 'text-[#f97316]', label: 'Nguy cơ trung bình', bg: 'bg-tertiary-container', textLabel: 'text-on-tertiary-container' };
        return { dot: 'bg-[#ef4444]', text: 'text-[#ef4444]', label: 'Nguy cơ cao', bg: 'bg-error-container', textLabel: 'text-on-error-container' };
    };

    if (insights.length === 0) {
        return (
            <div className="bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm p-8">
                <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Lịch sử Lâm sàng</p>
                <h2 className="text-base font-bold text-on-surface tracking-tight mb-6">Tóm tắt các lần Khám</h2>
                <p className="text-sm text-on-surface-variant font-medium">Chưa có phân tích y khoa nào được ghi nhận.</p>
            </div>
        );
    }

    const visibleRows = insights.slice(0, visibleCount);
    const hasMore = visibleCount < insights.length;
    const canCollapse = visibleCount > PAGE_SIZE;

    return (
        <div className="bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-8 py-6 border-b border-outline-variant flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Lịch sử Lâm sàng</p>
                    <h2 className="text-base font-bold text-on-surface tracking-tight">Tóm tắt các lần Khám</h2>
                </div>
                <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    {visibleCount > insights.length ? insights.length : visibleCount} / {insights.length} bản ghi
                </span>
            </div>

            {/* Table header */}
            <div className="grid grid-cols-12 px-8 py-3 bg-surface-container-low border-b border-outline-variant">
                <div className="col-span-3"><p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Ngày Khám</p></div>
                <div className="col-span-4"><p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Kết luận lâm sàng</p></div>
                <div className="col-span-2 text-center"><p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Chỉ định</p></div>
                <div className="col-span-1 text-center"><p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Rủi ro</p></div>
                <div className="col-span-2 text-right pr-4"><p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Trạng thái</p></div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-outline-variant">
                {visibleRows.map((item, idx) => {
                    const style = getRiskStyle(item.risk);
                    const [datePart] = item.date.split(', ');

                    return (
                        <div
                            key={item.id ?? idx}
                            onClick={() => navigate(`/history/${item.id}`)}
                            className="grid grid-cols-12 px-8 py-5 items-center hover:bg-surface-container transition-colors cursor-pointer group"
                        >
                            <div className="col-span-3">
                                <p className="text-sm font-bold text-on-surface">{datePart}</p>
                            </div>
                            <div className="col-span-4 pr-4">
                                <p className="text-sm font-medium text-on-surface-variant truncate">{item.diagnosis || '—'}</p>
                            </div>
                            <div className="col-span-2 flex justify-center">
                                {item.doctor_notes ? (
                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-primary text-on-primary text-xs font-semibold uppercase tracking-wider shadow-sm">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Đã duyệt
                                    </span>
                                ) : (
                                    <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider bg-surface-container px-2 py-1 rounded">Chờ duyệt</span>
                                )}
                            </div>
                            <div className="col-span-1 flex items-center justify-center gap-2">
                                <span className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`}></span>
                                <span className={`text-sm font-bold ${style.text}`}>{item.risk}%</span>
                            </div>
                            <div className="col-span-2 flex items-center justify-end gap-2 pr-2">
                                <span className={`text-xs font-bold uppercase tracking-wider ${style.text}`}>{style.label}</span>
                                <ArrowRight className="w-4 h-4 text-outline group-hover:text-on-surface transition-colors" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Expand / Collapse Footer */}
            {(hasMore || canCollapse) && (
                <div className="border-t border-outline-variant flex divide-x divide-outline-variant">
                    {hasMore && (
                        <button
                            onClick={() => setVisibleCount(v => v + PAGE_SIZE)}
                            className="flex-1 flex items-center justify-center gap-2 py-4 text-xs font-bold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
                        >
                            <ChevronDown className="w-4 h-4" />
                            Xem thêm {Math.min(PAGE_SIZE, insights.length - visibleCount)} bản ghi
                        </button>
                    )}
                    {canCollapse && (
                        <button
                            onClick={() => setVisibleCount(PAGE_SIZE)}
                            className="flex-1 flex items-center justify-center gap-2 py-4 text-xs font-bold text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
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