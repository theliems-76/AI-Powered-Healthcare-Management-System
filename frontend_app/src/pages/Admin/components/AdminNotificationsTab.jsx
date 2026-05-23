import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import { Send, Loader2 } from 'lucide-react';

export default function AdminNotificationsTab() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        targetRoles: ['ALL'],
        type: 'SYSTEM'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/admin/notifications/broadcast', formData);
            toast.success(res.data.message || 'Đã gửi thông báo thành công!');
            setFormData({ ...formData, title: '', message: '' });
        } catch (error) {
            toast.error(error.response?.data?.error || 'Lỗi gửi thông báo!');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleToggle = (role) => {
        let newRoles = [...formData.targetRoles];
        if (role === 'ALL') {
            newRoles = ['ALL'];
        } else {
            newRoles = newRoles.filter(r => r !== 'ALL');
            if (newRoles.includes(role)) {
                newRoles = newRoles.filter(r => r !== role);
            } else {
                newRoles.push(role);
            }
            if (newRoles.length === 0) newRoles = ['ALL'];
        }
        setFormData({ ...formData, targetRoles: newRoles });
    };

    return (
        <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100 animate-in slide-in-from-right-4 duration-300">
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-amber-400 to-orange-500 shadow-sm"></div>
                        <h2 className="text-base font-bold text-slate-900 uppercase tracking-widest flex items-center gap-3">
                            Thông Báo Toàn Hệ Thống
                        </h2>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Phát sóng thông điệp quan trọng tới người dùng.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Đối Tượng Nhận</label>
                        <div className="flex flex-wrap gap-2">
                            {['ALL', 'DOCTOR', 'PATIENT'].map(role => {
                                const isSelected = formData.targetRoles.includes(role);
                                const label = role === 'ALL' ? 'Tất cả' : (role === 'DOCTOR' ? 'Bác sĩ' : 'Bệnh nhân');
                                return (
                                    <button
                                        type="button"
                                        key={role}
                                        onClick={() => handleRoleToggle(role)}
                                        className={`px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 ${
                                            isSelected 
                                            ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10' 
                                            : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Phân Loại</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-sm"
                        >
                            <option value="SYSTEM">Hệ thống (Bảo trì, Update)</option>
                            <option value="ALERT">Cảnh báo Khẩn cấp</option>
                            <option value="INFO">Tin tức / Kiến thức</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Tiêu đề</label>
                    <input
                        type="text"
                        required
                        placeholder="VD: HỆ THỐNG SẼ BẢO TRÌ VÀO LÚC 12H ĐÊM NAY..."
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold uppercase tracking-wider text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-sm transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Nội dung chi tiết</label>
                    <textarea
                        required
                        rows="4"
                        placeholder="Nhập nội dung thông báo muốn gửi tới người dùng..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-sm transition-all resize-none"
                    ></textarea>
                </div>

                <div className="pt-2 flex justify-start">
                    <button
                        type="submit"
                        disabled={loading || !formData.title || !formData.message}
                        className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-amber-500/20 active:scale-95"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                        Phát Sóng Thông Báo
                    </button>
                </div>
            </form>
        </div>
    );
}
