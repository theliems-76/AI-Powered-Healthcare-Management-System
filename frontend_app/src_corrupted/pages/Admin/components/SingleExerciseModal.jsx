import React, { useState } from 'react';
import { X, Save, Dumbbell } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../../services/api';

export default function SingleExerciseModal({ isOpen, onClose, onSuccess, initialData = null }) {
    const [formData, setFormData] = useState({
        name: '',
        category: 'Cardio',
        met_value: ''
    });

    React.useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                category: initialData.category,
                met_value: initialData.met_value
            });
        } else {
            setFormData({ name: '', category: 'Cardio', met_value: '' });
        }
    }, [initialData, isOpen]);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (initialData) {
                const res = await api.put(`/admin/exercises/${initialData.id}`, formData);
                toast.success(res.data.message);
            } else {
                const res = await api.post('/admin/exercises', formData);
                toast.success(res.data.message);
            }
            onSuccess(); // reload data
            onClose(); // close modal
            setFormData({ name: '', category: 'Cardio', met_value: '' }); // reset
        } catch (error) {
            toast.error(error.response?.data?.error || "Lỗi lưu bài tập!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
                
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Dumbbell className="w-5 h-5 text-blue-600" />
                        {initialData ? 'Cập Nhật Bài Tập' : 'Thêm Bài Tập Mới'}
                    </h3>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Tên bài tập</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="Ví dụ: Đẩy tạ đôi..."
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Phân loại</label>
                        <select
                            value={formData.category}
                            onChange={e => setFormData({...formData, category: e.target.value})}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer"
                        >
                            <option value="Cardio">Cardio</option>
                            <option value="Sức mạnh">Sức mạnh</option>
                            <option value="Linh hoạt">Linh hoạt</option>
                            <option value="Khác">Khác</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Hệ số MET (Calo tiêu thụ)</label>
                        <input
                            type="number"
                            step="0.1"
                            required
                            value={formData.met_value}
                            onChange={e => setFormData({...formData, met_value: e.target.value})}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="Ví dụ: 8.5"
                        />
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
                            {loading ? 'Đang lưu...' : 'Lưu bài tập'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
