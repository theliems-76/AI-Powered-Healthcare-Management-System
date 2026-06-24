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
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 gap-4 border-b border-outline-variant">
                <div>
                    <h1 className="text-2xl font-semibold text-on-surface tracking-tight">Tổng Quan Hệ Thống</h1>
                    <p className="text-sm font-medium text-on-surface-variant mt-1">Chào mừng quay trở lại, {user?.full_name}</p>
                </div>
                {user?.role === 'PATIENT' && (
                    <Button onClick={() => navigate('/assessment')} className="flex items-center gap-2">
                        <Stethoscope size={16} /> Khám Mới
                    </Button>
                )}
            </div>

            {user?.role === 'DOCTOR' && (
                <div className="flex-1 bg-surface-container-lowest rounded shadow-sm border border-outline-variant overflow-hidden flex flex-col md:flex-row min-h-[75vh]">
                    
                    {/* Left Panel: Alerts & Schedule */}
                    <div className="w-full md:w-1/3 bg-surface-container-low p-6 md:p-8 border-r border-outline-variant flex flex-col shrink-0">
                        <div className="mb-8">
                            <h2 className="font-bold text-on-surface text-xl tracking-tight">Tình hình chung</h2>
                            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mt-1">Báo cáo thời gian thực</p>
                        </div>
                        
                        <div className="space-y-4">
                            {/* Architectural Metric 1 */}
                            <div className="bg-surface-container-lowest p-6 rounded border border-outline-variant shadow-sm hover:border-outline transition-colors cursor-pointer" onClick={() => navigate('/patients')}>
                                <div className="mb-4 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                    <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Tổng hồ sơ quản lý</h3>
                                </div>
                                <div className="flex items-end gap-2 border-l-2 border-primary pl-4">
                                    <p className="text-5xl font-bold text-on-surface tracking-tighter leading-none">{totalPatients}</p>
                                    <div className="flex flex-col pb-1">
                                        <span className="text-xs font-medium text-on-surface-variant">bệnh nhân</span>
                                        <span className="text-[10px] font-bold text-primary uppercase mt-0.5">TỔNG QUAN</span>
                                    </div>
                                </div>
                            </div>

                            {/* Architectural Metric 2 */}
                            <div className="bg-surface-container-lowest p-6 rounded border border-error-container shadow-sm hover:border-error transition-colors cursor-pointer" onClick={() => navigate('/patients')}>
                                <div className="mb-4 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-error animate-pulse"></div>
                                    <h3 className="text-xs font-semibold text-error uppercase tracking-wider">Rủi ro lâm sàng cao</h3>
                                </div>
                                <div className="flex items-end gap-2 border-l-2 border-error pl-4">
                                    <p className="text-5xl font-bold text-error tracking-tighter leading-none">{highRiskPatients}</p>
                                    <div className="flex flex-col pb-1">
                                        <span className="text-xs font-medium text-error">trường hợp</span>
                                        <span className="text-[10px] font-bold text-error uppercase mt-0.5">CẦN CHÚ Ý GẤP</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex-1 flex flex-col">
                            <div className="flex justify-between items-end mb-4">
                                <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Lịch hẹn hôm nay</h3>
                                <span className="text-xs font-bold text-on-surface">{todayAppointments.length} LỊCH</span>
                            </div>
                            {todayAppointments.length > 0 ? (
                                <div className="flex-1 flex flex-col space-y-2 overflow-y-auto custom-scrollbar pr-2 max-h-48">
                                    {todayAppointments.map(app => (
                                        <div key={app.id} className="bg-surface-container-lowest p-3 rounded border border-outline-variant shadow-sm flex justify-between items-center cursor-pointer hover:border-outline transition-colors" onClick={() => navigate('/appointments')}>
                                            <div>
                                                <p className="text-sm font-bold text-on-surface">{app.Patient?.User?.full_name}</p>
                                                <p className="text-xs font-medium text-on-surface-variant mt-0.5">{app.reason || 'Khám tổng quát'}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-sm font-bold text-on-surface">{app.appointment_time.slice(0, 5)}</span>
                                                <p className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${app.status === 'PENDING' ? 'text-tertiary' : app.status === 'CONFIRMED' ? 'text-primary' : 'text-on-surface-variant'}`}>
                                                    {app.status === 'PENDING' ? 'Chờ duyệt' : app.status === 'CONFIRMED' ? 'Đã xác nhận' : app.status === 'COMPLETED' ? 'Hoàn tất' : 'Đã hủy'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-transparent border border-dashed border-outline-variant rounded">
                                    <span className="text-3xl font-bold text-outline-variant mb-2">--</span>
                                    <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Lịch trình trống</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Recent Patient Activity */}
                    <div className="w-full md:w-2/3 p-6 md:p-8 flex flex-col bg-surface-container-lowest">
                        <div className="flex justify-between items-end mb-8 pb-4 border-b border-outline-variant">
                            <div>
                                <h2 className="font-bold text-on-surface text-xl tracking-tight">Cập nhật gần nhất</h2>
                                <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mt-1">Các bệnh nhân vừa có kết quả đánh giá mới</p>
                            </div>
                            <button onClick={() => navigate('/patients')} className="text-xs font-bold text-primary hover:text-primary-container uppercase tracking-wider transition-colors">
                                Xem toàn bộ danh sách
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                            {recentUpdates.length > 0 ? recentUpdates.map((p, i) => (
                                <div key={i} className="group relative pl-4 border-l-2 hover:border-primary border-outline-variant transition-colors cursor-pointer py-2" onClick={() => navigate('/history', { state: { patientId: p.id, patientName: p.full_name } })}>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="font-bold text-on-surface text-base tracking-tight group-hover:text-primary transition-colors">{p.full_name}</h4>
                                            <p className="text-sm font-medium text-on-surface-variant mt-1 line-clamp-1">{p.latest_diagnosis || 'Đã cập nhật hồ sơ y tế'}</p>
                                        </div>
                                        <div className="text-right flex flex-col items-end shrink-0 pl-4">
                                            <span className="text-xs font-semibold text-on-surface-variant tracking-wider">{p.last_visit}</span>
                                            <span className={`mt-2 text-[10px] font-bold uppercase tracking-wider ${p.latest_risk_score > 66 ? 'text-error' : p.latest_risk_score > 33 ? 'text-tertiary' : 'text-primary'}`}>
                                                RỦI RO: {Math.round(p.latest_risk_score)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-8 text-on-surface-variant text-sm font-semibold uppercase tracking-wider">
                                    Chưa có cập nhật nào từ bệnh nhân
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            )}

            {user?.role === 'PATIENT' && !latestRecord && (
                <div className="bg-surface-container-lowest border border-outline-variant rounded p-8 md:p-14 shadow-sm overflow-hidden relative">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        {/* Left Side: Call to Action */}
                        <div className="flex flex-col items-start text-left">
                            <h2 className="text-4xl md:text-5xl font-bold text-on-surface tracking-tight leading-tight mb-6">
                                Bắt đầu hành trình <br/> sức khỏe của bạn
                            </h2>
                            <p className="text-base text-on-surface-variant font-normal leading-relaxed mb-10 max-w-lg">
                                Để hệ thống có thể cung cấp lộ trình điều trị chuẩn xác, chúng tôi cần thu thập các chỉ số lâm sàng hiện tại của bạn. Toàn bộ dữ liệu được phân tích bởi <strong className="text-on-surface">hệ thống y khoa thông minh</strong> và được giám sát chặt chẽ bởi bác sĩ chuyên khoa.
                            </p>
                            <Button onClick={() => navigate('/assessment')} size="lg">
                                Bắt Đầu Khảo Sát Y Khoa &rarr;
                            </Button>
                        </div>
                        
                        {/* Right Side: How it works (Typography focus) */}
                        <div className="flex flex-col space-y-10 pl-6 lg:pl-10">
                            <div className="relative pl-8 border-l border-outline-variant">
                                <span className="absolute -left-10 top-[-1rem] text-[4rem] font-bold text-surface-container-high select-none -z-10 leading-none">01</span>
                                <h3 className="text-base font-bold text-on-surface mb-2 uppercase tracking-wide">Khảo sát Lâm sàng</h3>
                                <p className="text-sm text-on-surface-variant font-normal leading-relaxed">Cung cấp 21 chỉ số cơ bản về sinh trắc học, bệnh lý nền và thói quen sinh hoạt hàng ngày.</p>
                            </div>
                            
                            <div className="relative pl-8 border-l border-outline-variant">
                                <span className="absolute -left-10 top-[-1rem] text-[4rem] font-bold text-surface-container-high select-none -z-10 leading-none">02</span>
                                <h3 className="text-base font-bold text-on-surface mb-2 uppercase tracking-wide">Phân tích chuyên sâu</h3>
                                <p className="text-sm text-on-surface-variant font-normal leading-relaxed">Hệ thống thiết lập ma trận rủi ro y khoa và đưa ra đánh giá dựa trên cơ sở dữ liệu y tế.</p>
                            </div>
                            
                            <div className="relative pl-8 border-l border-outline-variant">
                                <span className="absolute -left-10 top-[-1rem] text-[4rem] font-bold text-surface-container-high select-none -z-10 leading-none">03</span>
                                <h3 className="text-base font-bold text-on-surface mb-2 uppercase tracking-wide">Phác đồ Cá nhân hóa</h3>
                                <p className="text-sm text-on-surface-variant font-normal leading-relaxed">Nhận lộ trình can thiệp dinh dưỡng, tập luyện chuyên sâu từ bác sĩ chuyên khoa.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {user?.role === 'PATIENT' && latestRecord && (
                <div className="flex flex-col gap-6">
                    {/* Section 1: Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Risk Card */}
                        <div className="bg-surface-container-lowest rounded p-6 md:p-8 border border-outline-variant shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1 flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${latestRecord.risk_score <= 33 ? 'bg-primary' : latestRecord.risk_score <= 66 ? 'bg-tertiary' : 'bg-error'}`}></span> Tiên lượng rủi ro
                                </p>
                                <div className="flex items-baseline gap-2 mt-2">
                                    <h2 className={`text-4xl md:text-5xl font-bold tracking-tighter ${latestRecord.risk_score <= 33 ? 'text-primary' : latestRecord.risk_score <= 66 ? 'text-tertiary' : 'text-error'}`}>
                                        {latestRecord.risk_score}
                                    </h2>
                                    <span className="text-xl font-semibold text-on-surface-variant">%</span>
                                </div>
                            </div>
                            <div className={`px-4 py-2 rounded border text-xs font-bold uppercase tracking-wider ${latestRecord.risk_score <= 33 ? 'bg-surface-container text-primary border-primary' : latestRecord.risk_score <= 66 ? 'bg-surface-container text-tertiary border-tertiary' : 'bg-error-container text-error border-error'}`}>
                                {latestRecord.risk_score <= 33 ? 'Nguy cơ thấp' : latestRecord.risk_score <= 66 ? 'Nguy cơ trung bình' : 'Nguy cơ cao'}
                            </div>
                        </div>

                        {/* BMI Card */}
                        <div className="bg-surface-container-lowest rounded p-6 md:p-8 border border-outline-variant shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                                    Chỉ số khối cơ thể (BMI)
                                </p>
                                <div className="flex items-baseline gap-2 mt-2">
                                    <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-on-surface">{latestRecord.bmi}</h2>
                                    <span className="text-xl font-semibold text-on-surface-variant">kg/m²</span>
                                </div>
                            </div>
                            <div className="px-4 py-2 rounded border bg-surface-container-low border-outline-variant text-on-surface-variant text-xs font-bold uppercase tracking-wider">
                                Thông số gốc
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Clinical Summary (Rebranded AI) */}
                    <div className="bg-surface-container-lowest rounded border border-outline-variant shadow-sm flex flex-col overflow-hidden">
                        <div className="bg-surface-container-low border-b border-outline-variant px-6 md:px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h3 className="font-bold text-on-surface uppercase tracking-wide text-base">
                                    Báo cáo Tổng hợp Y khoa
                                </h3>
                                <p className="text-xs font-medium text-on-surface-variant mt-1">Đánh giá chuyên sâu bởi hệ thống y khoa thông minh</p>
                            </div>
                            <Button variant="secondary" onClick={() => navigate(`/history/${latestRecord?.id}`)} className="shrink-0 text-xs">
                                Xem Phác đồ Chi tiết &rarr;
                            </Button>
                        </div>
                        <div className="p-6 md:p-8 bg-surface-container-lowest">
                            <div className="text-sm text-on-surface font-normal leading-loose max-w-4xl whitespace-pre-line">
                                {stripMarkdown(latestRecord?.ai_nutrition_plan || "Hồ sơ y tế hiện chưa có kết luận đánh giá chuyên sâu. Vui lòng thực hiện thêm các khảo sát hoặc cập nhật thông số lâm sàng.")}
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Trend Chart */}
                    <div className="bg-surface-container-lowest rounded p-6 md:p-8 border border-outline-variant shadow-sm flex flex-col">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-sm font-bold text-on-surface uppercase tracking-wide">
                                Phân tích Xu hướng Rủi ro
                            </h3>
                        </div>
                        {historyData.length >= 2 ? (
                            <div className="h-72 w-full">
                                <MiniRiskChart data={historyData} className="h-full w-full" />
                            </div>
                        ) : (
                            <div className="h-48 flex flex-col items-center justify-center text-on-surface-variant text-sm font-medium border border-dashed border-outline-variant rounded bg-surface-container-low">
                                <Activity className="w-8 h-8 text-outline mb-3" />
                                <span>Cần tối thiểu 2 lần kiểm tra để theo dõi diễn tiến sức khỏe</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {user?.role === 'ADMIN' && adminStats && (
                <div className="space-y-8">
                    <AdminStats stats={adminStats} />
                    <AdminOverviewTab stats={adminStats} />
                </div>
            )}
        </div>
    );
}