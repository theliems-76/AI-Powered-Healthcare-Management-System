import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminPagination({ pagination, onPageChange }) {
    const { page, totalPages, total, limit } = pagination;

    if (!totalPages || totalPages <= 1) return null;

    const limitSafe = limit || 20;
    const from = (page - 1) * limitSafe + 1;
    const to = Math.min(page * limitSafe, total);

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            const half = Math.floor(maxVisible / 2);
            let start = Math.max(1, page - half);
            let end = Math.min(totalPages, start + maxVisible - 1);
            if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

            if (start > 1) { pages.push(1); if (start > 2) pages.push('...'); }
            for (let i = start; i <= end; i++) pages.push(i);
            if (end < totalPages) { if (end < totalPages - 1) pages.push('...'); pages.push(totalPages); }
        }
        return pages;
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-4 border-t border-slate-200 mt-4">
            {/* Hiển thị tóm tắt */}
            <p className="text-xs font-bold text-slate-500">
                Hiển thị{' '}
                <span className="text-slate-800">{from}–{to}</span>{' '}
                của{' '}
                <span className="text-blue-600">{total}</span> người dùng
            </p>

            {/* Điều hướng */}
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    aria-label="Trang trước"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {getPageNumbers().map((p, idx) =>
                    p === '...' ? (
                        <span key={`e-${idx}`} className="px-2 text-slate-400 font-bold text-sm select-none">...</span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onPageChange(p)}
                            className={`min-w-[36px] h-9 rounded-lg text-sm font-bold transition-all ${
                                p === page
                                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                                    : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            {p}
                        </button>
                    )
                )}

                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    aria-label="Trang sau"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
