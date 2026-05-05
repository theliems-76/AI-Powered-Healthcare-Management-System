import React, { useState, useEffect } from 'react';
import { X, Info, Zap, ArrowLeft, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';

export default function ExerciseBuilderModal({ isOpen, onClose, onCreated, initialData, onBack }) {
    const [name, setName] = useState('');
    const [metValue, setMetValue] = useState('');
    const [category, setCategory] = useState('Cardio');
    const[isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen && initialData) {
            setName(initialData.name || '');
            setMetValue(initialData.met_value || '');
            setCategory(initialData.category || 'Cardio');
        } else if (isOpen && !initialData) {
            setName('');
            setMetValue('');
            setCategory('Cardio');
        }
    },[isOpen, initialData]);

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!name.trim() || !metValue) return toast.warning("Vui lòng nhập đủ Tên môn và Chỉ số MET!");
        
        setIsSaving(true);
        try {
            let finalName = name.trim();
            const payload = {
                name: finalName,
                met_value: parseFloat(metValue),
                category
            };

            if (initialData && initialData.is_custom) {
                await api.put(`/exercises/custom/${initialData.id}`, payload);
                toast.success(`🎉 Đã cập nhật thành công: ${finalName}`);
            } 
            else {
                if (initialData && finalName === initialData.name) {
                    finalName = `${finalName} (Tùy chỉnh)`;
                    payload.name = finalName;
                }
                await api.post('/exercises/custom', payload);
                toast.success(`🎉 Đã lưu thành công môn: ${finalName}`);
            }
            
            setName(''); setMetValue(''); setCategory('Cardio');
            if (onCreated) onCreated(); 
            onClose();
        } catch (error) {
            const errorMsg = error.response?.data?.error || "Lỗi khi lưu môn thể thao!";
            toast.error(errorMsg);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative">
                

                <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                    {initialData && (
                        <button onClick={onBack} className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl transition-colors text-xs font-bold shadow-sm">
                            <ArrowLeft className="w-4 h-4" /> Quay lại tìm môn
                        </button>
                    )}
                    <button onClick={onClose} className="p-1.5 bg-slate-50 border border-slate-200 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-colors shadow-sm">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 border-b border-slate-100 flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg"><Zap className="w-5 h-5" /></div>
                    <h2 className="text-lg font-bold text-slate-800 pr-24">
                        {initialData ? 'Tinh chỉnh Môn Tập' : 'Tạo Môn Tập Mới'}
                    </h2>
                </div>

                <div className="p-6 space-y-4 bg-white">
                    <div>
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Tên hoạt động</label>
                        <input type="text" placeholder="VD: Làm vườn, Khiêu vũ..." value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold text-slate-800 transition-all" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Chỉ số MET</label>
                            <input type="number" step="0.1" placeholder="VD: 5.0" value={metValue} onChange={(e) => setMetValue(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-black text-indigo-600 transition-all text-center" />
                        </div>
                        <div>
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Phân loại</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold text-slate-600 transition-all">
                                <option value="Cardio">Cardio / Tim mạch</option>
                                <option value="Sức mạnh">Sức mạnh / Cơ bắp</option>
                                <option value="Kéo giãn">Kéo giãn / Yoga</option>
                                <option value="Khác">Hoạt động hằng ngày</option>
                            </select>
                        </div>
                    </div>


                    <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl mt-2">
                        <div className="flex items-start gap-2 mb-3">
                            <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-[11px] font-bold text-indigo-900 uppercase">MET là gì?</p>
                                <p className="text-[11px] font-medium text-indigo-700 mt-1">Chỉ số tiêu hao năng lượng. Bấm để điền nhanh:</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {['Ngồi nhẹ (2.0)', 'Đi bộ vừa (3.5)', 'Thể thao nặng (6.0)', 'Cường độ cao (8.0)'].map(val => (
                                <button key={val} onClick={() => setMetValue(val.match(/\d+\.\d+/)[0])} className="px-2.5 py-1 bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-600 hover:text-white rounded-lg text-[10px] font-bold transition-colors shadow-sm">
                                    {val}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-5 border-t border-slate-100 bg-slate-50">
                    <button onClick={handleSave} disabled={isSaving} className="w-full py-3.5 rounded-xl font-bold text-white flex justify-center items-center gap-2 transition-all shadow-lg active:scale-95 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:shadow-none hover:shadow-indigo-200">
                        <Save className="w-5 h-5" /> {isSaving ? 'Đang lưu...' : (initialData ? 'Cập nhật Môn Tập' : 'Lưu Môn Tập Mới')}
                    </button>
                </div>
            </div>
        </div>
    );
}