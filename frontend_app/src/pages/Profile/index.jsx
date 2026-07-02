import React, { useState, useEffect, useContext } from 'react';
import { MdPerson, MdPhone, MdEmail, MdCalendarMonth, MdLocationOn, MdMonitorWeight, MdStraighten, MdSave, MdLock, MdHealthAndSafety, MdCancel, MdCheckCircle, MdPsychology, MdSecurity } from 'react-icons/md';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function Profile() {
    const { user, updateUser } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    
    const [passwordData, setPasswordData] = useState({
        current_password: '', new_password: '', confirm_password: ''
    });
    
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [doctorInfo, setDoctorInfo] = useState(null);
    const [isRequestingDoctor, setIsRequestingDoctor] = useState(false);
    
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

                if (data.role === 'PATIENT') {
                    if (data.Profile?.Doctor) {
                        setDoctorInfo(data.Profile.Doctor);
                    } else {
                        fetchDoctors();
                    }
                }
            } catch (error) {
                toast.error("Lỗi khi tải thông tin hồ sơ!");
            } finally {
                setIsLoading(false);
            }
        };
        
        const fetchDoctors = async () => {
            try {
                const res = await api.get('/users/doctors');
                if (res.data.status === 'success') {
                    setDoctors(res.data.data);
                }
            } catch (error) {
                console.error("Lỗi khi tải danh sách bác sĩ", error);
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

    const handleRequestDoctor = async () => {
        if (!selectedDoctor) return toast.error("Vui lòng chọn một Bác sĩ!");
        setIsRequestingDoctor(true);
        try {
            await api.post('/users/request-doctor', { doctor_id: selectedDoctor });
            toast.success("Đã gửi yêu cầu kết nối! Vui lòng chờ Bác sĩ xác nhận.");
        } catch (error) {
            toast.error(error.response?.data?.error || "Lỗi khi gửi yêu cầu!");
        } finally {
            setIsRequestingDoctor(false);
        }
    };

    const handleRemoveDoctor = async () => {
        if (!window.confirm("Bạn có chắc chắn muốn hủy kết nối với Bác sĩ này?")) return;
        try {
            await api.delete('/users/remove-doctor');
            toast.success("Đã hủy kết nối thành công!");
            setDoctorInfo(null);
            fetchDoctors(); // Tải lại danh sách để chọn bác sĩ mới
        } catch (error) {
            toast.error("Lỗi khi hủy kết nối!");
        }
    };

    if (isLoading) {
        return <div className="flex justify-center py-20"><div className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full w-8 h-8  text-primary"></div></div>;
    }

    return (
        <div className="max-w-max-width mx-auto pb-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="pb-6 border-b border-outline-variant flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-black text-on-surface tracking-tight uppercase">Hồ Sơ Cá Nhân</h1>
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mt-2">Cập nhật định danh & sinh trắc học</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-8 space-y-8">
                    <form onSubmit={handleSubmit} className="bg-surface-container-lowest rounded-xl border border-outline-variant flex flex-col">
                <div className="p-6 md:p-8 space-y-8">
                    
                    {/* Section 1: Định danh */}
                    <div>
                        <div className="mb-4 border-l-2 border-primary pl-3">
                            <h3 className="font-bold text-sm text-on-surface uppercase tracking-wider">01. Thông tin định danh</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <Input 
                                label="Họ và tên"
                                icon={MdPerson}
                                type="text" 
                                name="full_name" 
                                value={formData.full_name} 
                                onChange={handleChange} 
                                required 
                            />
                            <div className="flex flex-col">
                                <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">Email (Định danh tĩnh)</label>
                                <div className="relative">
                                    <MdEmail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                                    <input 
                                        type="email" 
                                        value={user?.email || ''} 
                                        disabled 
                                        className="w-full pl-9 pr-3 py-2 bg-surface-container-low border border-outline-variant rounded text-sm font-semibold text-on-surface-variant cursor-not-allowed outline-none" 
                                    />
                                </div>
                            </div>
                            <Input 
                                label="Số điện thoại"
                                icon={MdPhone}
                                type="tel" 
                                name="phone" 
                                value={formData.phone} 
                                onChange={handleChange} 
                            />
                        </div>
                    </div>

                    <div className="w-full h-px bg-outline-variant/50"></div>

                    {/* Section 2: Sinh trắc học */}
                    <div>
                        <div className="mb-4 border-l-2 border-primary pl-3">
                            <h3 className="font-bold text-sm text-on-surface uppercase tracking-wider">02. Sinh trắc học cơ sở</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Input 
                                label="Cân nặng (kg)"
                                icon={MdMonitorWeight}
                                type="number" 
                                step="0.1" 
                                name="weight_kg" 
                                value={formData.weight_kg} 
                                onChange={handleChange} 
                                required 
                            />
                            <Input 
                                label="Chiều cao (cm)"
                                icon={MdStraighten}
                                type="number" 
                                step="0.1" 
                                name="height_cm" 
                                value={formData.height_cm} 
                                onChange={handleChange} 
                                required 
                            />
                            <Input 
                                label="Ngày sinh"
                                icon={MdCalendarMonth}
                                type="date" 
                                name="date_of_birth" 
                                value={formData.date_of_birth} 
                                onChange={handleChange} 
                            />
                            <div className="flex flex-col">
                                <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">Giới tính</label>
                                <select 
                                    name="gender" 
                                    value={formData.gender} 
                                    onChange={handleChange} 
                                    className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded text-sm font-semibold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface h-[38px]"
                                >
                                    <option value="M">Nam</option>
                                    <option value="F">Nữ</option>
                                    <option value="O">Khác</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Bác sĩ phụ trách */}
                    {user?.role === 'PATIENT' && (
                        <>
                            <div className="w-full h-px bg-outline-variant/50"></div>
                            <div>
                                <div className="mb-4 border-l-2 border-primary pl-3">
                                    <h3 className="font-bold text-sm text-on-surface uppercase tracking-wider">03. Bác Sĩ Phụ Trách</h3>
                                </div>
                                
                                {doctorInfo ? (
                                    <div className="bg-surface-container border border-outline-variant p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-surface-container-lowest rounded flex items-center justify-center border border-outline-variant">
                                                <MdHealthAndSafety className="w-5 h-5 text-on-surface-variant" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm text-on-surface">BS. {doctorInfo.full_name}</h4>
                                                <p className="text-xs font-medium text-on-surface-variant font-mono">{doctorInfo.email} • {doctorInfo.phone || 'Chưa cập nhật SĐT'}</p>
                                            </div>
                                        </div>
                                        <Button 
                                            variant="outline"
                                            onClick={handleRemoveDoctor}
                                            className="text-error border-error/50 hover:bg-error-container hover:border-error flex items-center gap-2"
                                        >
                                            <MdCancel className="w-4 h-4" /> Hủy Kết Nối
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="bg-surface-container border border-outline-variant p-4 rounded-lg space-y-4">
                                        <p className="text-sm text-on-surface-variant font-medium">Bạn chưa có Bác sĩ phụ trách. Vui lòng chọn Bác sĩ để được tư vấn sức khỏe và đặt lịch khám.</p>
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <select 
                                                value={selectedDoctor} 
                                                onChange={(e) => setSelectedDoctor(e.target.value)}
                                                className="flex-1 px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded text-sm font-semibold focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface"
                                            >
                                                <option value="">-- Chọn Bác sĩ --</option>
                                                {doctors.map(doc => (
                                                    <option key={doc.id} value={doc.id}>BS. {doc.full_name} ({doc.email})</option>
                                                ))}
                                            </select>
                                            <Button 
                                                onClick={handleRequestDoctor}
                                                disabled={isRequestingDoctor || !selectedDoctor}
                                                className="flex items-center justify-center gap-2"
                                            >
                                                {isRequestingDoctor ? <div className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full w-4 h-4"></div> : <MdCheckCircle className="w-4 h-4" />}
                                                Gửi Yêu Cầu
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    <div className="w-full h-px bg-outline-variant/50"></div>

                    {/* Section 4: Liên hệ */}
                    <div>
                        <div className="mb-4 border-l-2 border-primary pl-3">
                            <h3 className="font-bold text-sm text-on-surface uppercase tracking-wider">04. Địa chỉ liên hệ</h3>
                        </div>
                        <Input 
                            label="Địa chỉ thường trú"
                            icon={MdLocationOn}
                            type="text" 
                            name="address" 
                            value={formData.address} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>

                <div className="p-4 md:p-6 bg-surface-container-low border-t border-outline-variant flex justify-end">
                    <Button type="submit" disabled={isSaving} className="flex items-center gap-2">
                        {isSaving ? <div className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full w-4 h-4"></div> : <MdSave className="w-4 h-4" />}
                        {isSaving ? 'Đang lưu...' : 'Lưu Hồ Sơ'}
                    </Button>
                </div>
            </form>
            
            {/* Password Form */}
            <form onSubmit={handlePasswordSubmit} className="bg-surface-container-lowest rounded-lg border border-outline-variant flex flex-col">
                <div className="p-6 md:p-8 space-y-6">
                    <div className="mb-4 border-l-2 border-primary pl-3">
                        <h3 className="font-bold text-sm text-on-surface uppercase tracking-wider">05. Bảo mật</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input 
                            label="Mật khẩu hiện tại"
                            type="password" 
                            name="current_password" 
                            value={passwordData.current_password} 
                            onChange={handlePasswordChange} 
                            required 
                        />
                        <Input 
                            label="Mật khẩu mới"
                            type="password" 
                            name="new_password" 
                            value={passwordData.new_password} 
                            onChange={handlePasswordChange} 
                            required 
                            minLength="6" 
                        />
                        <Input 
                            label="Xác nhận mật khẩu"
                            type="password" 
                            name="confirm_password" 
                            value={passwordData.confirm_password} 
                            onChange={handlePasswordChange} 
                            required 
                            minLength="6" 
                        />
                    </div>
                </div>
                <div className="p-4 md:p-6 bg-surface-container-low border-t border-outline-variant flex justify-end">
                    <Button variant="outline" type="submit" disabled={isChangingPassword} className="flex items-center gap-2">
                        {isChangingPassword ? <div className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full w-4 h-4"></div> : <MdLock className="w-4 h-4" />}
                        {isChangingPassword ? 'Đang đổi...' : 'Đổi Mật Khẩu'}
                    </Button>
                </div>
                </form>
            </div>

            {/* Expert Corner / Sidebar */}
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-[0_8px_24px_rgba(0,24,72,0.06)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 z-0"></div>
                    
                    <h3 className="font-bold text-sm text-on-surface uppercase tracking-wider mb-4 relative z-10 flex items-center gap-2">
                        <MdPsychology className="w-5 h-5 text-primary" />
                        Trợ Lý Sức Khỏe AI
                    </h3>
                    
                    {formData.weight_kg && formData.height_cm ? (
                        (() => {
                            const bmi = (formData.weight_kg / Math.pow(formData.height_cm / 100, 2)).toFixed(1);
                            let status = 'Bình thường';
                            let color = 'text-secondary';
                            let bg = 'bg-secondary-container';
                            if (bmi < 18.5) { status = 'Thiếu cân'; color = 'text-tertiary'; bg = 'bg-tertiary-container'; }
                            else if (bmi >= 25 && bmi < 30) { status = 'Thừa cân'; color = 'text-error'; bg = 'bg-error-container'; }
                            else if (bmi >= 30) { status = 'Béo phì'; color = 'text-error'; bg = 'bg-error-container'; }
                            
                            return (
                                <div className="space-y-4 relative z-10">
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Chỉ số BMI</span>
                                        <span className="text-3xl font-black text-on-surface font-mono">{bmi}</span>
                                    </div>
                                    <div className={`px-3 py-1.5 rounded-lg text-xs font-bold ${color} ${bg} inline-block`}>
                                        {status}
                                    </div>
                                    <p className="text-sm text-on-surface-variant leading-relaxed">
                                        Hệ thống Clinical Curator sẽ tự động theo dõi biến động sinh trắc học của bạn để điều chỉnh phác đồ dinh dưỡng.
                                    </p>
                                </div>
                            )
                        })()
                    ) : (
                        <p className="text-sm text-on-surface-variant leading-relaxed relative z-10">
                            Vui lòng cập nhật đầy đủ chiều cao và cân nặng để trợ lý AI có thể đánh giá tổng quan thể trạng.
                        </p>
                    )}
                </div>

                <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6">
                    <h3 className="font-bold text-sm text-on-surface uppercase tracking-wider mb-4 flex items-center gap-2">
                        <MdSecurity className="w-5 h-5 text-secondary" />
                        Bảo Mật Lâm Sàng
                    </h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                        Thông tin định danh được mã hóa AES-256. Mọi sửa đổi hồ sơ cá nhân đều được lưu vết trên hệ thống Audit Log tuân thủ tiêu chuẩn y khoa.
                    </p>
                </div>
            </div>
        </div>
        </div>
    );
}