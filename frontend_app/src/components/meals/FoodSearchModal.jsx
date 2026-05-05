import React, { useState, useEffect } from 'react';
import { Search, X, Loader2, Trash2, ChefHat } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';

export default function FoodSearchModal({ isOpen, onClose, onAddMeal, onEditDish }) {
    const[dishes, setDishes] = useState([]);
    const [search, setSearch] = useState('');
    const[loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) fetchMenu();
    }, [isOpen]);

    const fetchMenu = async () => {
        setLoading(true);
        try {
            const response = await api.get('/meals/menu');
            setDishes(response.data.data);
        } catch (error) { 
            console.error(error); 
        } finally { 
            setLoading(false); 
        }
    };

    const handleClearAll = async () => {
        if (!window.confirm("CẢNH BÁO: Thao tác này sẽ xóa toàn bộ các món ăn trong Kho cá nhân của bạn (bao gồm cả món AI gợi ý). Bạn có chắc chắn?")) return;
        try {
            await api.delete('/meals/clear-all');
            toast.success("Đã làm sạch kho dữ liệu cá nhân!");
            fetchMenu(); 
        } catch (error) {
            toast.error("Lỗi khi dọn kho!");
        }
    };

    const handleDeleteCustom = async (dishId) => {
        if (!window.confirm("Bạn có chắc muốn xóa món ăn này khỏi kho?")) return;
        try {
            await api.delete(`/meals/custom-dish/${dishId}`);
            toast.success("Đã xóa món ăn!");
            setDishes(prev => prev.filter(d => d.id !== dishId));
        } catch (error) {
            const msg = error.response?.data?.error || "Lỗi khi xóa!";
            toast.error(msg);
        }
    };

    if (!isOpen) return null;
    const filteredDishes = dishes.filter(d => d.name?.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
                
                {}
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Kho Món Ăn</h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">Tìm kiếm và chọn món cho thực đơn của bạn</p>
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
                            type="text" placeholder="Tìm kiếm Phở, Cơm tấm, Ức gà..." autoFocus
                            value={search} onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm"
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
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                            <p className="text-sm font-medium">Đang tải dữ liệu...</p>
                        </div>
                    ) : filteredDishes.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                            <p className="text-sm font-medium">Không tìm thấy món ăn nào.</p>
                            <p className="text-xs mt-1">Hãy thử tìm từ khóa khác hoặc tạo món mới.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredDishes.map(dish => (
                                <div key={dish.id} className="p-4 rounded-2xl group border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all shadow-sm bg-white">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        
                                        {}
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <h4 className="font-bold text-slate-800 text-sm leading-tight group-hover:text-blue-700 transition-colors">{dish.name}</h4>
                                                <div className="flex gap-1">
                                                    {dish.is_ai_generated && <span className="text-[9px] px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded font-bold uppercase border border-amber-200">Gợi ý AI</span>}
                                                    {dish.is_custom && !dish.is_ai_generated && <span className="text-[9px] px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded font-bold uppercase border border-blue-200">Cá nhân</span>}
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{dish.category}</span>
                                        </div>

                                        {}
                                        <div className="flex items-center gap-2 shrink-0">
                                            
                                            {}
                                            {(dish.is_ai_generated || dish.is_custom) && (
                                                <button 
                                                    onClick={() => onEditDish(dish)} 
                                                    className="flex items-center gap-1 px-3 py-1.5 bg-white text-amber-600 hover:bg-amber-50 rounded-xl transition-all border border-amber-200 shadow-sm active:scale-95" 
                                                    title="Chỉnh sửa định lượng nguyên liệu"
                                                >
                                                    <ChefHat className="w-3.5 h-3.5" />
                                                    <span className="text-[11px] font-bold">Tinh chỉnh</span>
                                                </button>
                                            )}

                                            {}
                                            <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5">
                                                <span className="text-xs font-black text-slate-700">{dish.serving_size_g || 100}</span>
                                                <span className="text-[10px] text-slate-500 font-bold uppercase">g</span>
                                            </div>

                                            {}
                                            {dish.is_custom && (
                                                <button 
                                                    onClick={() => handleDeleteCustom(dish.id)} 
                                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                                    title="Xóa món này khỏi kho"
                                                >
                                                    <Trash2 className="w-4.5 h-4.5" />
                                                </button>
                                            )}

                                            {}
                                            <button 
                                                onClick={() => onAddMeal(dish, dish.serving_size_g || 100)}
                                                className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-200 active:scale-95 ml-1"
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