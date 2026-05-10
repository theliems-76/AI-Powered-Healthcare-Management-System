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
        <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
            {}
            <div className="pb-4 border-b border-slate-200 mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Hồ Sơ Cá Nhân</h1>
                <p className="text-sm text-slate-500 mt-1">Cập nhật thông tin để AI tính toán định lượng Y khoa chính xác nhất.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 md:p-8 space-y-8">
                    
                    {}
                    <div>
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <User className="w-4 h-4 text-blue-600" /> Thông tin tài khoản
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">Họ và tên</label>
                                <div className="relative">
                                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">Email (Không thể đổi)</label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input type="email" value={user?.email || ''} disabled className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">Số điện thoại</label>
                                <div className="relative">
                                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    {}
                    <div>
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-emerald-600" /> Chỉ số sinh trắc học
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">Cân nặng (kg)</label>
                                <div className="relative">
                                    <Weight className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input type="number" step="0.1" name="weight_kg" value={formData.weight_kg} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">Chiều cao (cm)</label>
                                <div className="relative">
                                    <Ruler className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input type="number" step="0.1" name="height_cm" value={formData.height_cm} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">Ngày sinh</label>
                                <div className="relative">
                                    <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">Giới tính</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option value="M">Nam</option>
                                    <option value="F">Nữ</option>
                                    <option value="O">Khác</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    {}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2">Địa chỉ</label>
                        <div className="relative">
                            <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                    </div>
                </div>

                {}
                <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end">
                    <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-md hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50">
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        {isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                    </button>
                </div>
            </form>
            
            {/* Đổi mật khẩu Form */}
            <div className="mt-8">
                <div className="pb-4 border-b border-slate-200 mb-6">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-rose-600" />
                        Bảo Mật & Mật Khẩu
                    </h2>
                </div>
                
                <form onSubmit={handlePasswordSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 md:p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">Mật khẩu hiện tại</label>
                                <input type="password" name="current_password" value={passwordData.current_password} onChange={handlePasswordChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 outline-none" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">Mật khẩu mới</label>
                                <input type="password" name="new_password" value={passwordData.new_password} onChange={handlePasswordChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 outline-none" required minLength="6" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">Xác nhận mật khẩu mới</label>
                                <input type="password" name="confirm_password" value={passwordData.confirm_password} onChange={handlePasswordChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 outline-none" required minLength="6" />
                            </div>
                        </div>
                    </div>
                    <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end">
                        <button type="submit" disabled={isChangingPassword} className="flex items-center gap-2 px-8 py-3 bg-rose-600 text-white rounded-xl font-bold shadow-md hover:bg-rose-700 active:scale-95 transition-all disabled:opacity-50">
                            {isChangingPassword ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            {isChangingPassword ? 'Đang lưu...' : 'Đổi Mật Khẩu'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}