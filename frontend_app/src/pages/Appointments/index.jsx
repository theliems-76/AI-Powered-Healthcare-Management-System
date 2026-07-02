import React, { useState, useEffect, useContext } from 'react';
import { createPortal } from 'react-dom';
import { AuthContext } from '../../context/AuthContext';
import { MdCheckCircle, MdCancel, MdSearch, MdAdd } from 'react-icons/md';
import api from '../../services/api';
import { toast } from 'react-toastify';
import Button from '../../components/ui/Button';

export default function Appointments() {
    const { user } = useContext(AuthContext);
    
    const getLocalDateString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterDate, setFilterDate] = useState(getLocalDateString());
    const [patients, setPatients] = useState([]);
    const [patientSearch, setPatientSearch] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        patient_profile_id: '',
        appointment_date: getLocalDateString(),
        appointment_time: '09:00',
        reason: ''
    });

    useEffect(() => {
        fetchAppointments();
        if (user?.role === 'DOCTOR') {
            fetchPatients();
        }
    }, [filterDate, user]);

    const fetchAppointments = async () => {
        setIsLoading(true);
        try {
            let url = '/appointments';
            if (user?.role === 'PATIENT') {
                url += `?date=${filterDate}`;
            }
            const res = await api.get(url);
            if (res.data.status === 'success') {
                setAppointments(res.data.data);
            }
        } catch (error) {
            toast.error("Lỗi khi tải danh sách lịch hẹn");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPatients = async () => {
        try {
            const res = await api.get('/users/patients?limit=1000');
            if (res.data.status === 'success') {
                setPatients(res.data.data);
            }
        } catch (error) {
            console.error("Lỗi khi tải bệnh nhân", error);
        }
    };

    const handleCreateAppointment = async (e) => {
        e.preventDefault();
        if (user?.role === 'DOCTOR' && !formData.patient_profile_id) {
            toast.warning("Vui lòng chọn bệnh nhân!");
            return;
        }
        try {
            const res = await api.post('/appointments', formData);
            if (res.data.status === 'success') {
                toast.success("Đã tạo lịch hẹn mới!");
                setIsModalOpen(false);
                fetchAppointments();
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "Lỗi tạo lịch hẹn");
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            const res = await api.put(`/appointments/${id}`, { status });
            if (res.data.status === 'success') {
                toast.success(`Đã cập nhật trạng thái: ${status}`);
                fetchAppointments();
            }
        } catch (error) {
            toast.error("Lỗi cập nhật trạng thái");
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-[#fff4e5] text-[#bd510b] border-[#ffe8cc]'; 
            case 'CONFIRMED': return 'bg-secondary-container text-secondary border-[#b8cac9]'; 
            case 'CANCELLED': return 'bg-error-container text-error border-error-container'; 
            case 'COMPLETED': return 'bg-surface-container-high text-on-surface-variant border-outline-variant';
            default: return 'bg-surface-container-high text-on-surface border-outline-variant';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'PENDING': return 'Chờ Duyệt';
            case 'CONFIRMED': return 'Xác Nhận';
            case 'CANCELLED': return 'Đã Hủy';
            case 'COMPLETED': return 'Hoàn Tất';
            default: return status;
        }
    };

    const generateWeekDays = (baseDateStr) => {
        const baseDate = new Date(baseDateStr);
        let day = baseDate.getDay();
        day = day === 0 ? 7 : day; // Make Sunday 7
        const monday = new Date(baseDate);
        monday.setDate(baseDate.getDate() - day + 1);
        
        return Array.from({length: 7}).map((_, i) => {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            return {
                date: d.toISOString().split('T')[0],
                dayName: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'][i],
                dayNum: d.getDate()
            };
        });
    };

    const weekDays = user?.role === 'DOCTOR' ? generateWeekDays(filterDate) : [];
    const hours = Array.from({ length: 11 }, (_, i) => `${String(i + 7).padStart(2, '0')}:00`); // 07:00 to 17:00

    const prevWeek = () => {
        const d = new Date(filterDate);
        d.setDate(d.getDate() - 7);
        setFilterDate(d.toISOString().split('T')[0]);
    };
    
    const nextWeek = () => {
        const d = new Date(filterDate);
        d.setDate(d.getDate() + 7);
        setFilterDate(d.toISOString().split('T')[0]);
    };

    const resetToToday = () => {
        setFilterDate(getLocalDateString());
    };

    if (user?.role === 'PATIENT' && !user?.Profile?.managed_by_doctor_id) {
        return (
            <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
                <div className="bg-surface-container-lowest rounded-2xl p-16 text-center shadow-[0_12px_40px_rgba(0,24,72,0.06)]">
                    <h3 className="text-3xl font-display font-bold text-on-surface tracking-tight mb-4">Chưa Có Bác Sĩ Phụ Trách</h3>
                    <p className="text-base text-on-surface-variant max-w-lg mx-auto">
                        Tính năng lịch hẹn hiện chỉ dành cho các bệnh nhân đã được bác sĩ tiếp nhận và đưa vào danh sách quản lý.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
            {/* Header Area - Editorial Layout */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-4 px-2">
                <div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-on-surface tracking-tight leading-tight">Lịch Hẹn <br/><span className="text-primary">Lâm Sàng</span></h1>
                    <p className="text-sm text-on-surface-variant mt-2 max-w-md">Quản lý và sắp xếp lịch thăm khám cho bệnh nhân trong hệ thống.</p>
                </div>
                <div className="flex items-center gap-4">
                    {user?.role === 'PATIENT' && (
                        <input 
                            type="date" 
                            value={filterDate} 
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="px-5 h-[48px] text-sm font-semibold bg-surface-container-lowest rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-on-surface shadow-[0_4px_12px_rgba(0,24,72,0.04)] border-none"
                        />
                    )}
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-2 h-[48px] px-6 rounded-xl bg-gradient-to-br from-primary to-primary-container text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-[0_8px_16px_rgba(37,99,235,0.2)]"
                    >
                        <MdAdd className="w-5 h-5" />
                        Tạo Lịch Khám
                    </button>
                </div>
            </div>

            {/* Doctor Calendar Grid */}
            {user?.role === 'DOCTOR' ? (
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-4 bg-surface-container-lowest p-2 rounded-2xl shadow-[0_4px_12px_rgba(0,24,72,0.04)]">
                            <button onClick={prevWeek} className="p-2 hover:bg-surface-container-low rounded-xl text-on-surface-variant transition-colors"><MdSearch className="w-5 h-5 hidden"/> <span className="text-xs font-bold px-2">Tuần trước</span></button>
                            <button onClick={resetToToday} className="px-4 py-2 bg-surface-container-high rounded-xl text-xs font-bold text-on-surface hover:bg-outline-variant transition-colors">Hôm nay</button>
                            <button onClick={nextWeek} className="p-2 hover:bg-surface-container-low rounded-xl text-on-surface-variant transition-colors"><span className="text-xs font-bold px-2">Tuần sau</span></button>
                        </div>
                        <h2 className="text-sm font-bold text-outline uppercase tracking-widest hidden md:block">
                            Tuần: {weekDays[0]?.date} đến {weekDays[6]?.date}
                        </h2>
                    </div>

                    <div className="overflow-x-auto custom-scrollbar pb-4">
                        <div className="min-w-[900px] bg-surface-container-lowest rounded-[2rem] border-none shadow-[0_12px_40px_rgba(0,24,72,0.06)] overflow-hidden flex flex-col">
                            {/* Header Row */}
                            <div className="grid grid-cols-8 border-b border-surface-container-highest bg-surface-container-low/30">
                                <div className="p-4 border-r border-surface-container-highest flex items-center justify-center">
                                    <span className="text-xs font-bold text-outline uppercase tracking-wider">Giờ / Ngày</span>
                                </div>
                                {weekDays.map(d => {
                                    const isToday = d.date === getLocalDateString();
                                    return (
                                        <div key={d.date} className="p-4 text-center border-r border-surface-container-highest last:border-r-0 relative">
                                            {isToday && <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>}
                                            <div className={`text-[11px] font-bold uppercase tracking-widest mb-1 ${isToday ? 'text-primary' : 'text-on-surface-variant'}`}>{d.dayName}</div>
                                            <div className={`text-2xl font-display font-bold ${isToday ? 'text-primary' : 'text-on-surface'}`}>{d.dayNum}</div>
                                        </div>
                                    );
                                })}
                            </div>
                            
                            {/* Body Rows */}
                            <div className="relative flex-1">
                                {isLoading && <div className="absolute inset-0 bg-surface/50 z-50 flex items-center justify-center backdrop-blur-sm"><div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full"></div></div>}
                                {hours.map(hour => (
                                    <div key={hour} className="grid grid-cols-8 border-b border-surface-container-highest last:border-b-0 min-h-[120px]">
                                        <div className="p-3 border-r border-surface-container-highest flex items-start justify-center bg-surface-container-low/10">
                                            <span className="text-[11px] font-bold text-outline mt-1 bg-surface-container px-2 py-1 rounded-lg">{hour}</span>
                                        </div>
                                        {weekDays.map(d => {
                                            const hourPrefix = hour.slice(0, 2);
                                            const hourAppts = appointments.filter(a => a.appointment_date === d.date && a.appointment_time.startsWith(hourPrefix));
                                            const isToday = d.date === getLocalDateString();
                                            
                                            return (
                                                <div key={`${d.date}-${hour}`} className={`p-2 border-r border-surface-container-highest last:border-r-0 ${isToday ? 'bg-primary/5' : 'bg-transparent'}`}>
                                                    {hourAppts.map(app => (
                                                        <div key={app.id} className={`p-3 rounded-2xl mb-2 text-xs border shadow-sm flex flex-col group ${getStatusStyle(app.status)}`}>
                                                            <div className="font-bold truncate mb-1 text-sm">{app.Patient?.User?.full_name}</div>
                                                            <div className="opacity-90 font-medium truncate mb-2">{app.appointment_time.slice(0,5)} • {app.reason || 'Khám'}</div>
                                                            
                                                            {app.status === 'PENDING' && (
                                                                <div className="flex gap-2 mt-auto">
                                                                    <button onClick={() => handleStatusChange(app.id, 'CONFIRMED')} className="flex-1 bg-white/50 hover:bg-white text-secondary py-1.5 rounded-lg font-bold transition-colors">Nhận</button>
                                                                    <button onClick={() => handleStatusChange(app.id, 'CANCELLED')} className="flex-1 bg-white/50 hover:bg-white text-error py-1.5 rounded-lg font-bold transition-colors">Từ chối</button>
                                                                </div>
                                                            )}
                                                            {app.status === 'CONFIRMED' && (
                                                                <button onClick={() => handleStatusChange(app.id, 'COMPLETED')} className="mt-auto w-full bg-white/40 hover:bg-white text-secondary py-1.5 rounded-lg font-bold transition-colors">Hoàn Tất</button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* Patient Appointments List - Editorial Card Style */
                <div className="space-y-4">
                    <div className="flex justify-between items-center px-2">
                        <h2 className="text-sm font-semibold text-outline uppercase tracking-widest">
                            Danh sách ngày {new Date(filterDate).toLocaleDateString('vi-VN')}
                        </h2>
                    </div>
                    
                    {isLoading ? (
                        <div className="py-20 text-center"><div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full mx-auto"></div></div>
                    ) : appointments.length === 0 ? (
                        <div className="bg-surface-container-lowest rounded-3xl p-16 flex flex-col items-center justify-center text-center shadow-[0_4px_20px_rgba(0,24,72,0.03)]">
                            <h3 className="text-2xl font-display font-bold text-on-surface mb-2">Không Có Lịch Hẹn</h3>
                            <p className="text-on-surface-variant max-w-sm">Bạn chưa có lịch thăm khám nào trong ngày này.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {appointments.map(app => (
                                <div key={app.id} className="bg-surface-container-lowest rounded-2xl p-6 flex flex-col md:flex-row gap-6 md:items-center shadow-[0_4px_20px_rgba(0,24,72,0.03)] hover:shadow-[0_8px_30px_rgba(0,24,72,0.06)] transition-shadow">
                                    <div className="flex-shrink-0 w-24">
                                        <div className="text-3xl font-display font-bold text-on-surface">{app.appointment_time.slice(0, 5)}</div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-display font-bold text-on-surface mb-1">
                                            Bác sĩ: {app.Doctor?.full_name}
                                        </h3>
                                        <div className="flex items-center gap-3 text-sm text-on-surface-variant">
                                            <span className="font-medium">{app.reason || 'Khám tổng quát'}</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase border ${getStatusStyle(app.status)}`}>
                                                {getStatusText(app.status)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        {app.status === 'PENDING' && (
                                            app.created_by_role === user?.role ? (
                                                <span className="px-4 py-2 bg-surface-container text-on-surface-variant text-xs font-semibold rounded-xl">
                                                    Đợi {user?.role === 'DOCTOR' ? 'Bệnh nhân' : 'Bác sĩ'} Duyệt
                                                </span>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleStatusChange(app.id, 'CONFIRMED')} className="p-3 bg-secondary-container text-secondary hover:bg-secondary hover:text-white rounded-xl transition-colors" title="Xác nhận">
                                                        <MdCheckCircle className="w-5 h-5" />
                                                    </button>
                                                    <button onClick={() => handleStatusChange(app.id, 'CANCELLED')} className="p-3 bg-error-container text-error hover:bg-error hover:text-white rounded-xl transition-colors" title="Từ chối">
                                                        <MdCancel className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Modal Tạo Lịch */}
            {isModalOpen && createPortal(
                <div className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-md z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-surface-container-lowest rounded-3xl w-full max-w-lg overflow-hidden shadow-[0_24px_60px_rgba(0,24,72,0.15)] animate-in zoom-in-95 duration-200">
                        <div className="px-8 py-6 flex justify-between items-center bg-surface-container-low/50 border-b border-outline-variant/30">
                            <h2 className="text-xl font-display font-bold text-on-surface">Tạo Lịch Khám</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container transition-colors">
                                <MdCancel className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateAppointment} className="p-8 space-y-6">
                            {user?.role === 'DOCTOR' && (
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-outline uppercase tracking-wider">Hồ Sơ Bệnh Nhân</label>
                                    <div className="bg-surface-container-low rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-all border border-outline-variant/30">
                                        <div className="flex items-center px-4 py-3 border-b border-outline-variant/30 bg-surface-container-lowest">
                                            <MdSearch className="w-5 h-5 text-outline mr-2" />
                                            <input 
                                                type="text" 
                                                placeholder="Tìm theo tên hoặc SĐT..."
                                                value={patientSearch}
                                                onChange={e => setPatientSearch(e.target.value)}
                                                className="w-full bg-transparent text-sm font-medium outline-none text-on-surface"
                                            />
                                        </div>
                                        <div className="max-h-48 overflow-y-auto custom-scrollbar pb-2">
                                            {patients.filter(p => 
                                                (p.full_name || '').toLowerCase().includes(patientSearch.toLowerCase()) || 
                                                (p.phone || '').includes(patientSearch)
                                            ).map(p => (
                                                <div 
                                                    key={p.id} 
                                                    onClick={() => {
                                                        setFormData({...formData, patient_profile_id: p.id});
                                                        setPatientSearch(p.full_name);
                                                    }}
                                                    className={`py-3 px-4 mx-2 mt-1 rounded-xl cursor-pointer transition-colors text-sm font-medium ${formData.patient_profile_id === p.id ? 'bg-primary-container text-on-primary-container' : 'hover:bg-surface-container-lowest text-on-surface'}`}
                                                >
                                                    {p.full_name} {p.phone ? `- ${p.phone}` : ''}
                                                </div>
                                            ))}
                                            {patients.length === 0 && <div className="text-center py-4 text-sm text-outline">Không có bệnh nhân</div>}
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-outline uppercase tracking-wider">Ngày Khám</label>
                                    <input 
                                        type="date" required
                                        value={formData.appointment_date}
                                        onChange={e => setFormData({...formData, appointment_date: e.target.value})}
                                        className="w-full px-4 py-3.5 bg-surface-container-low rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none text-on-surface border border-outline-variant/30"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-outline uppercase tracking-wider">Giờ Khám</label>
                                    <input 
                                        type="time" required
                                        value={formData.appointment_time}
                                        onChange={e => setFormData({...formData, appointment_time: e.target.value})}
                                        className="w-full px-4 py-3.5 bg-surface-container-low rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none text-on-surface border border-outline-variant/30"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-outline uppercase tracking-wider">Lý Do / Triệu Chứng</label>
                                <input 
                                    type="text"
                                    placeholder="Khám định kỳ, kiểm tra đường huyết..."
                                    value={formData.reason}
                                    onChange={e => setFormData({...formData, reason: e.target.value})}
                                    className="w-full px-4 py-3.5 bg-surface-container-low rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none text-on-surface placeholder:text-outline border border-outline-variant/30"
                                />
                            </div>
                            <div className="pt-6 flex justify-end gap-3 border-t border-outline-variant/30">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-semibold text-on-surface hover:bg-surface-container-low rounded-xl transition-colors">
                                    Hủy
                                </button>
                                <button type="submit" className="px-6 py-3 bg-gradient-to-br from-primary to-primary-container text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-[0_8px_16px_rgba(37,99,235,0.2)]">
                                    Xác Nhận Tạo
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
