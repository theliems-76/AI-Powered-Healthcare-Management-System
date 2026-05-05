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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
                
                {}
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Kho Bài Tập</h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">Tìm kiếm và chọn bài tập cho ngày hôm nay</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {}
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                    <div className="relative">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" placeholder="Tìm Chạy bộ, Bơi lội, Yoga..." autoFocus
                            value={search} onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all shadow-sm"
                        />
                    </div>
                    
                    {}
                    <div className="flex justify-end mt-3">
                        <button 
                            onClick={handleClearAll}
                            className="flex items-center gap-1.5 text-[11px] font-bold text-red-500 hover:text-red-700 transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
                        >
                            <Trash2 className="w-3.5 h-3.5" /> DỌN SẠCH KHO CÁ NHÂN
                        </button>
                    </div>
                </div>

                {}
                <div className="flex-1 overflow-y-auto p-3 custom-scrollbar bg-white">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
                            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                            <p className="text-sm font-medium">Đang tải dữ liệu...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                            <p className="text-sm font-medium">Không tìm thấy bài tập nào.</p>
                            <p className="text-xs mt-1">Hãy thử tìm từ khóa khác hoặc tạo môn mới.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filtered.map(ex => (
                                <div key={ex.id} className="p-4 rounded-2xl group border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all shadow-sm bg-white">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <h4 className="font-bold text-slate-800 text-sm leading-tight group-hover:text-indigo-700 transition-colors">{ex.name}</h4>
                                                <div className="flex gap-1">
                                                    {ex.is_ai_generated && <span className="text-[9px] px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded font-bold uppercase border border-amber-200">Gợi ý AI</span>}
                                                    {ex.is_custom && !ex.is_ai_generated && <span className="text-[9px] px-1.5 py-0.5 bg-indigo-100 text-indigo-800 rounded font-bold uppercase border border-indigo-200">Cá nhân</span>}
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chỉ số MET: <span className="text-indigo-600">{ex.met_value}</span></span>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            {}
                                            {(ex.is_ai_generated || ex.is_custom) && onEditExercise && (
                                                <button 
                                                    onClick={() => onEditExercise(ex)} 
                                                    className="flex items-center gap-1 px-2.5 py-1.5 bg-white text-amber-600 hover:bg-amber-50 rounded-xl transition-all border border-amber-200 shadow-sm active:scale-95" 
                                                    title="Chỉnh sửa chỉ số MET"
                                                >
                                                    <Zap className="w-3.5 h-3.5" />
                                                    <span className="text-[11px] font-bold">Tinh chỉnh</span>
                                                </button>
                                            )}

                                            {}
                                            {ex.is_custom && !ex.is_ai_generated && (
                                                <button onClick={() => handleDeleteCustom(ex.id)} className="p-1.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}

                                            {}
                                            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 focus-within:border-indigo-400 transition-colors">
                                                <input 
                                                    type="number" placeholder="Phút" min="1"
                                                    value={durations[ex.id] || ''}
                                                    onChange={(e) => handleDurationChange(ex.id, e.target.value)}
                                                    className="w-12 bg-transparent text-xs font-bold text-slate-700 outline-none text-center"
                                                />
                                                <span className="text-[9px] text-slate-400 font-bold uppercase">p</span>
                                            </div>

                                            {}
                                            <button 
                                                onClick={() => handleAdd(ex)} 
                                                className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 active:scale-95 ml-1"
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