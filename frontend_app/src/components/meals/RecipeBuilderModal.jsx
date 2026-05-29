import React, { useState, useEffect } from 'react';
import { Search, X, ArrowLeft, Plus, ChefHat, Trash2, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';

export default function RecipeBuilderModal({ isOpen, onClose, onDishCreated, initialData, onBack }) {
    const [ingredients, setIngredients] = useState([]);
    const [search, setSearch] = useState('');
    
    const [dishName, setDishName] = useState('');
    const [category, setCategory] = useState('Trưa');
    const [selectedIngs, setSelectedIngs] = useState([]); 
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen && initialData) {
            setDishName(initialData.name || '');
            setCategory(initialData.category || 'Trưa');
            
            if (initialData.Ingredients) {
                const formatted = initialData.Ingredients.map(ing => ({
                    id: ing.id,
                    name: ing.name,
                    calories_per_100g: ing.calories_per_100g,
                    carbs_per_100g: ing.carbs_per_100g,
                    protein_per_100g: ing.protein_per_100g,
                    weight: ing.DishIngredient?.weight_grams || 100
                }));
                setSelectedIngs(formatted);
            }
        } else if (isOpen && !initialData) {
            setDishName('');
            setCategory('Trưa');
            setSelectedIngs([]);
        }
    },[isOpen, initialData]);

    useEffect(() => {
        if (isOpen) fetchIngredients();
    },[isOpen]);

    const fetchIngredients = async () => {
        try {
            const response = await api.get('/meals/ingredients');
            setIngredients(response.data.data);
        } catch (error) {
            toast.error("Lỗi tải danh sách nguyên liệu!");
        }
    };

    if (!isOpen) return null;

    const filteredIngredients = ingredients.filter(ing => 
        ing.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleAddIngredient = (ing) => {
        if (selectedIngs.find(item => item.id === ing.id)) return;
        setSelectedIngs([...selectedIngs, { ...ing, weight: 100 }]);
    };

    const handleRemoveIngredient = (id) => {
        setSelectedIngs(selectedIngs.filter(item => item.id !== id));
    };

    const handleWeightChange = (id, value) => {
        let cleanValue = value.replace(/^0+/, ''); 
        if (cleanValue !== '') {
            cleanValue = parseInt(cleanValue, 10);
            if (isNaN(cleanValue) || cleanValue < 0) cleanValue = 0;
        }
        setSelectedIngs(selectedIngs.map(item => 
            item.id === id ? { ...item, weight: cleanValue } : item
        ));
    };

    const totals = selectedIngs.reduce((acc, ing) => {
        const weightNum = Number(ing.weight) || 0;
        const ratio = weightNum / 100;
        acc.calories += (ing.calories_per_100g * ratio);
        acc.carbs += (ing.carbs_per_100g * ratio);
        acc.protein += (ing.protein_per_100g * ratio);
        return acc;
    }, { calories: 0, carbs: 0, protein: 0 });

    const handleSaveDish = async () => {
        if (!dishName.trim()) return toast.warning("Vui lòng đặt tên cho món ăn!");
        setIsSaving(true);
        try {
            let finalName = dishName.trim();
            const payload = {
                name: finalName,
                category: category,
                ingredients: selectedIngs.map(ing => ({ id: ing.id, weight: Number(ing.weight) || 0 }))
            };

            if (initialData && initialData.is_custom) {
                await api.put(`/meals/custom-dish/${initialData.id}`, payload);
                toast.success(`Đã cập nhật thành công: ${finalName}`);
            } 
            else {
                if (initialData && finalName === initialData.name) {
                    finalName = `${finalName} (Tùy chỉnh)`;
                    payload.name = finalName;
                }
                await api.post('/meals/custom-dish', payload);
                toast.success(`Đã lưu bản sao thành công: ${finalName}`);
            }
            
            setDishName('');
            setSelectedIngs([]);
            if(onDishCreated) onDishCreated(); 
            onClose();
        } catch (error) {
            const errMsg = error.response?.data?.error || "Lỗi khi lưu món ăn!";
            toast.error(errMsg); 
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4 md:p-6 animate-in fade-in zoom-in-95 duration-300">
            {/* Modal Container */}
            <div className="bg-white/95 backdrop-blur-xl w-full max-w-5xl rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col md:flex-row max-h-[90vh] border border-white/50">
                
                {/* Left Column: Ingredients */}
                <div className="w-full md:w-5/12 flex flex-col bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/50 border-r border-slate-100/80">
                    <div className="p-6 md:px-8 border-b border-slate-100/50">
                        <h2 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600 tracking-tight">Thêm nguyên liệu</h2>
                        <div className="mt-4 relative">
                            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" />
                            <input 
                                type="text" placeholder="Tìm tên nguyên liệu..." 
                                value={search} onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 bg-white/80 backdrop-blur border border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none text-slate-900 transition-all shadow-sm placeholder:text-slate-400"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 md:px-8 space-y-3 custom-scrollbar">
                        {filteredIngredients.map(ing => (
                            <div key={ing.id} className="flex justify-between items-center p-4 bg-white/60 backdrop-blur-sm border border-white hover:border-indigo-200 rounded-2xl hover:shadow-md hover:shadow-indigo-500/5 hover:-translate-y-0.5 transition-all group">
                                <div>
                                    <p className="font-bold text-sm text-slate-900">{ing.name}</p>
                                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1">{ing.calories_per_100g} kcal/100g</p>
                                </div>
                                <button onClick={() => handleAddIngredient(ing)} className="w-9 h-9 flex items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-blue-600 hover:text-white hover:shadow-lg hover:shadow-indigo-500/30 transition-all transform active:scale-95">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Recipe Builder */}
                <div className="w-full md:w-7/12 flex flex-col relative bg-white/80">
                    
                    <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                        {initialData && (
                            <button 
                                onClick={onBack} 
                                className="flex items-center gap-1.5 px-4 py-2 bg-white/90 backdrop-blur hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200 rounded-xl transition-all text-[10px] font-bold uppercase tracking-widest shadow-sm"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" /> Trở lại
                            </button>
                        )}
                        <button 
                            onClick={onClose} 
                            className="w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-slate-400 hover:text-rose-600 rounded-2xl transition-all shadow-sm"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 md:px-8 pt-8">
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight pr-24">
                            {initialData ? 'Tinh chỉnh món ăn' : 'Tạo món ăn mới'}
                        </h2>
                        <div className="mt-6 space-y-4">
                            <input 
                                type="text" placeholder="Tên món ăn (vd: Ức gà áp chảo)..." 
                                value={dishName} onChange={(e) => setDishName(e.target.value)}
                                className="w-full text-lg font-black p-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none text-slate-900 transition-all placeholder:text-slate-400 shadow-sm"
                            />
                            <select 
                                value={category} onChange={(e) => setCategory(e.target.value)}
                                className="w-full p-4 text-sm font-bold bg-slate-50/50 border border-slate-200 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none text-slate-800 transition-all appearance-none shadow-sm cursor-pointer"
                            >
                                <option value="Sáng">Bữa Sáng</option>
                                <option value="Trưa">Bữa Trưa</option>
                                <option value="Tối">Bữa Tối</option>
                                <option value="Phụ">Bữa Phụ</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-6 md:px-8 py-2 space-y-3 custom-scrollbar">
                        {selectedIngs.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 hover:border-indigo-300 rounded-3xl bg-slate-50/50 transition-colors duration-300">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm mb-4">
                                    <ChefHat className="w-6 h-6 text-indigo-400" />
                                </div>
                                <p className="text-base font-black text-slate-600">Chưa có nguyên liệu nào.</p>
                                <p className="text-[11px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Hãy chọn nguyên liệu từ cột bên trái</p>
                            </div>
                        ) : (
                            selectedIngs.map(ing => (
                                <div key={ing.id} className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md border border-slate-100 hover:border-indigo-100 flex items-center justify-between gap-4 group transition-all">
                                    <span className="text-sm font-bold text-slate-900 flex-1 truncate">{ing.name}</span>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:bg-white transition-all">
                                            <input 
                                                type="number" min="0" value={ing.weight}
                                                onChange={(e) => handleWeightChange(ing.id, e.target.value)}
                                                className="w-12 p-0 text-center text-sm font-black text-slate-900 bg-transparent outline-none"
                                            />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase ml-1">g</span>
                                        </div>
                                        <button onClick={() => handleRemoveIngredient(ing.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:scale-110 active:scale-95">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Standard Unified Footer */}
                    <div className="mt-auto bg-white/90 backdrop-blur-md p-6 md:px-8 border-t border-slate-100">
                        <div className="flex justify-between items-end mb-6 bg-gradient-to-r from-slate-900 to-slate-800 p-5 rounded-2xl shadow-xl shadow-slate-900/20">
                            <div>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Tổng năng lượng</p>
                                <p className="text-3xl font-black text-white">{totals.calories.toFixed(0)} <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-0.5">kcal</span></p>
                            </div>
                            <div className="text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest space-y-2">
                                <p>Tinh bột: <span className="text-emerald-400 font-black text-xs ml-1">{totals.carbs.toFixed(1)}g</span></p>
                                <p>Đạm: <span className="text-amber-400 font-black text-xs ml-1">{totals.protein.toFixed(1)}g</span></p>
                            </div>
                        </div>
                        <button 
                            onClick={handleSaveDish} disabled={isSaving || selectedIngs.length === 0}
                            className={`w-full py-4 rounded-2xl font-black flex justify-center items-center gap-2 transition-all text-sm tracking-wide ${isSaving || selectedIngs.length === 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 shadow-xl shadow-indigo-500/30 hover:-translate-y-0.5 active:scale-95'}`}
                        >
                            <Save className="w-4 h-4" /> 
                            {isSaving ? 'Đang lưu...' : (initialData ? 'Cập nhật món ăn' : 'Lưu Vào Thực Đơn')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}