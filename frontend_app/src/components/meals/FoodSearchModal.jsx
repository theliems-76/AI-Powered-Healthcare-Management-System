import React, { useState, useEffect } from 'react';
import { Search, X, Loader2, Trash2, ChefHat, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';

export default function FoodSearchModal({ isOpen, onClose, onAddMeal, onEditDish, dailyGoal, consumed }) {
    const[dishes, setDishes] = useState([]);
    const [search, setSearch] = useState('');
    const[loading, setLoading] = useState(false);
    const [weights, setWeights] = useState({});

    const calculateDishMacros = (dish, targetWeight) => {
        if (!dish) return { calories: 0, carbs: 0, protein: 0 };
        
        let sumCal = 0, sumCarb = 0, sumPro = 0;
        
        if (dish.calories_per_100g > 0) {
            const ratio = targetWeight / 100;
            sumCal = dish.calories_per_100g * ratio;
            sumCarb = dish.carbs_per_100g * ratio;
            sumPro = dish.protein_per_100g * ratio;
        } else if (dish.Ingredients && dish.Ingredients.length > 0) {
            const ratio = targetWeight / (dish.serving_size_g || 100);
            dish.Ingredients.forEach(ing => {
                const ingWeight = (parseFloat(ing.DishIngredient?.weight_grams) || 0) * ratio;
                const r = ingWeight / 100;
                sumCal += (parseFloat(ing.calories_per_100g) || 0) * r;
                sumCarb += (parseFloat(ing.carbs_per_100g) || 0) * r;
                sumPro += (parseFloat(ing.protein_per_100g) || 0) * r;
            });
        }
        return { calories: sumCal, carbs: sumCarb, protein: sumPro };
    };

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
        <div className="fixed inset-0 bg-surface-container/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200">
            <div className="bg-surface w-full max-w-2xl rounded-xl shadow-lg flex flex-col max-h-[90vh] overflow-hidden border border-outline-variant">
                
                {/* Header */}
                <div className="p-6 md:px-8 md:py-6 flex justify-between items-center bg-surface z-10 border-b border-outline-variant">
                    <div>
                        <h2 className="text-xl font-semibold text-on-surface tracking-tight">Kho Món Ăn</h2>
                        <p className="text-xs text-on-surface-variant font-bold mt-1 uppercase tracking-wider">Tìm kiếm và chọn món cho thực đơn</p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-on-surface bg-surface-container-low hover:bg-surface-container-high rounded-full transition-all">
                        <X size={18} />
                    </button>
                </div>

                {/* Search & Stats */}
                <div className="px-6 md:px-8 pb-4 pt-4 bg-surface z-10 border-b border-outline-variant">
                    <div className="relative">
                        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                        <input 
                            type="text" placeholder="Tìm kiếm Phở, Cơm tấm, Ức gà..." autoFocus
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

                    {dailyGoal && consumed && (
                        <div className="mt-4 p-5 bg-surface-container-low rounded-xl space-y-4 border border-outline-variant">
                            {/* Calo */}
                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Ngân sách Calo</span>
                                    <span className="text-[11px] font-semibold text-on-surface">
                                        {Math.round(consumed.calories)} / {dailyGoal.calories} <span className="text-[10px] font-bold text-secondary uppercase">kcal</span>
                                    </span>
                                </div>
                                <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                                    <div className="bg-primary h-full transition-all" style={{ width: `${Math.min(100, (consumed.calories / dailyGoal.calories) * 100)}%` }}></div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-6">
                                {/* Carb */}
                                <div>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Tinh bột</span>
                                        <span className="text-[10px] font-semibold text-on-surface">
                                            {Math.round(consumed.carbs)} / {dailyGoal.carbs}g
                                        </span>
                                    </div>
                                    <div className="w-full bg-surface-container-highest rounded-full h-1 overflow-hidden">
                                        <div className="bg-blue-500 h-full transition-all" style={{ width: `${Math.min(100, (consumed.carbs / dailyGoal.carbs) * 100)}%` }}></div>
                                    </div>
                                </div>
                                
                                {/* Protein */}
                                <div>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Đạm</span>
                                        <span className="text-[10px] font-semibold text-on-surface">
                                            {Math.round(consumed.protein)} / {dailyGoal.protein}g
                                        </span>
                                    </div>
                                    <div className="w-full bg-surface-container-highest rounded-full h-1 overflow-hidden">
                                        <div className="bg-orange-500 h-full transition-all" style={{ width: `${Math.min(100, (consumed.protein / dailyGoal.protein) * 100)}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto px-6 md:px-8 py-4 custom-scrollbar bg-surface-container-lowest">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3 text-on-surface-variant">
                            <Loader2 className="w-8 h-8 animate-spin" />
                            <p className="text-xs font-bold uppercase tracking-wider">Đang tải dữ liệu...</p>
                        </div>
                    ) : filteredDishes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-on-surface-variant">
                            <Search className="w-10 h-10 mb-4 text-outline-variant" />
                            <p className="text-sm font-bold text-on-surface-variant">Không tìm thấy món ăn nào.</p>
                            <p className="text-xs font-medium mt-1">Hãy thử tìm từ khóa khác hoặc tạo món mới.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredDishes.map(dish => (
                                <div 
                                    key={dish.id} 
                                    className="p-4 rounded-xl group border border-outline-variant hover:border-primary hover:shadow-sm transition-all bg-surface"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        
                                        {/* Dish Info */}
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                                                <h4 className="font-semibold text-on-surface text-sm leading-tight">{dish.name}</h4>
                                                <div className="flex gap-1.5">
                                                    {dish.is_ai_generated && <span className="text-[9px] px-2 py-0.5 bg-primary/10 text-primary rounded-md font-bold uppercase tracking-wider border border-primary/20">AI Gợi Ý</span>}
                                                    {dish.is_custom && !dish.is_ai_generated && <span className="text-[9px] px-2 py-0.5 bg-secondary/10 text-secondary rounded-md font-bold uppercase tracking-wider border border-secondary/20">Cá Nhân</span>}
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{dish.category}</span>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 shrink-0">
                                            
                                            {(dish.is_ai_generated || dish.is_custom) && (
                                                <button 
                                                    onClick={() => onEditDish(dish)} 
                                                    className="flex items-center gap-1.5 px-3 py-2 bg-surface border border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-lg transition-all shadow-sm" 
                                                    title="Chỉnh sửa định lượng nguyên liệu"
                                                >
                                                    <ChefHat className="w-3.5 h-3.5" />
                                                    <span className="text-[10px] font-bold uppercase tracking-wider">Tinh chỉnh</span>
                                                </button>
                                            )}

                                            <div className="flex items-center bg-surface-container-lowest border border-outline-variant rounded-lg px-2 py-1.5 focus-within:bg-surface focus-within:border-primary transition-all">
                                                <input 
                                                    type="number"
                                                    min="1" max="5000"
                                                    value={weights[dish.id] !== undefined ? weights[dish.id] : (dish.serving_size_g || 100)}
                                                    onChange={(e) => setWeights({ ...weights, [dish.id]: e.target.value })}
                                                    className="w-12 text-sm font-semibold text-on-surface bg-transparent text-center outline-none"
                                                />
                                                <span className="text-[10px] text-on-surface-variant font-bold uppercase pr-1">g</span>
                                            </div>

                                            {dish.is_custom && (
                                                <button 
                                                    onClick={() => handleDeleteCustom(dish.id)} 
                                                    className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-colors border border-transparent"
                                                    title="Xóa món này khỏi kho"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}

                                            <button 
                                                onClick={() => {
                                                    const w = weights[dish.id] !== undefined ? Number(weights[dish.id]) : (dish.serving_size_g || 100);
                                                    onAddMeal(dish, w);
                                                }}
                                                className="px-4 py-2 bg-primary text-on-primary text-[11px] font-bold uppercase tracking-wider rounded-lg hover:opacity-90 transition-all active:scale-95 ml-1 shadow-sm"
                                                title="Thêm vào nhật ký"
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