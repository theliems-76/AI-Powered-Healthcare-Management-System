import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Gauge, Stethoscope, Lightbulb, TrendingUp, Users, FileText } from 'lucide-react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import StatsCard from './components/StatsCard';
import MiniRiskChart from './components/MiniRiskChart';
import AdminOverviewTab from '../Admin/components/AdminOverviewTab';
import AdminStats from '../Admin/components/AdminStats';

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
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 gap-4 border-b border-slate-100">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Tổng Quan Hệ Thống</h1>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Chào mừng quay trở lại, {user?.full_name}</p>
                </div>
                {user?.role === 'PATIENT' && (
                    <button onClick={() => navigate('/assessment')} className="flex items-center gap-2 px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-white bg-slate-900 rounded-xl hover:bg-slate-800 shadow-lg shadow-slate-900/10 transition-all active:scale-95">
                        <Stethoscope size={16} /> Khám Mới
                    </button>
                )}
            </div>

            {user?.role === 'DOCTOR' && (
                <div className="flex-1 bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row min-h-[75vh]">
                    
                    {/* Left Panel: Alerts & Schedule */}
                    <div className="w-full md:w-1/3 bg-slate-50/50 p-6 md:p-8 border-r border-slate-100 flex flex-col shrink-0">
                        <div className="mb-8">
                            <h2 className="font-black text-slate-900 text-xl tracking-tight">Tình hình chung</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Báo cáo thời gian thực</p>
                        </div>
                        
                        <div className="space-y-4">
                            {/* Architectural Metric 1 */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors cursor-pointer" onClick={() => navigate('/patients')}>
                                <div className="mb-4 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
                                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tổng hồ sơ quản lý</h3>
                                </div>
                                <div className="flex items-end gap-2 border-l-2 border-slate-900 pl-4">
                                    <p className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{totalPatients}</p>
                                    <div className="flex flex-col pb-1">
                                        <span className="text-xs font-bold text-slate-400">bệnh nhân</span>
                                        <span className="text-[9px] font-black text-emerald-500 uppercase mt-0.5">TỔNG QUAN</span>
                                    </div>
                                </div>
                            </div>

                            {/* Architectural Metric 2 */}
                            <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-sm hover:border-rose-200 transition-colors cursor-pointer" onClick={() => navigate('/patients')}>
                                <div className="mb-4 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
                                    <h3 className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Rủi ro lâm sàng cao</h3>
                                </div>
                                <div className="flex items-end gap-2 border-l-2 border-rose-500 pl-4">
                                    <p className="text-5xl font-black text-rose-600 tracking-tighter leading-none">{highRiskPatients}</p>
                                    <div className="flex flex-col pb-1">
                                        <span className="text-xs font-bold text-rose-400">trường hợp</span>
                                        <span className="text-[9px] font-black text-rose-500 uppercase mt-0.5">CẦN CHÚ Ý GẤP</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex-1 flex flex-col">
                            <div className="flex justify-between items-end mb-4">
                                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Lịch hẹn hôm nay</h3>
                                <span className="text-[10px] font-black text-slate-900">{todayAppointments.length} LỊCH</span>
                            </div>
                            {todayAppointments.length > 0 ? (
                                <div className="flex-1 flex flex-col space-y-2 overflow-y-auto custom-scrollbar pr-2 max-h-48">
                                    {todayAppointments.map(app => (
                                        <div key={app.id} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center cursor-pointer hover:border-slate-300 transition-colors" onClick={() => navigate('/appointments')}>
                                            <div>
                                                <p className="text-sm font-black text-slate-900">{app.Patient?.User?.full_name}</p>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{app.reason || 'Khám tổng quát'}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-sm font-black text-slate-900">{app.appointment_time.slice(0, 5)}</span>
                                                <p className={`text-[9px] font-black uppercase tracking-widest mt-0.5 ${app.status === 'PENDING' ? 'text-amber-500' : app.status === 'CONFIRMED' ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                    {app.status === 'PENDING' ? 'Chờ duyệt' : app.status === 'CONFIRMED' ? 'Đã xác nhận' : app.status === 'COMPLETED' ? 'Hoàn tất' : 'Đã hủy'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-transparent border border-dashed border-slate-300 rounded-2xl">
                                    <span className="text-3xl font-black text-slate-200 mb-2">--</span>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Lịch trình trống</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Recent Patient Activity */}
                    <div className="w-full md:w-2/3 p-6 md:p-8 flex flex-col bg-white">
                        <div className="flex justify-between items-end mb-8 pb-4 border-b border-slate-100">
                            <div>
                                <h2 className="font-black text-slate-900 text-xl tracking-tight">Cập nhật gần nhất</h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Các bệnh nhân vừa có kết quả đánh giá AI</p>
                            </div>
                            <button onClick={() => navigate('/patients')} className="text-[10px] font-bold text-slate-900 uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
                                Xem toàn bộ danh sách
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                            {recentUpdates.length > 0 ? recentUpdates.map((p, i) => (
                                <div key={i} className="group relative pl-4 border-l-2 hover:border-slate-800 border-slate-100 transition-colors cursor-pointer py-2" onClick={() => navigate('/history', { state: { patientId: p.id, patientName: p.full_name } })}>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="font-black text-slate-900 text-base tracking-tight group-hover:text-slate-600 transition-colors">{p.full_name}</h4>
                                            <p className="text-xs font-medium text-slate-500 mt-1 line-clamp-1">{p.latest_diagnosis || 'Đã cập nhật hồ sơ y tế'}</p>
                                        </div>
                                        <div className="text-right flex flex-col items-end shrink-0 pl-4">
                                            <span className="text-[10px] font-bold text-slate-400 tracking-widest">{p.last_visit}</span>
                                            <span className={`mt-2 text-[10px] font-black uppercase tracking-widest ${p.latest_risk_score > 66 ? 'text-rose-600' : p.latest_risk_score > 33 ? 'text-amber-500' : 'text-emerald-500'}`}>
                                                RỦI RO: {Math.round(p.latest_risk_score)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-8 text-slate-400 text-xs font-bold uppercase tracking-widest">
                                    Chưa có cập nhật nào từ bệnh nhân
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            )}

            {user?.role === 'PATIENT' && !latestRecord && (
                <div className="bg-white border border-slate-200 rounded-[2rem] p-8 md:p-14 shadow-sm overflow-hidden relative">
                    {/* Subtle medical cross or grid background could go here, but keeping it white for minimalism */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        {/* Left Side: Call to Action */}
                        <div className="flex flex-col items-start text-left">
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight mb-6">
                                Bắt đầu hành trình <br/> sức khỏe của bạn
                            </h2>
                            <p className="text-[13px] text-slate-600 font-medium leading-relaxed mb-10 max-w-lg">
                                Để hệ thống có thể cung cấp lộ trình điều trị chuẩn xác, chúng tôi cần thu thập các chỉ số lâm sàng hiện tại của bạn. Toàn bộ dữ liệu được phân tích bởi hệ thống <strong className="text-slate-900">Trí tuệ Nhân tạo XAI</strong> và được giám sát chặt chẽ bởi Bác sĩ chuyên khoa.
                            </p>
                            <button onClick={() => navigate('/assessment')} className="px-8 py-4 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-900/10 flex items-center gap-3">
                                Bắt Đầu Khảo Sát Y Khoa &rarr;
                            </button>
                        </div>
                        
                        {/* Right Side: How it works (Typography focus) */}
                        <div className="flex flex-col space-y-10 pl-6 lg:pl-10">
                            <div className="relative pl-8 border-l border-slate-200">
                                <span className="absolute -left-12 top-[-1.5rem] text-[5rem] font-black text-slate-100 select-none -z-10 leading-none">01</span>
                                <h3 className="text-sm font-black text-slate-900 mb-2 uppercase tracking-widest">Khảo sát Lâm sàng</h3>
                                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Cung cấp 21 chỉ số cơ bản về sinh trắc học, bệnh lý nền và thói quen sinh hoạt hàng ngày.</p>
                            </div>
                            
                            <div className="relative pl-8 border-l border-slate-200">
                                <span className="absolute -left-12 top-[-1.5rem] text-[5rem] font-black text-slate-100 select-none -z-10 leading-none">02</span>
                                <h3 className="text-sm font-black text-slate-900 mb-2 uppercase tracking-widest">Phân tích Rủi ro XAI</h3>
                                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Hệ thống AI sẽ thiết lập Ma trận Tiên lượng Rủi ro và phân tích minh bạch từng yếu tố ảnh hưởng.</p>
                            </div>
                            
                            <div className="relative pl-8 border-l border-slate-200">
                                <span className="absolute -left-12 top-[-1.5rem] text-[5rem] font-black text-slate-100 select-none -z-10 leading-none">03</span>
                                <h3 className="text-sm font-black text-slate-900 mb-2 uppercase tracking-widest">Phác đồ Cá nhân hóa</h3>
                                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Nhận lộ trình can thiệp dinh dưỡng, tập luyện chuyên sâu và kết nối trực tiếp với bác sĩ chuyên khoa.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {}
            {user?.role === 'PATIENT' && latestRecord && (
                <div className="flex flex-col gap-6">
                    {/* Section 1: Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Risk Card */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                                    <span className={`w-1.5 h-1.5 rounded-full ${latestRecord.risk_score <= 33 ? 'bg-emerald-500' : latestRecord.risk_score <= 66 ? 'bg-amber-500' : 'bg-rose-500'}`}></span> Tiên lượng rủi ro
                                </p>
                                <div className="flex items-baseline gap-2 mt-2">
                                    <h2 className={`text-4xl md:text-5xl font-black tracking-tighter ${latestRecord.risk_score <= 33 ? 'text-emerald-600' : latestRecord.risk_score <= 66 ? 'text-amber-600' : 'text-rose-600'}`}>
                                        {latestRecord.risk_score}
                                    </h2>
                                    <span className="text-xl font-bold text-slate-400">%</span>
                                </div>
                            </div>
                            <div className={`px-4 py-2 rounded-lg border text-xs font-bold uppercase tracking-widest ${latestRecord.risk_score <= 33 ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : latestRecord.risk_score <= 66 ? 'bg-amber-50 border-amber-100 text-amber-700' : 'bg-rose-50 border-rose-100 text-rose-700'}`}>
                                {latestRecord.risk_score <= 33 ? 'Nguy cơ thấp' : latestRecord.risk_score <= 66 ? 'Nguy cơ trung bình' : 'Nguy cơ cao'}
                            </div>
                        </div>

                        {/* BMI Card */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                                    Chỉ số khối cơ thể (BMI)
                                </p>
                                <div className="flex items-baseline gap-2 mt-2">
                                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-800">{latestRecord.bmi}</h2>
                                    <span className="text-xl font-bold text-slate-400">kg/m²</span>
                                </div>
                            </div>
                            <div className="px-4 py-2 rounded-lg border bg-slate-50 border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-widest">
                                Thông số gốc
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Clinical Summary (Rebranded AI) */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                        <div className="bg-slate-50 border-b border-slate-200 px-6 md:px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm">
                                    Báo cáo Tổng hợp Y khoa
                                </h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Đánh giá chuyên sâu bởi hệ thống phân tích</p>
                            </div>
                            <button onClick={() => navigate(`/history/${latestRecord?.id}`)} className="text-[11px] font-bold uppercase tracking-widest text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors shrink-0">
                                Xem Phác đồ Chi tiết &rarr;
                            </button>
                        </div>
                        <div className="p-6 md:p-8 bg-white">
                            <div className="text-[13px] text-slate-700 font-medium leading-loose max-w-4xl whitespace-pre-line">
                                {stripMarkdown(latestRecord?.ai_nutrition_plan || "Hồ sơ y tế hiện chưa có kết luận đánh giá chuyên sâu. Vui lòng thực hiện thêm các khảo sát hoặc cập nhật thông số lâm sàng.")}
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Trend Chart */}
                    <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                                Phân tích Xu hướng Rủi ro
                            </h3>
                        </div>
                        {historyData.length >= 2 ? (
                            <div className="h-72 w-full">
                                <MiniRiskChart data={historyData} className="h-full w-full" />
                            </div>
                        ) : (
                            <div className="h-48 flex flex-col items-center justify-center text-slate-400 text-sm font-medium border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                                <Activity className="w-8 h-8 text-slate-300 mb-3" />
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