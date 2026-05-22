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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200">
            {/* Modal Container */}
            <div className="bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] border border-slate-200">
                
                {/* Left Column: Ingredients */}
                <div className="w-full md:w-5/12 flex flex-col bg-slate-50/50 border-r border-slate-200">
                    <div className="p-6 md:px-8 border-b border-slate-200">
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Thêm nguyên liệu</h2>
                        <div className="mt-4 relative">
                            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text" placeholder="Tìm tên nguyên liệu..." 
                                value={search} onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none text-slate-900 transition-all shadow-sm placeholder:text-slate-400"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 md:px-8 space-y-3 custom-scrollbar">
                        {filteredIngredients.map(ing => (
                            <div key={ing.id} className="flex justify-between items-center p-4 bg-white border border-slate-200 rounded-2xl hover:border-slate-400 hover:shadow-sm transition-all group">
                                <div>
                                    <p className="font-bold text-sm text-slate-900">{ing.name}</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{ing.calories_per_100g} kcal/100g</p>
                                </div>
                                <button onClick={() => handleAddIngredient(ing)} className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white hover:shadow-md hover:shadow-blue-600/20 transition-all border border-transparent">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Recipe Builder */}
                <div className="w-full md:w-7/12 flex flex-col relative bg-white">
                    
                    <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                        {initialData && (
                            <button 
                                onClick={onBack} 
                                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-colors text-[10px] font-bold uppercase tracking-widest shadow-sm"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" /> Trở lại
                            </button>
                        )}
                        <button 
                            onClick={onClose} 
                            className="w-10 h-10 flex items-center justify-center bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-800 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 md:px-8 pt-8">
                        <h2 className="text-xl font-black text-slate-900 tracking-tight pr-24">
                            {initialData ? 'Tinh chỉnh món ăn' : 'Tạo món ăn mới'}
                        </h2>
                        <div className="mt-6 space-y-4">
                            <input 
                                type="text" placeholder="Tên món ăn (vd: Ức gà áp chảo)..." 
                                value={dishName} onChange={(e) => setDishName(e.target.value)}
                                className="w-full text-base font-black p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none text-slate-900 transition-all placeholder:text-slate-400"
                            />
                            <select 
                                value={category} onChange={(e) => setCategory(e.target.value)}
                                className="w-full p-4 text-sm font-bold bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none text-slate-800 transition-all appearance-none"
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
                            <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-sm mb-3">
                                    <ChefHat className="w-5 h-5 text-slate-400" />
                                </div>
                                <p className="text-sm font-bold text-slate-600">Chưa có nguyên liệu nào.</p>
                                <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Hãy chọn nguyên liệu từ cột bên trái</p>
                            </div>
                        ) : (
                            selectedIngs.map(ing => (
                                <div key={ing.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between gap-4 group">
                                    <span className="text-sm font-bold text-slate-900 flex-1 truncate">{ing.name}</span>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:border-slate-400 focus-within:bg-white transition-all">
                                            <input 
                                                type="number" min="0" value={ing.weight}
                                                onChange={(e) => handleWeightChange(ing.id, e.target.value)}
                                                className="w-12 p-0 text-center text-sm font-black text-slate-900 bg-transparent outline-none"
                                            />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase ml-1">g</span>
                                        </div>
                                        <button onClick={() => handleRemoveIngredient(ing.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-transparent">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Standard Unified Footer */}
                    <div className="mt-auto bg-white p-6 md:px-8 border-t border-slate-100">
                        <div className="flex justify-between items-end mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <div>
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Tổng năng lượng</p>
                                <p className="text-3xl font-black text-slate-900">{totals.calories.toFixed(0)} <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-0.5">kcal</span></p>
                            </div>
                            <div className="text-right text-[10px] font-bold text-slate-500 uppercase tracking-widest space-y-2">
                                <p>Tinh bột: <span className="text-emerald-600 font-black text-xs ml-1">{totals.carbs.toFixed(1)}g</span></p>
                                <p>Đạm: <span className="text-amber-600 font-black text-xs ml-1">{totals.protein.toFixed(1)}g</span></p>
                            </div>
                        </div>
                        <button 
                            onClick={handleSaveDish} disabled={isSaving || selectedIngs.length === 0}
                            className={`w-full py-4 rounded-2xl font-bold flex justify-center items-center gap-2 transition-all text-xs uppercase tracking-widest ${isSaving || selectedIngs.length === 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-600/20 active:scale-95'}`}
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