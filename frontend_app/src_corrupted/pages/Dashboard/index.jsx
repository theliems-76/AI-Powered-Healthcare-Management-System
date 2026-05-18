import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Gauge, Stethoscope, Lightbulb, TrendingUp, Users, AlertTriangle, Clock, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import StatsCard from './components/StatsCard';
import MiniRiskChart from './components/MiniRiskChart';
import RiskDistributionChart from './components/RiskDistributionChart';
import AlertPatientList from './components/AlertPatientList';

export default function Dashboard() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    // --- Patient state ---
    const [latestRecord, setLatestRecord] = useState(null);
    const [historyData, setHistoryData] = useState([]);

    // Helper to strip markdown for excerpts
    const stripMarkdown = (text) => {
        if (!text) return "";
        return text.replace(/[#*`_]/g, '').trim();
    };

    // --- Doctor state ---
    const [doctorStats, setDoctorStats] = useState(null);
    const [riskPatients, setRiskPatients] = useState([]);
    const [doctorLoading, setDoctorLoading] = useState(false);
    const [lastRefresh, setLastRefresh] = useState(null);

    // Fetch patient data
    useEffect(() => {
        if (user?.role !== 'PATIENT') return;
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
    }, [user?.role]);

    // Fetch doctor data
    const fetchDoctorData = async () => {
        setDoctorLoading(true);
        try {
            const [statsRes, riskRes] = await Promise.all([
                api.get('/doctor/stats'),
                api.get('/doctor/patients/risk')
            ]);
            setDoctorStats(statsRes.data.data);
            setRiskPatients(riskRes.data.data);
            setLastRefresh(new Date());
        } catch (e) {
            console.error('Lỗi tải dữ liệu bác sĩ:', e);
        } finally {
            setDoctorLoading(false);
        }
    };

    useEffect(() => {
        if (user?.role === 'DOCTOR') fetchDoctorData();
    }, [user?.role]);

    // ============ DOCTOR DASHBOARD ============
    if (user?.role === 'DOCTOR') {
        return (
            <div className="max-w-7xl mx-auto p-4 space-y-6 animate-in fade-in duration-500">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900">
                            Chào, BS. {user?.full_name?.split(' ').pop()}
                        </h1>
                        <p className="text-slate-500 text-sm mt-1 font-medium">
                            Trung tâm Điều phối Y khoa · {lastRefresh ? `Cập nhật lúc ${lastRefresh.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}` : 'Đang tải...'}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={fetchDoctorData}
                            disabled={doctorLoading}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${doctorLoading ? 'animate-spin' : ''}`} />
                            Làm mới
                        </button>
                        <button
                            onClick={() => navigate('/patients')}
                            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 shadow-sm transition-all active:scale-95"
                        >
                            <Users size={16} /> Danh sách bệnh nhân
                        </button>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatsCard title="Tổng bệnh nhân" value={doctorStats?.totalPatients ?? '—'} icon={Users} colorClass="bg-blue-50 text-blue-500" desc="Đang quản lý" />
                    <StatsCard title="Nguy cơ cao" value={doctorStats?.highRiskCount ?? '—'} icon={AlertTriangle} colorClass="bg-rose-50 text-rose-500" desc="Risk score > 66%" />
                    <StatsCard title="Mới 24 giờ" value={doctorStats?.newRecords24h ?? '—'} icon={Clock} colorClass="bg-violet-50 text-violet-500" desc="Lần khám gần nhất" />
                    <StatsCard title="Nguy cơ thấp" value={doctorStats?.lowRiskCount ?? '—'} icon={Activity} colorClass="bg-emerald-50 text-emerald-500" desc="Risk score ≤ 33%" />
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Patient Alert List */}
                    <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-black text-slate-800 text-base">Ưu tiên Theo dõi</h2>
                            <span className="text-xs font-bold text-slate-400">{riskPatients.length} bệnh nhân</span>
                        </div>
                        <div className="max-h-[480px] overflow-y-auto pr-1 space-y-0.5">
                            <AlertPatientList patients={riskPatients} />
                        </div>
                    </div>

                    {/* Risk Chart */}
                    <div className="lg:col-span-2">
                        <RiskDistributionChart stats={doctorStats} />
                    </div>
                </div>
            </div>
        );
    }

    // ============ PATIENT DASHBOARD ============
    return (
        <div className="max-w-7xl mx-auto p-4 space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Tổng quan sức khỏe</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Chào mừng bạn quay lại hệ thống.</p>
                </div>
                <button onClick={() => navigate('/assessment')} className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 shadow-sm transition-all active:scale-95">
                    <Stethoscope size={16} /> Khám mới
                </button>
            </div>

            {!latestRecord && (
                <div className="bg-transparent border-2 border-dashed border-slate-200 rounded-3xl p-10 flex flex-col items-center text-center">
                    <div className="bg-slate-100 p-4 rounded-full mb-4">
                        <Stethoscope size={32} className="text-slate-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Hãy bắt đầu hành trình sức khỏe</h2>
                    <p className="mt-2 text-slate-500 max-w-md text-sm font-medium">Nhập các chỉ số lâm sàng để Hệ thống Trí tuệ Nhân tạo xây dựng lộ trình cải thiện cho riêng bạn.</p>
                </div>
            )}

            {latestRecord && (
                <div className="grid grid-cols-12 gap-6 items-start">
                    {/* Unified Health Panel */}
                    <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                        
                        {/* Stats Header Area */}
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 p-8">
                            
                            {/* Risk Stat */}
                            <div className="pb-6 md:pb-0 md:pr-8 flex flex-col justify-between">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Rủi ro tiểu đường</p>
                                </div>
                                <div className="flex items-baseline gap-1 mt-auto">
                                    <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">{latestRecord.risk_score}</h2>
                                    <span className="text-lg font-bold text-slate-400">%</span>
                                </div>
                            </div>

                            {/* BMI Stat */}
                            <div className="pt-6 md:pt-0 md:pl-8 flex flex-col justify-between">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Chỉ số khối cơ thể (BMI)</p>
                                </div>
                                <div className="flex items-baseline gap-1 mt-auto">
                                    <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">{latestRecord.bmi}</h2>
                                    <span className="text-lg font-bold text-slate-400">kg/m²</span>
                                </div>
                            </div>
                        </div>

                        {/* Integrated Chart Area */}
                        <div className="flex-1 bg-slate-50/50 border-t border-slate-100 p-8">
                            <div className="flex justify-between items-center mb-6">
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Xu hướng rủi ro (Các lần gần nhất)</p>
                            </div>
                            {historyData.length >= 2 ? (
                                <MiniRiskChart data={historyData} className="h-40" />
                            ) : (
                                <div className="h-40 flex items-center justify-center text-slate-400 text-sm font-medium border-2 border-dashed border-slate-200 rounded-2xl">
                                    <TrendingUp className="mr-2" /> Cần thêm {2 - historyData.length} lần khám để hiển thị biểu đồ xu hướng
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-span-12 lg:col-span-4 bg-slate-900 text-white p-6 rounded-3xl shadow-sm flex flex-col">
                        <div className="flex items-center gap-2 mb-4 text-slate-300">
                            <Lightbulb size={20} className="text-emerald-400" />
                            <h3 className="font-bold text-sm uppercase tracking-wider">Lời khuyên AI gần nhất</h3>
                        </div>
                        <div className="text-sm text-slate-300 leading-relaxed font-medium flex-1 overflow-hidden">
                            {stripMarkdown(latestRecord?.ai_nutrition_plan || "Chưa có lời khuyên cụ thể từ AI cho lần khám này.").substring(0, 250)}...
                        </div>
                        <button onClick={() => navigate(`/history/${latestRecord?.id}`)} className="mt-6 w-full py-2.5 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors">
                            Xem chi tiết phác đồ
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
