import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Gauge, Stethoscope, Lightbulb, TrendingUp, Users } from 'lucide-react';
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
                    
                    const resPatients = await api.get('/users/patients?limit=5');
                    if (resPatients.data.status === 'success') {
                        setRecentUpdates(resPatients.data.data.filter(p => p.latest_risk_score !== null));
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
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors">
                                <div className="mb-4 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
                                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tổng hồ sơ quản lý</h3>
                                </div>
                                <div className="flex items-end gap-2 border-l-2 border-slate-900 pl-4">
                                    <p className="text-5xl font-black text-slate-900 tracking-tighter leading-none">24</p>
                                    <div className="flex flex-col pb-1">
                                        <span className="text-xs font-bold text-slate-400">bệnh nhân</span>
                                        <span className="text-[9px] font-black text-emerald-500 uppercase mt-0.5">+2 TRONG TUẦN</span>
                                    </div>
                                </div>
                            </div>

                            {/* Architectural Metric 2 */}
                            <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-sm hover:border-rose-200 transition-colors">
                                <div className="mb-4 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
                                    <h3 className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Rủi ro lâm sàng cao</h3>
                                </div>
                                <div className="flex items-end gap-2 border-l-2 border-rose-500 pl-4">
                                    <p className="text-5xl font-black text-rose-600 tracking-tighter leading-none">3</p>
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
                                <div key={i} className="group relative pl-4 border-l-2 hover:border-slate-800 border-slate-100 transition-colors cursor-pointer py-2" onClick={() => navigate(`/patients/${p.id}`)}>
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
                <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-12 text-center flex flex-col items-center">
                    <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 mb-6">
                        <Stethoscope size={40} className="text-slate-300" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Bắt Đầu Hành Trình Sức Khỏe</h2>
                    <p className="text-sm font-medium text-slate-500 max-w-md mx-auto mb-8">
                        Nhập các chỉ số lâm sàng để AI xây dựng lộ trình dinh dưỡng và tập luyện chuẩn y khoa cho riêng bạn.
                    </p>
                    <button onClick={() => navigate('/assessment')} className="px-8 py-3.5 bg-slate-900 text-white text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-900/10">
                        Bắt Đầu Khám Ngay
                    </button>
                </div>
            )}

            {}
            {user?.role === 'PATIENT' && latestRecord && (
                <div className="grid grid-cols-12 gap-6 items-stretch">
                    {/* Unified Health Panel */}
                    <div className="col-span-12 lg:col-span-8 bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden flex flex-col relative group">
                        {/* Soft background glow */}
                        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-50 rounded-full blur-[80px] -z-10 group-hover:bg-blue-100 transition-colors duration-1000"></div>
                        
                        {/* Stats Header Area */}
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 p-8 md:p-10 z-10">
                            
                            {/* Risk Stat - Glowing & Bold */}
                            <div className="pb-8 md:pb-0 md:pr-10 flex flex-col justify-between">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-rose-100">
                                        <div className="absolute w-full h-full bg-rose-400 rounded-full animate-ping opacity-20"></div>
                                        <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                                    </div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Rủi ro tiểu đường</p>
                                </div>
                                <div className="flex items-baseline gap-2 mt-auto">
                                    <h2 className="text-[4rem] font-black text-transparent bg-clip-text bg-gradient-to-br from-rose-500 to-orange-400 tracking-tighter leading-none drop-shadow-sm">{latestRecord.risk_score}</h2>
                                    <span className="text-2xl font-black text-rose-300">%</span>
                                </div>
                            </div>

                            {/* BMI Stat - Sleek */}
                            <div className="pt-8 md:pt-0 md:pl-10 flex flex-col justify-between">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                    </div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Chỉ số khối cơ thể</p>
                                </div>
                                <div className="flex items-baseline gap-2 mt-auto">
                                    <h2 className="text-[4rem] font-black text-slate-800 tracking-tighter leading-none">{latestRecord.bmi}</h2>
                                    <span className="text-xl font-bold text-slate-400">kg/m²</span>
                                </div>
                            </div>
                        </div>

                        {/* Integrated Chart Area - Edge to Edge */}
                        <div className="flex-1 bg-gradient-to-b from-slate-50/50 to-white border-t border-slate-100 p-8 md:p-10 relative z-10">
                            <div className="flex justify-between items-center mb-8">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <TrendingUp size={16} className="text-indigo-400" /> Xu hướng rủi ro (Các lần gần nhất)
                                </p>
                            </div>
                            {historyData.length >= 2 ? (
                                <div className="relative h-48 -mx-4 sm:mx-0">
                                    <MiniRiskChart data={historyData} className="h-full w-full" />
                                </div>
                            ) : (
                                <div className="h-48 flex flex-col items-center justify-center text-slate-400 text-sm font-medium border-2 border-dashed border-slate-200 rounded-3xl bg-white/50">
                                    <Activity className="w-8 h-8 text-slate-300 mb-3" />
                                    <span>Cần thêm {2 - historyData.length} lần khám để phân tích xu hướng</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* AI Advice Panel - Premium Dark Clinical */}
                    <div className="col-span-12 lg:col-span-4 bg-slate-900 p-8 md:p-10 rounded-[2rem] shadow-2xl shadow-slate-900/20 flex flex-col relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500 border border-slate-800">
                        {/* Subtle AI Glows (Cinematic Tech Feel) */}
                        <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-cyan-500/10 blur-[60px] group-hover:bg-cyan-500/20 transition-colors duration-700"></div>
                        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[40px]"></div>
                        
                        <div className="flex items-center gap-3 mb-8 relative z-10">
                            <div className="p-2.5 bg-slate-800 rounded-xl shadow-inner border border-slate-700">
                                <Lightbulb size={20} className="text-cyan-400 animate-pulse" />
                            </div>
                            <h3 className="font-black text-xs uppercase tracking-widest text-white drop-shadow-md">Phân tích từ AI</h3>
                        </div>
                        
                        <div className="text-base text-slate-300 leading-relaxed font-medium flex-1 relative z-10 mb-10">
                            <p className="line-clamp-6">
                                {stripMarkdown(latestRecord?.ai_nutrition_plan || "Hệ thống AI hiện chưa đưa ra lời khuyên cụ thể cho hồ sơ này. Vui lòng cập nhật thêm chỉ số.")}
                            </p>
                        </div>
                        
                        <button onClick={() => navigate(`/history/${latestRecord?.id}`)} className="w-full py-4 bg-white text-slate-900 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-cyan-50 transition-all active:scale-95 shadow-lg relative z-10 flex items-center justify-center gap-2">
                            Mở Phác Đồ Chi Tiết
                        </button>
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