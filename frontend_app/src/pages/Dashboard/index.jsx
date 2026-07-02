import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Gauge, Stethoscope, Lightbulb, TrendingUp, Users, FileText } from 'lucide-react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import StatsCard from './components/StatsCard';
import MiniRiskChart from './components/MiniRiskChart';
import AdminOverviewTab from '../Admin/components/AdminOverviewTab';
import AdminStats from '../Admin/components/AdminStats';
import Button from '../../components/ui/Button';

export default function Dashboard() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [latestRecord, setLatestRecord] = useState(null);
    const [historyData, setHistoryData] = useState([]);
    const [adminStats, setAdminStats] = useState(null);
    const [todayAppointments, setTodayAppointments] = useState([]);
    const [recentUpdates, setRecentUpdates] = useState([]);
    const [totalPatients, setTotalPatients] = useState(0);
    const [highRiskPatients, setHighRiskPatients] = useState(0);

    // Helper to strip markdown for excerpts
    const stripMarkdown = (text) => {
        if (!text) return "";
        return text.replace(/[#*`_]/g, '').trim();
    };

    useEffect(() => {
        if (user?.role === 'PATIENT') {
            const fetchData = async () => {
                try {
                    const res = await api.get('/records/history');
                    if (res.data.data?.length > 0) {
                        const data = res.data.data;
                        setHistoryData(data);
                        setLatestRecord(data[data.length - 1]);
                    }
                } catch (e) { console.error(e); }
            };
            fetchData();
        } else if (user?.role === 'ADMIN') {
            const fetchAdminStats = async () => {
                try {
                    const res = await api.get('/admin/stats');
                    setAdminStats(res.data.data);
                } catch (e) { console.error(e); }
            };
            fetchAdminStats();
        } else if (user?.role === 'DOCTOR') {
            const fetchDoctorStats = async () => {
                try {
                    const today = new Date();
                    const year = today.getFullYear();
                    const month = String(today.getMonth() + 1).padStart(2, '0');
                    const day = String(today.getDate()).padStart(2, '0');
                    const dateStr = `${year}-${month}-${day}`;
                    
                    const res = await api.get(`/appointments?date=${dateStr}`);
                    if (res.data.status === 'success') {
                        setTodayAppointments(res.data.data);
                    }
                    
                    const resPatients = await api.get('/users/patients?limit=1000');
                    if (resPatients.data.status === 'success') {
                        const allPatients = resPatients.data.data;
                        setTotalPatients(resPatients.data.pagination.total);
                        setHighRiskPatients(allPatients.filter(p => p.latest_risk_score > 66).length);
                        setRecentUpdates(allPatients.filter(p => p.latest_risk_score !== null).slice(0, 10));
                    }
                } catch (e) { console.error(e); }
            };
            fetchDoctorStats();
        }
    }, [user?.role]);

    return (
        <div className="max-w-7xl mx-auto p-4 space-y-6 animate-in fade-in duration-500 pb-12">
            
            {/* Header: Common to all roles */}
            <header className="mb-8 border-b border-outline-variant pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-on-surface mb-1 tracking-tight">
                        {user?.role === 'PATIENT' ? 'Tổng Quan Sức Khỏe' : user?.role === 'DOCTOR' ? 'Bảng Điều Khiển Y Khoa' : 'Hệ Thống Quản Trị'}
                    </h1>
                    <p className="text-sm text-secondary font-medium">
                        {user?.role === 'PATIENT' ? 'Báo cáo lâm sàng cho' : 'Chào mừng,'} <span className="font-semibold text-primary">{user?.full_name}</span>
                    </p>
                </div>
                {user?.role === 'PATIENT' && (
                    <Button onClick={() => navigate('/assessment')} className="flex items-center gap-2">
                        <Stethoscope size={16} /> Khám Mới
                    </Button>
                )}
            </header>

            {/* DOCTOR VIEW */}
            {user?.role === 'DOCTOR' && (
                <div className="flex flex-col gap-6">
                    {/* Urgent Alerts Section equivalent */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* High Risk Alerts */}
                        <div className="bg-surface border border-outline-variant rounded-lg p-4 border-l-4 border-l-error relative overflow-hidden group hover:shadow-sm transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold text-error uppercase tracking-wider">Bệnh nhân Rủi ro cao</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-1">{highRiskPatients} <span className="text-sm font-normal text-secondary">trường hợp</span></h3>
                            <div className="bg-error-container text-on-error-container p-2 rounded border border-error/20 flex items-center justify-between mt-4">
                                <span className="text-sm font-medium">Cần chú ý theo dõi</span>
                            </div>
                        </div>
                        {/* Total Patients */}
                        <div className="bg-surface border border-outline-variant rounded-lg p-4 border-l-4 border-l-primary relative overflow-hidden group hover:shadow-sm transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <span class="text-xs font-bold text-primary uppercase tracking-wider">Tổng Hồ sơ Quản lý</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-1">{totalPatients} <span className="text-sm font-normal text-secondary">bệnh nhân</span></h3>
                            <div className="bg-primary-container text-on-primary-container p-2 rounded border border-primary/20 flex items-center justify-between mt-4">
                                <span className="text-sm font-medium">Hồ sơ lâm sàng đang theo dõi</span>
                            </div>
                        </div>
                    </section>

                    {/* Main Grid: Queue & Schedule */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Recent Activity (Left Column) */}
                        <div className="col-span-1 lg:col-span-8 bg-surface border border-outline-variant rounded-lg overflow-hidden flex flex-col max-h-[600px] shadow-sm">
                            <div className="px-4 py-3 bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-bold uppercase text-secondary tracking-wider">Cập nhật gần nhất</h3>
                                </div>
                            </div>
                            <div className="flex-1 overflow-auto bg-surface-container-lowest">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-surface-container-low/50 sticky top-0 z-10">
                                        <tr>
                                            <th className="px-4 py-3 text-xs font-bold text-secondary uppercase tracking-wider border-b border-outline-variant">Bệnh nhân</th>
                                            <th className="px-4 py-3 text-xs font-bold text-secondary uppercase tracking-wider border-b border-outline-variant">Chỉ số rủi ro</th>
                                            <th className="px-4 py-3 text-xs font-bold text-secondary uppercase tracking-wider border-b border-outline-variant">Ngày khám</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-outline-variant bg-surface-container-lowest">
                                        {recentUpdates.length > 0 ? recentUpdates.map((p, i) => (
                                            <tr key={i} className="hover:bg-surface-container-low transition-colors cursor-pointer" onClick={() => navigate('/history', { state: { patientId: p.id, patientName: p.full_name } })}>
                                                <td className="px-4 py-3">
                                                    <p className="text-sm font-bold text-primary">{p.full_name}</p>
                                                    <p className="text-xs text-secondary mt-0.5 line-clamp-1">{p.latest_diagnosis || 'Cập nhật hồ sơ'}</p>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${p.latest_risk_score > 66 ? 'bg-error text-on-error' : p.latest_risk_score > 33 ? 'bg-[#ffdbd0] text-[#9b2d00]' : 'bg-[#dce1ff] text-[#003baf]'}`}>
                                                        {Math.round(p.latest_risk_score)}%
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-secondary font-mono">{p.last_visit}</td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="3" className="px-4 py-8 text-center text-secondary text-sm">Chưa có cập nhật nào.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Today's Appointments (Right Column) */}
                        <div className="col-span-1 lg:col-span-4 bg-surface border border-outline-variant rounded-lg overflow-hidden flex flex-col max-h-[600px] shadow-sm">
                            <div className="px-4 py-3 bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-bold uppercase text-secondary tracking-wider">Lịch hẹn hôm nay</h3>
                                </div>
                                <span className="text-xs font-bold text-on-surface bg-surface-container-highest px-2 py-1 rounded">{todayAppointments.length}</span>
                            </div>
                            <div className="flex-1 overflow-auto p-4 space-y-4 bg-surface-container-lowest">
                                {todayAppointments.length > 0 ? todayAppointments.map(app => (
                                    <div key={app.id} className="relative pl-4 border-l-2 border-primary group cursor-pointer" onClick={() => navigate('/appointments')}>
                                        <span className="absolute -left-[9px] top-0 w-4 h-4 bg-primary border-2 border-on-primary rounded-full group-hover:scale-110 transition-transform"></span>
                                        <p className="text-xs font-mono font-bold text-primary mb-1">{app.appointment_time.slice(0, 5)}</p>
                                        <div className="bg-surface-container-low p-3 rounded border border-outline-variant hover:border-primary transition-colors">
                                            <p className="text-sm font-bold text-on-surface">{app.Patient?.User?.full_name}</p>
                                            <p className="text-xs text-secondary mt-1">{app.reason || 'Khám tổng quát'}</p>
                                            <p className={`text-[10px] font-bold uppercase mt-2 ${app.status === 'PENDING' ? 'text-tertiary' : 'text-primary'}`}>
                                                {app.status}
                                            </p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="h-full flex flex-col items-center justify-center text-secondary text-sm">
                                        Không có lịch hẹn hôm nay
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* PATIENT VIEW (No Records) */}
            {user?.role === 'PATIENT' && !latestRecord && (
                <div className="bg-surface border border-outline-variant rounded-lg p-8 md:p-12 text-center">
                    <h2 className="text-3xl font-bold mb-4 tracking-tight">Chào mừng bạn đến với MediLink Pro</h2>
                    <p className="text-secondary max-w-xl mx-auto mb-8">Bạn chưa có hồ sơ y tế nào. Hãy bắt đầu bằng cách thực hiện bài đánh giá lâm sàng đầu tiên để hệ thống AI có thể lập phác đồ cho bạn.</p>
                    <Button onClick={() => navigate('/assessment')} size="lg">Bắt Đầu Đánh Giá</Button>
                </div>
            )}

            {/* PATIENT VIEW (With Records) */}
            {user?.role === 'PATIENT' && latestRecord && (
                <div className="flex flex-col gap-6">
                    {/* Health Summary Grid (Stitch Layout) */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Risk Score */}
                        <div className={`bg-surface border border-outline-variant p-6 rounded-lg ${latestRecord.risk_score <= 33 ? 'border-l-4 border-l-[#004ac6]' : latestRecord.risk_score <= 66 ? 'border-l-4 border-l-[#9b2d00]' : 'border-l-4 border-l-[#ba1a1a]'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Chỉ số rủi ro</h3>
                                    <p className="text-4xl font-bold mt-2">{latestRecord.risk_score}<span className="text-lg font-normal text-secondary">%</span></p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <span className={`px-2 py-0.5 rounded text-xs uppercase tracking-wider ${latestRecord.risk_score <= 33 ? 'bg-[#dce1ff] text-[#003baf]' : latestRecord.risk_score <= 66 ? 'bg-[#ffdbd0] text-[#9b2d00]' : 'bg-error text-on-error'}`}>
                                    {latestRecord.risk_score <= 33 ? 'Thấp' : latestRecord.risk_score <= 66 ? 'Trung bình' : 'Cao'}
                                </span>
                            </div>
                        </div>

                        {/* BMI */}
                        <div className="bg-surface border border-outline-variant p-6 rounded-lg border-l-4 border-l-primary">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Chỉ số BMI</h3>
                                    <p className="text-4xl font-bold mt-2">{latestRecord.bmi}<span className="text-lg font-normal text-secondary"> kg/m²</span></p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-medium text-secondary">
                                <span className="text-xs uppercase tracking-wider">Thông số gốc</span>
                            </div>
                        </div>

                        {/* Trend Chart Area */}
                        <div className="bg-surface border border-outline-variant p-4 rounded-lg flex flex-col justify-center border-l-4 border-l-primary">
                            <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Biểu đồ Xu hướng</h3>
                            <div className="h-24 w-full">
                                {historyData.length >= 2 ? (
                                    <MiniRiskChart data={historyData} className="h-full w-full" />
                                ) : (
                                    <p className="text-xs text-secondary text-center mt-6">Cần 2 lần kiểm tra để vẽ biểu đồ.</p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* AI Clinical Summary */}
                    <section className="bg-surface border border-outline-variant rounded-lg overflow-hidden flex flex-col h-full">
                        <div className="px-6 py-4 bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
                            <h2 className="text-lg font-bold text-on-surface">Phác đồ Cá nhân hóa (AI)</h2>
                            <Button variant="secondary" onClick={() => navigate(`/history/${latestRecord?.id}`)} className="text-xs px-3 py-1">Chi tiết</Button>
                        </div>
                        <div className="p-6 bg-surface-container-lowest">
                            <p className="text-sm text-on-surface leading-relaxed whitespace-pre-line max-w-4xl">
                                {stripMarkdown(latestRecord?.ai_nutrition_plan || "Đang xử lý phân tích chuyên sâu...")}
                            </p>
                        </div>
                    </section>
                </div>
            )}

            {/* ADMIN VIEW */}
            {user?.role === 'ADMIN' && adminStats && (
                <div className="space-y-6">
                    <AdminStats stats={adminStats} />
                    <AdminOverviewTab stats={adminStats} />
                </div>
            )}
        </div>
    );
}