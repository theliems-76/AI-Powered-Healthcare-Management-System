import React, { useState, useEffect, useContext } from 'react';
import { createPortal } from 'react-dom';
import { AuthContext } from '../../context/AuthContext';
import { Calendar, Clock, User, CheckCircle, XCircle, FileText, ChevronRight, Search } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function Appointments() {
    const { user } = useContext(AuthContext);
    
    // Sửa lỗi Timezone (Múi giờ UTC) khi lấy ngày hiện tại
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
            const res = await api.get(`/appointments?date=${filterDate}`);
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
            toast.warning("Vui lòng chọn một bệnh nhân từ danh sách!");
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
            toast.error(error.response?.data?.error || "Lỗi khi tạo lịch hẹn");
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            const res = await api.put(`/appointments/${id}`, { status });
            if (res.data.status === 'success') {
                toast.success(`Đã chuyển trạng thái thành ${status}`);
                fetchAppointments();
            }
        } catch (error) {
            toast.error("Lỗi khi cập nhật trạng thái");
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-[#f97316]/10 text-[#f97316] border-[#f97316]/20';
            case 'CONFIRMED': return 'bg-primary-container text-on-primary-container border-primary/20';
            case 'CANCELLED': return 'bg-error-container text-on-error-container border-error/20';
            case 'COMPLETED': return 'bg-surface-container text-on-surface-variant border-outline-variant';
            default: return 'bg-surface-container text-on-surface border-outline-variant';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'PENDING': return 'Chờ duyệt';
            case 'CONFIRMED': return 'Đã xác nhận';
            case 'CANCELLED': return 'Đã hủy';
            case 'COMPLETED': return 'Hoàn tất';
            default: return status;
        }
    };

    if (user?.role === 'PATIENT' && !user?.Profile?.managed_by_doctor_id) {
        return (
            <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
                <div className="bg-surface-container-lowest rounded-lg border border-outline-variant p-12 text-center">
                    <h3 className="text-xl font-black text-on-surface uppercase tracking-tight mb-2">Chưa có Bác sĩ phụ trách</h3>
                    <p className="text-sm font-medium text-on-surface-variant max-w-lg mx-auto">
                        Tính năng lịch hẹn hiện chỉ dành cho các bệnh nhân đã được bác sĩ tiếp nhận và đưa vào danh sách quản lý.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="pb-6 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 shrink-0">
                <div>
                    <h1 className="text-3xl font-black text-on-surface tracking-tight uppercase">Quản Lý Lịch Hẹn</h1>
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mt-2">Sắp xếp thời gian thăm khám bệnh nhân</p>
                </div>
                <div className="flex items-center gap-3">
                    <input 
                        type="date" 
                        value={filterDate} 
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="px-4 h-[44px] text-sm font-bold bg-surface-container-lowest border border-outline-variant rounded-xl focus:border-on-surface focus:ring-1 focus:ring-on-surface outline-none text-on-surface"
                    />
                    <Button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-2 h-[44px]"
                    >
                        Tạo Lịch Khám
                    </Button>
                </div>
            </div>

            {/* List */}
            <div className="bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden">
                <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
                    <h2 className="text-xs font-black text-on-surface uppercase tracking-widest">Danh sách ngày {new Date(filterDate).toLocaleDateString('vi-VN')}</h2>
                </div>
                
                {isLoading ? (
                    <div className="p-12 text-center text-on-surface-variant"><div className="animate-spin w-6 h-6 border-2 border-on-surface border-t-transparent rounded-full mx-auto"></div></div>
                ) : appointments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <h3 className="text-xl font-black text-on-surface uppercase tracking-tight mb-2">Trống Lịch Hẹn</h3>
                        <p className="text-sm font-medium text-on-surface-variant">Chưa có bệnh nhân nào được xếp lịch thăm khám trong ngày này.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-outline-variant">
                        {appointments.map(app => (
                            <div key={app.id} className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center hover:bg-surface-container/50 transition-colors">
                                <div className="flex-shrink-0 w-24">
                                    <div className="text-2xl font-black text-on-surface tracking-tight">{app.appointment_time.slice(0, 5)}</div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-black text-on-surface mb-1">
                                        {app.Patient?.User?.full_name}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm font-medium text-on-surface-variant">
                                        <span>{app.reason || 'Khám tổng quát'}</span>
                                        <span className={`px-2.5 py-0.5 rounded border text-[10px] uppercase font-bold tracking-widest ${getStatusStyle(app.status)}`}>
                                            {getStatusText(app.status)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {app.status === 'PENDING' && (
                                        app.created_by_role === user?.role ? (
                                            <span className="px-3 py-1.5 bg-[#f97316]/10 text-[#f97316] text-[10px] font-bold uppercase tracking-widest rounded-xl border border-[#f97316]/20">
                                                Đợi {user?.role === 'DOCTOR' ? 'bệnh nhân' : 'bác sĩ'} duyệt
                                            </span>
                                        ) : (
                                            <>
                                                <button onClick={() => handleStatusChange(app.id, 'CONFIRMED')} className="p-2.5 bg-primary-container text-on-primary-container hover:bg-primary-container/80 rounded-xl transition-colors" title="Xác nhận">
                                                    <CheckCircle className="w-5 h-5" />
                                                </button>
                                                <button onClick={() => handleStatusChange(app.id, 'CANCELLED')} className="p-2.5 bg-error-container text-on-error-container hover:bg-error-container/80 rounded-xl transition-colors" title="Từ chối">
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                            </>
                                        )
                                    )}
                                    {app.status === 'CONFIRMED' && (
                                        <Button onClick={() => handleStatusChange(app.id, 'COMPLETED')}>
                                            Hoàn tất
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal Tạo lịch */}
            {isModalOpen && createPortal(
                <div className="fixed inset-0 bg-scrim/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-surface-container-lowest rounded-lg w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-outline-variant">
                        <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
                            <h2 className="text-lg font-black text-on-surface uppercase tracking-wide">Thêm Lịch Khám</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-on-surface-variant hover:text-on-surface"><XCircle className="w-6 h-6" /></button>
                        </div>
                        <form onSubmit={handleCreateAppointment} className="p-6 space-y-6">
                            {user?.role === 'DOCTOR' && (
                                <div>
                                    <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Bệnh nhân</label>
                                    <div className="border border-outline-variant rounded-xl overflow-hidden focus-within:border-on-surface focus-within:ring-1 focus-within:ring-on-surface transition-all bg-surface-container-lowest">
                                        <div className="flex items-center px-4 py-2 border-b border-outline-variant bg-surface-container-lowest">
                                            <Search className="w-4 h-4 text-on-surface-variant mr-2 shrink-0" />
                                            <input 
                                                type="text" 
                                                placeholder="Tìm tên hoặc số điện thoại..."
                                                value={patientSearch}
                                                onChange={e => setPatientSearch(e.target.value)}
                                                className="w-full bg-transparent text-sm font-bold outline-none placeholder:font-medium placeholder:text-on-surface-variant text-on-surface"
                                            />
                                        </div>
                                        <select 
                                            required size="4"
                                            value={formData.patient_profile_id}
                                            onChange={e => {
                                                const selectedId = e.target.value;
                                                const selectedPatient = patients.find(p => p.id === selectedId);
                                                setFormData({...formData, patient_profile_id: selectedId});
                                                if (selectedPatient) {
                                                    setPatientSearch(selectedPatient.full_name);
                                                }
                                            }}
                                            className="w-full px-2 py-2 bg-surface-container-low text-sm font-bold outline-none custom-scrollbar cursor-pointer text-on-surface"
                                        >
                                            {patients.filter(p => 
                                                (p.full_name || '').toLowerCase().includes(patientSearch.toLowerCase()) || 
                                                (p.phone || '').includes(patientSearch)
                                            ).map(p => (
                                                <option key={p.id} value={p.id} className="py-2.5 px-3 rounded-lg hover:bg-surface-container mb-1">{p.full_name} {p.phone ? `- ${p.phone}` : ''}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Ngày khám</label>
                                    <input 
                                        type="date" required
                                        value={formData.appointment_date}
                                        onChange={e => setFormData({...formData, appointment_date: e.target.value})}
                                        className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm font-bold focus:border-on-surface focus:ring-1 focus:ring-on-surface outline-none text-on-surface"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Giờ khám</label>
                                    <input 
                                        type="time" required
                                        value={formData.appointment_time}
                                        onChange={e => setFormData({...formData, appointment_time: e.target.value})}
                                        className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm font-bold focus:border-on-surface focus:ring-1 focus:ring-on-surface outline-none text-on-surface"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Lý do khám / Triệu chứng</label>
                                <input 
                                    type="text"
                                    placeholder="Khám định kỳ, Đau bụng..."
                                    value={formData.reason}
                                    onChange={e => setFormData({...formData, reason: e.target.value})}
                                    className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm font-bold focus:border-on-surface focus:ring-1 focus:ring-on-surface outline-none text-on-surface placeholder:text-on-surface-variant"
                                />
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Hủy</Button>
                                <Button type="submit">Tạo Lịch</Button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
