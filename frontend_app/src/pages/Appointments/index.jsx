import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, Clock, User, CheckCircle, XCircle, FileText, ChevronRight, Search } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';

export default function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
    const [patients, setPatients] = useState([]);
    const [patientSearch, setPatientSearch] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        patient_profile_id: '',
        appointment_date: new Date().toISOString().split('T')[0],
        appointment_time: '09:00',
        reason: ''
    });

    useEffect(() => {
        fetchAppointments();
        fetchPatients();
    }, [filterDate]);

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
        try {
            const res = await api.post('/appointments', formData);
            if (res.data.status === 'success') {
                toast.success("Đã tạo lịch hẹn mới!");
                setIsModalOpen(false);
                fetchAppointments();
            }
        } catch (error) {
            toast.error("Lỗi khi tạo lịch hẹn");
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
            case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'CONFIRMED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'CANCELLED': return 'bg-rose-100 text-rose-700 border-rose-200';
            case 'COMPLETED': return 'bg-slate-100 text-slate-700 border-slate-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="pb-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 shrink-0">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Quản Lý Lịch Hẹn</h1>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Sắp xếp thời gian thăm khám bệnh nhân</p>
                </div>
                <div className="flex gap-3">
                    <input 
                        type="date" 
                        value={filterDate} 
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="px-4 py-3 text-sm font-bold bg-white border border-slate-200 rounded-xl focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none"
                    />
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-widest text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center gap-2"
                    >
                        <Calendar className="w-4 h-4" />
                        Tạo Lịch Khám
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest">Danh sách ngày {new Date(filterDate).toLocaleDateString('vi-VN')}</h2>
                </div>
                
                {isLoading ? (
                    <div className="p-12 text-center text-slate-500"><div className="animate-spin w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full mx-auto"></div></div>
                ) : appointments.length === 0 ? (
                    <div className="p-16 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg mb-1">Không có lịch hẹn</h3>
                        <p className="text-sm font-medium text-slate-500">Ngày này chưa có bệnh nhân nào đặt lịch.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {appointments.map(app => (
                            <div key={app.id} className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center hover:bg-slate-50/50 transition-colors">
                                <div className="flex-shrink-0 w-24">
                                    <div className="text-2xl font-black text-slate-900 tracking-tight">{app.appointment_time.slice(0, 5)}</div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                                        <User className="w-4 h-4 text-slate-400" />
                                        {app.Patient?.User?.full_name}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                                        <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> {app.reason || 'Khám tổng quát'}</span>
                                        <span className={`px-2.5 py-0.5 rounded border text-[10px] uppercase font-bold tracking-widest ${getStatusStyle(app.status)}`}>
                                            {app.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {app.status === 'PENDING' && (
                                        <>
                                            <button onClick={() => handleStatusChange(app.id, 'CONFIRMED')} className="p-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-colors" title="Xác nhận">
                                                <CheckCircle className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => handleStatusChange(app.id, 'CANCELLED')} className="p-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition-colors" title="Hủy">
                                                <XCircle className="w-5 h-5" />
                                            </button>
                                        </>
                                    )}
                                    {app.status === 'CONFIRMED' && (
                                        <button onClick={() => handleStatusChange(app.id, 'COMPLETED')} className="px-4 py-2.5 bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold uppercase tracking-widest rounded-xl transition-colors">
                                            Hoàn tất
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal Tạo lịch */}
            {isModalOpen && createPortal(
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-lg font-black text-slate-900 uppercase tracking-wide">Thêm Lịch Khám</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900"><XCircle className="w-6 h-6" /></button>
                        </div>
                        <form onSubmit={handleCreateAppointment} className="p-6 space-y-6">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Bệnh nhân</label>
                                <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:border-slate-900 focus-within:ring-1 focus-within:ring-slate-900 transition-all">
                                    <div className="flex items-center px-4 py-2 bg-white border-b border-slate-100">
                                        <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                                        <input 
                                            type="text" 
                                            placeholder="Tìm tên hoặc số điện thoại..."
                                            value={patientSearch}
                                            onChange={e => setPatientSearch(e.target.value)}
                                            className="w-full bg-transparent text-sm font-bold outline-none placeholder:font-medium placeholder:text-slate-400"
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
                                        className="w-full px-2 py-2 bg-slate-50 text-sm font-bold outline-none custom-scrollbar cursor-pointer"
                                    >
                                        {patients.filter(p => 
                                            (p.full_name || '').toLowerCase().includes(patientSearch.toLowerCase()) || 
                                            (p.phone || '').includes(patientSearch)
                                        ).map(p => (
                                            <option key={p.id} value={p.id} className="py-2.5 px-3 rounded-lg hover:bg-white mb-1">{p.full_name} {p.phone ? `- ${p.phone}` : ''}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Ngày khám</label>
                                    <input 
                                        type="date" required
                                        value={formData.appointment_date}
                                        onChange={e => setFormData({...formData, appointment_date: e.target.value})}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Giờ khám</label>
                                    <input 
                                        type="time" required
                                        value={formData.appointment_time}
                                        onChange={e => setFormData({...formData, appointment_time: e.target.value})}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Lý do khám / Triệu chứng</label>
                                <input 
                                    type="text"
                                    placeholder="Khám định kỳ, Đau bụng..."
                                    value={formData.reason}
                                    onChange={e => setFormData({...formData, reason: e.target.value})}
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none"
                                />
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-bold text-slate-500 bg-slate-50 rounded-xl hover:bg-slate-100 text-xs uppercase tracking-widest">Hủy</button>
                                <button type="submit" className="px-6 py-3 font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 shadow-xl shadow-slate-900/10 text-xs uppercase tracking-widest">Tạo Lịch</button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
