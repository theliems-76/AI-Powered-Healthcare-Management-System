import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Gauge, Stethoscope, Lightbulb, TrendingUp, Users } from 'lucide-react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import StatsCard from './components/StatsCard';
import MiniRiskChart from './components/MiniRiskChart';

export default function Dashboard() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [latestRecord, setLatestRecord] = useState(null);
    const [historyData, setHistoryData] = useState([]);

    // Helper to strip markdown for excerpts
    const stripMarkdown = (text) => {
        if (!text) return "";
        return text.replace(/[#*`_]/g, '').trim();
    };

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

    return (
        <div className="max-w-7xl mx-auto p-4 space-y-6 animate-in fade-in duration-500">
            {}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">Tổng quan sức khỏe</h1>
                    <p className="text-slate-500 text-sm">Chào mừng bạn quay lại hệ thống.</p>
                </div>
                <button onClick={() => navigate('/assessment')} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 transition">
                    <Stethoscope size={18} /> Khám mới
                </button>
            </div>

            {}
            {user?.role === 'DOCTOR' && (
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 text-white shadow-xl flex flex-col items-center text-center">
                    <Users size={48} className="mb-4 opacity-80" />
                    <h2 className="text-2xl font-bold">Chào mừng, Bác sĩ {user?.full_name?.split(' ').pop()}!</h2>
                    <p className="mt-2 text-blue-100 max-w-md">Bạn đang đăng nhập với vai trò Bác sĩ. Truy cập danh sách bệnh nhân để xem hồ sơ và chỉ định khám AI.</p>
                    <button
                        onClick={() => navigate('/patients')}
                        className="mt-6 px-8 py-3 bg-white text-blue-700 font-bold rounded-2xl hover:bg-blue-50 transition shadow-lg"
                    >
                        Xem Danh Sách Bệnh Nhân
                    </button>
                </div>
            )}

            {}
            {user?.role === 'PATIENT' && !latestRecord && (
                <div className="bg-indigo-600 rounded-3xl p-10 text-white shadow-xl flex flex-col items-center text-center">
                    <Stethoscope size={48} className="mb-4 opacity-80" />
                    <h2 className="text-2xl font-bold">Hãy bắt đầu hành trình sức khỏe</h2>
                    <p className="mt-2 text-indigo-100 max-w-md">Nhập các chỉ số lâm sàng để AI xây dựng lộ trình cải thiện cho riêng bạn.</p>
                </div>
            )}

            {}
            {user?.role === 'PATIENT' && latestRecord && (
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