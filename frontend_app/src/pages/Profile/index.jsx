import React, { useState, useEffect, useContext } from 'react';
import { User, Phone, Mail, Calendar, MapPin, Weight, Ruler, Save, Loader2, Activity, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

export default function Profile() {
    const { user, updateUser } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    
    const [passwordData, setPasswordData] = useState({
        current_password: '', new_password: '', confirm_password: ''
    });
    
    const [formData, setFormData] = useState({
        full_name: '', phone: '', date_of_birth: '', 
        gender: 'M', address: '', weight_kg: '', height_cm: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/users/profile');
                const data = response.data.data;
                
                setFormData({
                    full_name: data.full_name || '',
                    phone: data.phone || '',
                    date_of_birth: data.Profile?.date_of_birth || '',
                    gender: data.Profile?.gender || 'M',
                    address: data.Profile?.address || '',
                    weight_kg: data.Profile?.weight_kg || '',
                    height_cm: data.Profile?.height_cm || ''
                });
            } catch (error) {
                toast.error("Lỗi khi tải thông tin hồ sơ!");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await api.put('/users/profile', formData);
            updateUser({ full_name: formData.full_name, phone: formData.phone });
            toast.success("Đã cập nhật hồ sơ cá nhân!");
        } catch (error) {
            toast.error("Lỗi khi lưu hồ sơ!");
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.new_password !== passwordData.confirm_password) {
            return toast.error("Mật khẩu mới không khớp!");
        }
        setIsChangingPassword(true);
        try {
            await api.put('/users/password', passwordData);
            toast.success("Đổi mật khẩu thành công!");
            setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
        } catch (error) {
            toast.error(error.response?.data?.error || "Lỗi khi đổi mật khẩu!");
        } finally {
            setIsChangingPassword(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-12 animate-in fade-in duration-500">
            <div className="pb-6 border-b border-slate-100 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Hồ Sơ Cá Nhân</h1>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Cập nhật thông tin để AI tính toán chính xác nhất</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-8 md:p-10 space-y-10">
                    
                    {/* Section 1 */}
                    <div>
                        <div className="mb-6 border-l-2 border-slate-900 pl-3">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">01.</p>
                            <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">Thông tin định danh</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Họ và tên</label>
                                <div className="relative">
                                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all text-slate-900" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Email (Định danh tĩnh)</label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input type="email" value={user?.email || ''} disabled className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-400 cursor-not-allowed outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Số điện thoại liên lạc</label>
                                <div className="relative">
                                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all text-slate-900" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-px bg-slate-100"></div>

                    {/* Section 2 */}
                    <div>
                        <div className="mb-6 border-l-2 border-slate-900 pl-3">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">02.</p>
                            <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">Chỉ số sinh trắc học cơ sở</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Cân nặng (kg)</label>
                                <div className="relative">
                                    <Weight className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input type="number" step="0.1" name="weight_kg" value={formData.weight_kg} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-black focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all text-slate-900" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Chiều cao (cm)</label>
                                <div className="relative">
                                    <Ruler className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input type="number" step="0.1" name="height_cm" value={formData.height_cm} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-black focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all text-slate-900" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Ngày sinh</label>
                                <div className="relative">
                                    <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all text-slate-900" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Giới tính</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all text-slate-900">
                                    <option value="M">Nam</option>
                                    <option value="F">Nữ</option>
                                    <option value="O">Khác</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-px bg-slate-100"></div>

                    {/* Section 3 */}
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Địa chỉ thường trú</label>
                        <div className="relative">
                            <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all text-slate-900" />
                        </div>
                    </div>
                </div>

                <div className="p-6 md:p-10 bg-slate-50/50 border-t border-slate-100 flex justify-end">
                    <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-xl font-bold text-[11px] uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-50">
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isSaving ? 'Đang lưu...' : 'Lưu Hồ Sơ'}
                    </button>
                </div>
            </form>
            
            {/* Password Form */}
            <div className="mt-12">
                <form onSubmit={handlePasswordSubmit} className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-8 md:p-10 space-y-8">
                        <div className="mb-6 border-l-2 border-slate-900 pl-3">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">04.</p>
                            <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">Bảo mật tài khoản</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Mật khẩu hiện tại</label>
                                <input type="password" name="current_password" value={passwordData.current_password} onChange={handlePasswordChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all text-slate-900" required />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Mật khẩu mới</label>
                                <input type="password" name="new_password" value={passwordData.new_password} onChange={handlePasswordChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all text-slate-900" required minLength="6" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Xác nhận mật khẩu</label>
                                <input type="password" name="confirm_password" value={passwordData.confirm_password} onChange={handlePasswordChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all text-slate-900" required minLength="6" />
                            </div>
                        </div>
                    </div>
                    <div className="p-6 md:p-10 bg-slate-50/50 border-t border-slate-100 flex justify-end">
                        <button type="submit" disabled={isChangingPassword} className="flex items-center gap-2 px-8 py-3.5 bg-slate-200 text-slate-700 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-slate-300 active:scale-95 transition-all disabled:opacity-50">
                            {isChangingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                            {isChangingPassword ? 'Đang đổi...' : 'Đổi Mật Khẩu'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}