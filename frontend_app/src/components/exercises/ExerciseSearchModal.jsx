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
        if (!mins || mins <= 0) return toast.warning("Vui lòng nhập số phút tập hợp lệ!");
        
        onAddExercise(exercise, mins);
        setDurations({ ...durations, [exercise.id]: '' }); 
    };

    if (!isOpen) return null;

    const filtered = exercises.filter(ex => ex.name?.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200">
                
                {/* Header */}
                <div className="p-6 md:px-8 md:py-6 flex justify-between items-center bg-white z-10 border-b border-slate-100">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Kho Bài Tập</h2>
                        <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-widest">Tìm kiếm và chọn bài tập cho ngày hôm nay</p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-full transition-all">
                        <X size={18} />
                    </button>
                </div>

                {/* Search */}
                <div className="px-6 md:px-8 py-4 bg-white z-10 border-b border-slate-100">
                    <div className="relative">
                        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" placeholder="Tìm Chạy bộ, Bơi lội, Yoga..." autoFocus
                            value={search} onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100 outline-none transition-all placeholder:text-slate-400 text-slate-800"
                        />
                    </div>
                    
                    <div className="flex justify-end mt-3">
                        <button 
                            onClick={handleClearAll}
                            className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-rose-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-rose-50 uppercase tracking-widest"
                        >
                            <Trash2 className="w-3.5 h-3.5" /> DỌN SẠCH KHO CÁ NHÂN
                        </button>
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto px-6 md:px-8 py-4 custom-scrollbar bg-white">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
                            <Loader2 className="w-8 h-8 animate-spin" />
                            <p className="text-xs font-bold uppercase tracking-widest">Đang tải dữ liệu...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                            <Search className="w-10 h-10 mb-4 text-slate-200" />
                            <p className="text-sm font-bold text-slate-600">Không tìm thấy bài tập nào.</p>
                            <p className="text-xs font-medium mt-1">Hãy thử tìm từ khóa khác hoặc tạo môn mới.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filtered.map(ex => (
                                <div key={ex.id} className="p-4 rounded-2xl group border border-slate-100 hover:border-slate-300 hover:shadow-sm transition-all bg-white">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                                                <h4 className="font-bold text-slate-900 text-sm leading-tight">{ex.name}</h4>
                                                <div className="flex gap-1.5">
                                                    {ex.is_ai_generated && <span className="text-[9px] px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full font-bold uppercase tracking-widest border border-violet-200">AI Gợi Ý</span>}
                                                    {ex.is_custom && !ex.is_ai_generated && <span className="text-[9px] px-2 py-0.5 bg-sky-100 text-sky-700 rounded-full font-bold uppercase tracking-widest border border-sky-200">Cá Nhân</span>}
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Chỉ số MET: <span className="text-slate-700">{ex.met_value}</span></span>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            {(ex.is_ai_generated || ex.is_custom) && onEditExercise && (
                                                <button 
                                                    onClick={() => onEditExercise(ex)} 
                                                    className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 text-amber-600 hover:text-amber-700 hover:bg-amber-100 rounded-xl transition-all border border-amber-200 shadow-sm" 
                                                    title="Chỉnh sửa chỉ số MET"
                                                >
                                                    <Zap className="w-3.5 h-3.5" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">Tinh chỉnh</span>
                                                </button>
                                            )}

                                            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 focus-within:bg-white focus-within:border-slate-400 transition-all">
                                                <input 
                                                    type="number" min="1"
                                                    value={durations[ex.id] || ''}
                                                    onChange={(e) => handleDurationChange(ex.id, e.target.value)}
                                                    className="w-12 text-sm font-black text-slate-900 bg-transparent text-center outline-none"
                                                />
                                                <span className="text-[10px] text-slate-400 font-bold uppercase pr-1">phút</span>
                                            </div>

                                            {ex.is_custom && !ex.is_ai_generated && (
                                                <button onClick={() => handleDeleteCustom(ex.id)} className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-transparent">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}

                                            <button 
                                                onClick={() => handleAdd(ex)} 
                                                className="px-4 py-2 bg-slate-900 text-white text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all active:scale-95 ml-1 shadow-sm"
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