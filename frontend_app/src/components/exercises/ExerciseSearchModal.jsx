import React, { useState, useEffect } from 'react';
import { Search, X, Loader2, Trash2, Zap } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';

export default function ExerciseSearchModal({ isOpen, onClose, onAddExercise, onEditExercise }) {
    const [exercises, setExercises] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [durations, setDurations] = useState({});

    useEffect(() => {
        if (isOpen) fetchExercises();
    }, [isOpen]);

    const fetchExercises = async () => {
        setLoading(true);
        try {
            const response = await api.get('/exercises/list');
            setExercises(response.data.data);
        } catch (error) {
            console.error("Lỗi lấy bài tập:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleClearAll = async () => {
        if (!window.confirm("CẢNH BÁO: Thao tác này sẽ xóa toàn bộ các bài tập trong Kho cá nhân của bạn (Bao gồm cả AI gợi ý). Bạn có chắc chắn?")) return;
        try {
            await api.delete('/exercises/clear-all');
            toast.success("Đã làm sạch kho dữ liệu cá nhân!");
            fetchExercises(); 
        } catch (error) {
            toast.error("Lỗi khi dọn kho!");
        }
    };

    const handleDeleteCustom = async (exId) => {
        if (!window.confirm("Bạn có chắc muốn xóa bài tập này khỏi kho?")) return;
        try {
            await api.delete(`/exercises/custom/${exId}`);
            toast.success("Đã xóa bài tập!");
            setExercises(prev => prev.filter(ex => ex.id !== exId));
        } catch (error) {
            const msg = error.response?.data?.error || "Lỗi khi xóa!";
            toast.error(msg);
        }
    };

    const handleDurationChange = (id, value) => {
        let cleanValue = value.replace(/^0+/, ''); 
        setDurations({ ...durations, [id]: cleanValue });
    };

    const handleAdd = (exercise) => {
        const mins = parseInt(durations[exercise.id]);
        if (!mins || mins <= 0 || mins > 600) return toast.warning("Vui lòng nhập số phút tập hợp lệ (1 - 600)!");
        
        onAddExercise(exercise, mins);
        setDurations({ ...durations, [exercise.id]: '' }); 
    };

    if (!isOpen) return null;

    const filtered = exercises.filter(ex => ex.name?.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="fixed inset-0 bg-surface-container/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200">
            <div className="bg-surface w-full max-w-2xl rounded-xl shadow-lg flex flex-col max-h-[90vh] overflow-hidden border border-outline-variant">
                
                {/* Header */}
                <div className="p-6 md:px-8 md:py-6 flex justify-between items-center bg-surface z-10 border-b border-outline-variant">
                    <div>
                        <h2 className="text-xl font-semibold text-on-surface tracking-tight">Kho Bài Tập</h2>
                        <p className="text-xs text-on-surface-variant font-bold mt-1 uppercase tracking-wider">Tìm kiếm và chọn bài tập cho ngày hôm nay</p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-on-surface bg-surface-container-low hover:bg-surface-container-high rounded-full transition-all">
                        <X size={18} />
                    </button>
                </div>

                {/* Search */}
                <div className="px-6 md:px-8 py-4 bg-surface z-10 border-b border-outline-variant">
                    <div className="relative">
                        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                        <input 
                            type="text" placeholder="Tìm Chạy bộ, Bơi lội, Yoga..." autoFocus
                            value={search} onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border border-outline-variant rounded-lg text-sm font-bold focus:bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-on-surface-variant text-on-surface"
                        />
                    </div>
                    
                    <div className="flex justify-end mt-3">
                        <button 
                            onClick={handleClearAll}
                            className="flex items-center gap-1.5 text-[10px] font-bold text-on-surface-variant hover:text-error transition-colors px-3 py-1.5 rounded-lg hover:bg-error/10 uppercase tracking-wider"
                        >
                            <Trash2 className="w-3.5 h-3.5" /> DỌN SẠCH KHO CÁ NHÂN
                        </button>
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto px-6 md:px-8 py-4 custom-scrollbar bg-surface-container-lowest">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3 text-on-surface-variant">
                            <Loader2 className="w-8 h-8 animate-spin" />
                            <p className="text-xs font-bold uppercase tracking-wider">Đang tải dữ liệu...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-on-surface-variant">
                            <Search className="w-10 h-10 mb-4 text-outline-variant" />
                            <p className="text-sm font-bold text-on-surface-variant">Không tìm thấy bài tập nào.</p>
                            <p className="text-xs font-medium mt-1">Hãy thử tìm từ khóa khác hoặc tạo môn mới.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filtered.map(ex => (
                                <div key={ex.id} className="p-4 rounded-xl group border border-outline-variant hover:border-primary hover:shadow-sm transition-all bg-surface">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                                                <h4 className="font-semibold text-on-surface text-sm leading-tight">{ex.name}</h4>
                                                <div className="flex gap-1.5">
                                                    {ex.is_ai_generated && <span className="text-[9px] px-2 py-0.5 bg-primary/10 text-primary rounded-md font-bold uppercase tracking-wider border border-primary/20">AI Gợi Ý</span>}
                                                    {ex.is_custom && !ex.is_ai_generated && <span className="text-[9px] px-2 py-0.5 bg-secondary/10 text-secondary rounded-md font-bold uppercase tracking-wider border border-secondary/20">Cá Nhân</span>}
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Chỉ số MET: <span className="text-on-surface">{ex.met_value}</span></span>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            {(ex.is_ai_generated || ex.is_custom) && onEditExercise && (
                                                <button 
                                                    onClick={() => onEditExercise(ex)} 
                                                    className="flex items-center gap-1.5 px-3 py-2 bg-surface text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-lg transition-all border border-outline-variant shadow-sm" 
                                                    title="Chỉnh sửa chỉ số MET"
                                                >
                                                    <Zap className="w-3.5 h-3.5" />
                                                    <span className="text-[10px] font-bold uppercase tracking-wider">Tinh chỉnh</span>
                                                </button>
                                            )}

                                            <div className="flex items-center bg-surface-container-lowest border border-outline-variant rounded-lg px-2 py-1.5 focus-within:bg-surface focus-within:border-primary transition-all">
                                                <input 
                                                    type="number" min="1"
                                                    value={durations[ex.id] || ''}
                                                    onChange={(e) => handleDurationChange(ex.id, e.target.value)}
                                                    className="w-12 text-sm font-semibold text-on-surface bg-transparent text-center outline-none"
                                                />
                                                <span className="text-[10px] text-on-surface-variant font-bold uppercase pr-1">phút</span>
                                            </div>

                                            {ex.is_custom && !ex.is_ai_generated && (
                                                <button onClick={() => handleDeleteCustom(ex.id)} className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-colors border border-transparent">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}

                                            <button 
                                                onClick={() => handleAdd(ex)} 
                                                className="px-4 py-2 bg-primary text-on-primary text-[11px] font-bold uppercase tracking-wider rounded-lg hover:opacity-90 transition-all active:scale-95 ml-1 shadow-sm"
                                            >
                                                Thêm
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}