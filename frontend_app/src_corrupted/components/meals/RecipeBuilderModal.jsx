import React, { useState, useEffect } from 'react';
import { Search, X, ArrowLeft, PlusCircle, ChefHat, Trash2, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';

export default function RecipeBuilderModal({ isOpen, onClose, onDishCreated, initialData, onBack }) {
    const [ingredients, setIngredients] = useState([]);
    const [search, setSearch] = useState('');
    
    const [dishName, setDishName] = useState('');
    const[category, setCategory] = useState('Trưa');
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
                toast.success(`🎉 Đã cập nhật thành công: ${finalName}`);
            } 
            else {
                if (initialData && finalName === initialData.name) {
                    finalName = `${finalName} (Tùy chỉnh)`;
                    payload.name = finalName;
                }
                await api.post('/meals/custom-dish', payload);
                toast.success(`🎉 Đã lưu bản sao thành công: ${finalName}`);
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">

            <div className="bg-slate-50 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
                

                <div className="w-full md:w-1/2 flex flex-col bg-white border-r border-slate-100">
                    <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                        <ChefHat className="text-blue-600 w-6 h-6" />
                        <h2 className="text-xl font-bold text-slate-800">Kho Nguyên Liệu</h2>
                    </div>
                    <div className="p-4 border-b border-slate-100">
                        <div className="relative">
                            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text" placeholder="Tìm nguyên liệu..." 
                                value={search} onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                        {filteredIngredients.map(ing => (
                            <div key={ing.id} className="flex justify-between items-center p-3 border border-slate-100 rounded-xl hover:border-blue-300 transition-colors">
                                <div>
                                    <p className="font-bold text-sm text-slate-700">{ing.name}</p>
                                    <p className="text-[10px] font-semibold text-slate-400">{ing.calories_per_100g} kcal/100g</p>
                                </div>
                                <button onClick={() => handleAddIngredient(ing)} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                                    <PlusCircle className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>


                <div className="w-full md:w-1/2 flex flex-col relative">
                    

                    <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                        {initialData && (
                            <button 
                                onClick={onBack} 
                                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl transition-colors text-xs font-bold shadow-sm"
                            >
                                <ArrowLeft className="w-4 h-4" /> Quay lại tìm món
                            </button>
                        )}
                        <button 
                            onClick={onClose} 
                            className="p-1.5 bg-white border border-slate-200 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-colors shadow-sm"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 pb-2 space-y-4">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 pr-24">
                            <ChefHat className="w-5 h-5 text-blue-600" />
                            {initialData ? 'Tinh chỉnh món ăn AI' : 'Tạo món ăn mới'}
                        </h2>
                        <input 
                            type="text" placeholder="Tên món ăn..." 
                            value={dishName} onChange={(e) => setDishName(e.target.value)}
                            className="w-full text-lg font-bold p-3 border-none bg-white rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <select 
                            value={category} onChange={(e) => setCategory(e.target.value)}
                            className="w-full p-3 text-sm font-semibold bg-white border-none rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-600"
                        >
                            <option value="Sáng">Bữa Sáng</option>
                            <option value="Trưa">Bữa Trưa</option>
                            <option value="Tối">Bữa Tối</option>
                            <option value="Phụ">Bữa Phụ</option>
                        </select>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
                        {selectedIngs.length === 0 && (
                            <div className="text-center text-slate-400 mt-10 text-sm font-medium">
                                {initialData ? 'Món ăn này chưa có thành phần.' : 'Hãy chọn nguyên liệu từ cột bên trái 👉'}
                            </div>
                        )}
                        {selectedIngs.map(ing => (
                            <div key={ing.id} className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between gap-2">
                                <span className="text-sm font-bold text-slate-700 flex-1 truncate">{ing.name}</span>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="number" min="0" value={ing.weight}
                                        onChange={(e) => handleWeightChange(ing.id, e.target.value)}
                                        className="w-16 p-1.5 text-center text-sm font-bold bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                                    />
                                    <span className="text-xs font-bold text-slate-400">g</span>
                                    <button onClick={() => handleRemoveIngredient(ing.id)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 bg-white border-t border-slate-100">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tổng năng lượng</p>
                                <p className="text-3xl font-black text-blue-600">{totals.calories.toFixed(0)} <span className="text-sm text-slate-400">kcal</span></p>
                            </div>
                            <div className="text-right text-xs font-bold text-slate-500 space-y-1">
                                <p>🌾 Tinh bột: <span className="text-slate-800">{totals.carbs.toFixed(1)}g</span></p>
                                <p>🥩 Đạm: <span className="text-slate-800">{totals.protein.toFixed(1)}g</span></p>
                            </div>
                        </div>
                        <button 
                            onClick={handleSaveDish} disabled={isSaving || selectedIngs.length === 0}
                            className={`w-full py-3.5 rounded-xl font-bold text-white flex justify-center items-center gap-2 transition-all shadow-lg active:scale-95 ${isSaving || selectedIngs.length === 0 ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-blue-200'}`}
                        >
                            <Save className="w-5 h-5" /> 
                            {isSaving ? 'Đang lưu...' : (initialData ? 'Cập nhật món ăn của tôi' : 'Lưu Vào Thực Đơn Của Tôi')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
