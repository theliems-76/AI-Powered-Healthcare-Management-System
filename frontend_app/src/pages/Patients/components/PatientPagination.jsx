import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function PatientPagination({ pagination, onPageChange }) {
    const { page, totalPages, total, limit } = pagination;

    if (!totalPages || totalPages <= 1) return null;

    const from = (page - 1) * limit + 1;
    const to = Math.min(page * limit, total);

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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-2">
            {/* Hiển thị */}
            <p className="text-xs font-bold text-on-surface-variant">
                Hiển thị{' '}
                <span className="text-on-surface">{from}–{to}</span>{' '}
                của{' '}
                <span className="text-primary font-black">{total}</span> hồ sơ
            </p>

            {/* Điều hướng */}
            <div className="flex items-center gap-1">
                <Button
                    variant="outline"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                    className="p-2 min-w-[36px] h-9 flex items-center justify-center"
                    aria-label="Trang trước"
                >
                    <ChevronLeft className="w-4 h-4" />
                </Button>

                {getPageNumbers().map((p, idx) =>
                    p === '...' ? (
                        <span key={`e-${idx}`} className="px-2 text-on-surface-variant font-bold text-sm select-none">...</span>
                    ) : (
                        <Button
                            key={p}
                            variant={p === page ? 'primary' : 'outline'}
                            onClick={() => onPageChange(p)}
                            className="min-w-[36px] h-9 flex items-center justify-center text-sm font-bold p-0"
                        >
                            {p}
                        </Button>
                    )
                )}

                <Button
                    variant="outline"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === totalPages}
                    className="p-2 min-w-[36px] h-9 flex items-center justify-center"
                    aria-label="Trang sau"
                >
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
