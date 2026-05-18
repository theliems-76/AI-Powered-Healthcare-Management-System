import React, { useState } from 'react';
import { X, Save, Utensils } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../../services/api';

export default function SingleDishModal({ isOpen, onClose, onSuccess, initialData = null }) {
    const [formData, setFormData] = useState({
        name: '',
        category: 'Món chính',
        calories_per_100g: '',
        carbs_per_100g: '',
        protein_per_100g: '',
        fat_per_100g: ''
    });

    React.useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                category: initialData.category,
                calories_per_100g: initialData.calories_per_100g,
                carbs_per_100g: initialData.carbs_per_100g,
                protein_per_100g: initialData.protein_per_100g,
                fat_per_100g: initialData.fat_per_100g
            });
        } else {
            setFormData({ name: '', category: 'Món chính', calories_per_100g: '', carbs_per_100g: '', protein_per_100g: '', fat_per_100g: '' });
        }
    }, [initialData, isOpen]);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (initialData) {
                const res = await api.put(`/admin/dishes/${initialData.id}`, formData);
                toast.success(res.data.message);
            } else {
                const res = await api.post('/admin/dishes', formData);
                toast.success(res.data.message);
            }
            onSuccess(); // reload data
            onClose(); // close modal
            setFormData({ name: '', category: 'Món chính', calories_per_100g: '', carbs_per_100g: '', protein_per_100g: '', fat_per_100g: '' }); // reset
        } catch (error) {
            toast.error(error.response?.data?.error || "Lỗi lưu món ăn!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
                
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Utensils className="w-5 h-5 text-blue-600" />
                        {initialData ? 'Cập Nhật Món Ăn' : 'Thêm Món Ăn Mới'}
                    </h3>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Tên món ăn</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="Ví dụ: Cơm tấm..."
                            />
                        </div>
                        
                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Phân loại</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({...formData, category: e.target.value})}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer"
                            >
                                <option value="Món chính">Món chính</option>
                                <option value="Món ăn sáng">Món ăn sáng</option>
                                <option value="Món canh">Món canh</option>
                                <option value="Ăn vặt">Ăn vặt</option>
                                <option value="Khác">Khác</option>
                            </select>
                        </div>

                        <div className="col-span-1">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Calories/100g</label>
                            <input
                                type="number"
                                step="0.1"
                                required
                                value={formData.calories_per_100g}
                                onChange={e => setFormData({...formData, calories_per_100g: e.target.value})}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>

                        <div className="col-span-1">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Carbs/100g</label>
                            <input
                                type="number"
                                step="0.1"
                                required
                                value={formData.carbs_per_100g}
                                onChange={e => setFormData({...formData, carbs_per_100g: e.target.value})}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>

                        <div className="col-span-1">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Protein/100g</label>
                            <input
                                type="number"
                                step="0.1"
                                required
                                value={formData.protein_per_100g}
                                onChange={e => setFormData({...formData, protein_per_100g: e.target.value})}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>

                        <div className="col-span-1">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Fat/100g</label>
                            <input
                                type="number"
                                step="0.1"
                                required
                                value={formData.fat_per_100g}
                                onChange={e => setFormData({...formData, fat_per_100g: e.target.value})}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
                        >
                            Hủy bỏ
                        </button>
                        <button 
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
                        >
                            <Save className="w-4 h-4" />
                            {loading ? 'Đang lưu...' : 'Lưu món ăn'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
