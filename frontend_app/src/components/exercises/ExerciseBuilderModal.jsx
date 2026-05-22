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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden relative border border-slate-200">
                
                <div className="absolute top-6 right-6 flex items-center gap-2 z-10">
                    {initialData && (
                        <button onClick={onBack} className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-colors text-[10px] font-bold uppercase tracking-widest shadow-sm">
                            <ArrowLeft className="w-3.5 h-3.5" /> Quay lại tìm môn
                        </button>
                    )}
                    <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-800 rounded-full transition-colors border border-slate-100">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-8 border-b border-slate-100 flex items-center gap-4">
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                        <Zap className="w-6 h-6 text-slate-400" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight pr-12">
                        {initialData ? 'Tinh chỉnh Môn Tập' : 'Tạo Môn Tập Mới'}
                    </h2>
                </div>

                <div className="p-8 space-y-5 bg-white">
                    <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Tên hoạt động</label>
                        <input type="text" placeholder="VD: Làm vườn, Khiêu vũ..." value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100 outline-none text-sm font-bold text-slate-900 transition-all placeholder:text-slate-400" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Chỉ số MET</label>
                            <input type="number" step="0.1" placeholder="VD: 5.0" value={metValue} onChange={(e) => setMetValue(e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100 outline-none text-sm font-black text-slate-900 transition-all text-center placeholder:text-slate-400" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Phân loại</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100 outline-none text-sm font-bold text-slate-800 transition-all appearance-none">
                                <option value="Cardio">Cardio / Tim mạch</option>
                                <option value="Sức mạnh">Sức mạnh / Cơ bắp</option>
                                <option value="Kéo giãn">Kéo giãn / Yoga</option>
                                <option value="Khác">Hoạt động hằng ngày</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl mt-4">
                        <div className="flex items-start gap-3 mb-4">
                            <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest">MET là gì?</p>
                                <p className="text-[11px] font-bold text-slate-500 mt-1">Chỉ số tiêu hao năng lượng. Bấm để điền nhanh:</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {['Ngồi nhẹ (2.0)', 'Đi bộ vừa (3.5)', 'Thể thao nặng (6.0)', 'Cường độ cao (8.0)'].map(val => (
                                <button key={val} onClick={() => setMetValue(val.match(/\d+\.\d+/)[0])} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm">
                                    {val}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-8 border-t border-slate-100 bg-white">
                    <button onClick={handleSave} disabled={isSaving} className="w-full py-4 rounded-2xl font-bold text-white flex justify-center items-center gap-2 transition-all shadow-xl shadow-slate-900/10 active:scale-95 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:shadow-none text-xs uppercase tracking-widest">
                        <Save className="w-4 h-4" /> {isSaving ? 'Đang lưu...' : (initialData ? 'Cập nhật Môn Tập' : 'Lưu Môn Tập Mới')}
                    </button>
                </div>
            </div>
        </div>
    );
}