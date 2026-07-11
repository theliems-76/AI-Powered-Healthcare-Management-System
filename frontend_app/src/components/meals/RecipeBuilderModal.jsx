import React, { useState, useEffect } from 'react';
import { Search, X, ArrowLeft, Plus, ChefHat, Trash2, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';

export default function RecipeBuilderModal({ isOpen, onClose, onDishCreated, initialData, onBack, isAdmin = false }) {
    const [ingredients, setIngredients] = useState([]);
    const [search, setSearch] = useState('');
    
    const [dishName, setDishName] = useState('');
    const [category, setCategory] = useState('Trưa');
    const [selectedIngs, setSelectedIngs] = useState([]); 
    const [isSaving, setIsSaving] = useState(false);
    const [isCreatingIng, setIsCreatingIng] = useState(false);
    const [newIng, setNewIng] = useState({ name: '', calories_per_100g: '', carbs_per_100g: '', protein_per_100g: '', fat_per_100g: '' });

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

            if (initialData && (initialData.is_custom || isAdmin)) {
                if (isAdmin) {
                    await api.put(`/admin/dishes/${initialData.id}`, payload);
                } else {
                    await api.put(`/meals/custom-dish/${initialData.id}`, payload);
                }
                toast.success(`Đã cập nhật thành công: ${finalName}`);
            } 
            else {
                if (initialData && finalName === initialData.name && !isAdmin) {
                    finalName = `${finalName} (Tùy chỉnh)`;
                    payload.name = finalName;
                }
                
                if (isAdmin) {
                    await api.post('/admin/dishes', payload);
                } else {
                    await api.post('/meals/custom-dish', payload);
                }
                toast.success(isAdmin ? `Đã lưu món hệ thống thành công: ${finalName}` : `Đã lưu bản sao thành công: ${finalName}`);
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

    const handleCreateNewIngredient = async () => {
        try {
            if (!newIng.name || !newIng.calories_per_100g) return toast.warning("Tên và Calo là bắt buộc!");
            const payload = {
                name: newIng.name,
                calories_per_100g: parseFloat(newIng.calories_per_100g) || 0,
                carbs_per_100g: parseFloat(newIng.carbs_per_100g) || 0,
                protein_per_100g: parseFloat(newIng.protein_per_100g) || 0,
                fat_per_100g: parseFloat(newIng.fat_per_100g) || 0,
            };
            const res = await api.post('/meals/ingredients', payload);
            const createdIng = res.data.data;
            setIngredients([...ingredients, createdIng]);
            handleAddIngredient(createdIng);
            toast.success("Đã tạo nguyên liệu mới!");
            setIsCreatingIng(false);
            setNewIng({ name: '', calories_per_100g: '', carbs_per_100g: '', protein_per_100g: '', fat_per_100g: '' });
            setSearch('');
        } catch (error) {
            toast.error("Lỗi tạo nguyên liệu!");
        }
    };

    return (
        <div className="fixed inset-0 bg-surface-container/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4 md:p-6 animate-in fade-in zoom-in-95 duration-300">
            {/* Modal Container */}
            <div className="bg-surface w-full max-w-5xl rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row max-h-[90vh] border border-outline-variant">
                
                {/* Left Column: Ingredients */}
                <div className="w-full md:w-5/12 flex flex-col bg-surface-container-lowest border-r border-outline-variant">
                    <div className="p-6 md:px-8 border-b border-outline-variant">
                        <h2 className="text-2xl font-semibold text-on-surface tracking-tight">Thêm nguyên liệu</h2>
                        <div className="mt-4 relative">
                            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                            <input 
                                type="text" placeholder="Tìm tên nguyên liệu..." 
                                value={search} onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 bg-surface border border-outline-variant rounded-lg text-sm font-semibold focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface transition-all shadow-sm placeholder:text-on-surface-variant"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 md:px-8 space-y-3 custom-scrollbar">
                        {isCreatingIng ? (
                            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant space-y-3">
                                <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-2">Tạo nguyên liệu mới</h3>
                                <input type="text" placeholder="Tên nguyên liệu..." value={newIng.name} onChange={e => setNewIng({...newIng, name: e.target.value})} className="w-full p-3 bg-surface border border-outline-variant rounded-lg text-sm font-semibold outline-none" />
                                <div className="grid grid-cols-2 gap-3">
                                    <input type="number" placeholder="Calo / 100g" value={newIng.calories_per_100g} onChange={e => setNewIng({...newIng, calories_per_100g: e.target.value})} className="w-full p-3 bg-surface border border-outline-variant rounded-lg text-sm font-semibold outline-none" />
                                    <input type="number" placeholder="Tinh bột / 100g" value={newIng.carbs_per_100g} onChange={e => setNewIng({...newIng, carbs_per_100g: e.target.value})} className="w-full p-3 bg-surface border border-outline-variant rounded-lg text-sm font-semibold outline-none" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <input type="number" placeholder="Đạm / 100g" value={newIng.protein_per_100g} onChange={e => setNewIng({...newIng, protein_per_100g: e.target.value})} className="w-full p-3 bg-surface border border-outline-variant rounded-lg text-sm font-semibold outline-none" />
                                    <input type="number" placeholder="Béo / 100g" value={newIng.fat_per_100g} onChange={e => setNewIng({...newIng, fat_per_100g: e.target.value})} className="w-full p-3 bg-surface border border-outline-variant rounded-lg text-sm font-semibold outline-none" />
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button onClick={handleCreateNewIngredient} className="flex-1 bg-primary text-on-primary py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider">Lưu lại</button>
                                    <button onClick={() => setIsCreatingIng(false)} className="flex-1 bg-surface-container-highest text-on-surface-variant py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider">Hủy</button>
                                </div>
                            </div>
                        ) : filteredIngredients.length === 0 && search ? (
                            <div className="text-center p-6 border border-dashed border-outline-variant rounded-xl bg-surface-container-lowest">
                                <p className="text-sm font-semibold text-on-surface mb-3">Không tìm thấy nguyên liệu!</p>
                                <button onClick={() => { setIsCreatingIng(true); setNewIng({...newIng, name: search}); }} className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-on-primary text-xs font-bold uppercase tracking-widest rounded-lg transition-colors">
                                    + Tạo mới "{search}"
                                </button>
                            </div>
                        ) : (
                            filteredIngredients.map(ing => (
                                <div key={ing.id} className="flex justify-between items-center p-4 bg-surface border border-outline-variant hover:border-primary rounded-xl hover:shadow-sm hover:-translate-y-0.5 transition-all group">
                                    <div>
                                        <p className="font-semibold text-sm text-on-surface">{ing.name}</p>
                                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mt-1">{ing.calories_per_100g} kcal/100g</p>
                                    </div>
                                    <button onClick={() => handleAddIngredient(ing)} className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-primary hover:text-on-primary transition-all transform active:scale-95">
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Column: Recipe Builder */}
                <div className="w-full md:w-7/12 flex flex-col relative bg-surface">
                    
                    <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                        {initialData && (
                            <button 
                                onClick={onBack} 
                                className="flex items-center gap-1.5 px-4 py-2 bg-surface hover:bg-surface-container-low text-on-surface-variant hover:text-on-surface border border-outline-variant rounded-lg transition-all text-[10px] font-bold uppercase tracking-wider shadow-sm"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" /> Trở lại
                            </button>
                        )}
                        <button 
                            onClick={onClose} 
                            className="w-10 h-10 flex items-center justify-center bg-surface border border-outline-variant hover:bg-surface-container-low text-on-surface-variant hover:text-on-surface rounded-lg transition-all shadow-sm"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 md:px-8 pt-8">
                        <h2 className="text-2xl font-semibold text-on-surface tracking-tight pr-24">
                            {initialData ? 'Tinh chỉnh món ăn' : 'Tạo món ăn mới'}
                        </h2>
                        <div className="mt-6 space-y-4">
                            <input 
                                type="text" placeholder="Tên món ăn (vd: Ức gà áp chảo)..." 
                                value={dishName} onChange={(e) => setDishName(e.target.value)}
                                className="w-full text-lg font-semibold p-4 bg-surface-container-low border border-outline-variant rounded-lg focus:bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface transition-all placeholder:text-on-surface-variant shadow-sm"
                            />
                            <select 
                                value={category} onChange={(e) => setCategory(e.target.value)}
                                className="w-full p-4 text-sm font-semibold bg-surface-container-low border border-outline-variant rounded-lg focus:bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface transition-all appearance-none shadow-sm cursor-pointer"
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
                            <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-outline-variant rounded-xl bg-surface-container-lowest transition-colors duration-300">
                                <div className="w-14 h-14 bg-surface rounded-xl flex items-center justify-center border border-outline-variant shadow-sm mb-4">
                                    <ChefHat className="w-6 h-6 text-on-surface-variant" />
                                </div>
                                <p className="text-base font-semibold text-on-surface">Chưa có nguyên liệu nào.</p>
                                <p className="text-[11px] font-bold text-on-surface-variant mt-2 uppercase tracking-wider">Hãy chọn nguyên liệu từ cột bên trái</p>
                            </div>
                        ) : (
                            selectedIngs.map(ing => (
                                <div key={ing.id} className="bg-surface p-4 rounded-xl shadow-sm border border-outline-variant flex items-center justify-between gap-4 group transition-all">
                                    <span className="text-sm font-semibold text-on-surface flex-1 truncate">{ing.name}</span>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-1.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary focus-within:bg-surface transition-all">
                                            <input 
                                                type="number" min="0" value={ing.weight}
                                                onChange={(e) => handleWeightChange(ing.id, e.target.value)}
                                                className="w-12 p-0 text-center text-sm font-semibold text-on-surface bg-transparent outline-none"
                                            />
                                            <span className="text-[10px] font-bold text-on-surface-variant uppercase ml-1">g</span>
                                        </div>
                                        <button onClick={() => handleRemoveIngredient(ing.id)} className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-all border border-transparent hover:scale-110 active:scale-95">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Standard Unified Footer */}
                    <div className="mt-auto bg-surface p-6 md:px-8 border-t border-outline-variant">
                        <div className="flex justify-between items-end mb-6 bg-surface-container-lowest border border-outline-variant p-5 rounded-xl">
                            <div>
                                <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Tổng năng lượng</p>
                                <p className="text-3xl font-semibold text-on-surface">{totals.calories.toFixed(0)} <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider ml-0.5">kcal</span></p>
                            </div>
                            <div className="text-right text-[10px] font-bold text-on-surface-variant uppercase tracking-wider space-y-2">
                                <p>Tinh bột: <span className="text-secondary font-semibold text-xs ml-1">{totals.carbs.toFixed(1)}g</span></p>
                                <p>Đạm: <span className="text-primary font-semibold text-xs ml-1">{totals.protein.toFixed(1)}g</span></p>
                            </div>
                        </div>
                        <button 
                            onClick={handleSaveDish} disabled={isSaving || selectedIngs.length === 0}
                            className={`w-full py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-all text-sm tracking-wide uppercase ${isSaving || selectedIngs.length === 0 ? 'bg-surface-container-highest text-on-surface-variant cursor-not-allowed' : 'bg-primary text-on-primary hover:opacity-90 active:scale-95 shadow-sm'}`}
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