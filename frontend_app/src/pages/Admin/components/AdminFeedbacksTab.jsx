import React, { useState, useEffect, useMemo } from 'react';
import api from '../../../services/api';
import { MdMessage, MdChevronLeft, MdChevronRight, MdStar } from 'react-icons/md';
import { toast } from 'react-toastify';

const ITEMS_PER_PAGE = 9;

export default function AdminFeedbacksTab() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterRating, setFilterRating] = useState('ALL');

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const res = await api.get('/feedbacks');
                setFeedbacks(res.data.data);
            } catch (error) {
                console.error(error);
                toast.error("Không thể tải danh sách đánh giá.");
            } finally {
                setLoading(false);
            }
        };
        fetchFeedbacks();
    }, []);

    const filteredFeedbacks = useMemo(() => {
        if (filterRating === 'ALL') return feedbacks;
        return feedbacks.filter(fb => fb.rating === Number(filterRating));
    }, [feedbacks, filterRating]);

    const { currentData, totalPages, totalCount, overallAverage } = useMemo(() => {
        const total = filteredFeedbacks.length;
        
        // Calculate overall average based on ALL feedbacks, not just filtered ones
        const overallAvg = feedbacks.length > 0 
            ? (feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length).toFixed(1) 
            : 0;
        
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const current = filteredFeedbacks.slice(start, end);
        
        const pages = Math.ceil(total / ITEMS_PER_PAGE);
        
        return { currentData: current, totalPages: pages, totalCount: total, overallAverage: overallAvg };
    }, [filteredFeedbacks, currentPage, feedbacks]);

    const handleFilterChange = (e) => {
        setFilterRating(e.target.value);
        setCurrentPage(1); // Reset to first page when filtering
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-20">
                <div className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full w-8 h-8  text-outline"></div>
            </div>
        );
    }

    if (feedbacks.length === 0) {
        return (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-12 flex flex-col items-center justify-center text-center shadow-[0_4px_12px_rgba(0,24,72,0.04)]">
                <div className="p-4 bg-surface-container rounded-2xl mb-4">
                    <MdMessage size={32} className="text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Chưa có đánh giá nào</h3>
                <p className="text-sm font-medium text-on-surface-variant mt-2 max-w-sm">Hệ thống chưa ghi nhận được ý kiến đóng góp nào từ người dùng.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            {/* Header, Stats & Filter */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
                        Đánh Giá Từ Người Dùng
                    </h2>
                    
                    {/* Filter Dropdown */}
                    <div className="relative">
                        <select
                            value={filterRating}
                            onChange={handleFilterChange}
                            className="pl-3 pr-8 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none cursor-pointer text-on-surface font-medium font-sans shadow-[0_4px_12px_rgba(0,24,72,0.04)]"
                        >
                            <option value="ALL">Tất cả số sao</option>
                            <option value="5">⭐⭐⭐⭐⭐ (5 Sao)</option>
                            <option value="4">⭐⭐⭐⭐ (4 Sao)</option>
                            <option value="3">⭐⭐⭐ (3 Sao)</option>
                            <option value="2">⭐⭐ (2 Sao)</option>
                            <option value="1">⭐ (1 Sao)</option>
                        </select>
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-outline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>

                {/* Stats Panel */}
                <div className="flex items-center gap-6 bg-surface-container-lowest px-6 py-3 rounded-2xl border border-outline-variant shadow-[0_4px_12px_rgba(0,24,72,0.04)]">
                    <div className="text-center">
                        <p className="text-[10px] font-bold text-outline uppercase tracking-widest">Đang lọc</p>
                        <p className="text-xl font-black text-slate-900">{totalCount}</p>
                    </div>
                    <div className="w-px h-8 bg-surface-container-low"></div>
                    <div className="text-center flex flex-col items-center">
                        <p className="text-[10px] font-bold text-outline uppercase tracking-widest">Điểm trung bình</p>
                        <div className="flex items-center gap-1">
                            <span className="text-xl font-black text-slate-900">{overallAverage}</span>
                            <MdStar size={14} className="fill-amber-400 text-amber-400 mb-0.5" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentData.map((fb) => (
                    <div key={fb.id} className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-[0_4px_12px_rgba(0,24,72,0.04)] hover:shadow-md hover:border-slate-300 transition-all flex flex-col">
                        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
                            <div>
                                <h4 className="font-bold text-slate-900">{fb.Patient?.full_name || 'Người dùng ẩn danh'}</h4>
                                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mt-1">
                                    {new Date(fb.createdAt).toLocaleString('vi-VN')}
                                </p>
                            </div>
                            <div className="flex items-center gap-1 bg-surface-container px-2.5 py-1 rounded-lg">
                                <span className="font-black text-slate-900 text-lg">{fb.rating}</span>
                                <MdStar size={16} className="fill-amber-400 text-amber-400" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-on-surface-variant font-medium leading-relaxed italic">
                                "{fb.content || 'Không để lại lời bình.'}"
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                    <p className="text-xs font-medium text-on-surface-variant">
                        Hiển thị trang <span className="font-bold text-slate-900">{currentPage}</span> / {totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 bg-surface-container-lowest border border-outline-variant rounded-xl hover:bg-surface-container disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <MdChevronLeft size={18} className="text-on-surface" />
                        </button>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 bg-surface-container-lowest border border-outline-variant rounded-xl hover:bg-surface-container disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <MdChevronRight size={18} className="text-on-surface" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
