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
                                <span className="text-[10px] font-black text-slate-900">0 LỊCH</span>
                            </div>
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-transparent border border-dashed border-slate-300 rounded-2xl">
                                <span className="text-3xl font-black text-slate-200 mb-2">--</span>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Lịch trình trống</p>
                            </div>
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
                            {/* Mock Data */}
                            {[
                                { name: "Nguyễn Văn A", risk: 85, time: "10 PHÚT TRƯỚC", desc: "Đã cập nhật chỉ số đường huyết mới." },
                                { name: "Trần Thị B", risk: 42, time: "2 GIỜ TRƯỚC", desc: "Hoàn thành bài đánh giá định kỳ." },
                                { name: "Lê Văn C", risk: 15, time: "HÔM QUA", desc: "Báo cáo: Đã giảm 2kg trong tháng." }
                            ].map((p, i) => (
                                <div key={i} className="group relative pl-4 border-l-2 hover:border-slate-800 border-slate-100 transition-colors cursor-pointer py-2">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="font-black text-slate-900 text-base tracking-tight group-hover:text-slate-600 transition-colors">{p.name}</h4>
                                            <p className="text-xs font-medium text-slate-500 mt-1">{p.desc}</p>
                                        </div>
                                        <div className="text-right flex flex-col items-end">
                                            <span className="text-[10px] font-bold text-slate-400 tracking-widest">{p.time}</span>
                                            <span className={`mt-2 text-[10px] font-black uppercase tracking-widest ${p.risk > 66 ? 'text-rose-600' : p.risk > 33 ? 'text-amber-500' : 'text-emerald-500'}`}>
                                                RỦI RO: {p.risk}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
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
                    <div className="col-span-12 lg:col-span-4 bg-slate-900 p-8 rounded-3xl shadow-sm flex flex-col relative overflow-hidden">
                        <div className="absolute -right-10 -top-10 opacity-5">
                            <Lightbulb className="w-48 h-48 text-white" />
                        </div>
                        <div className="flex items-center gap-2 mb-6 text-slate-300 relative z-10">
                            <div className="p-2 bg-slate-800 rounded-lg">
                                <Lightbulb size={16} className="text-emerald-400" />
                            </div>
                            <h3 className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Lời khuyên AI</h3>
                        </div>
                        <div className="text-sm text-slate-300 leading-relaxed font-medium flex-1 overflow-hidden relative z-10 mb-8">
                            {stripMarkdown(latestRecord?.ai_nutrition_plan || "Chưa có lời khuyên cụ thể từ AI cho lần khám này.").substring(0, 250)}...
                        </div>
                        <button onClick={() => navigate(`/history/${latestRecord?.id}`)} className="w-full py-3.5 bg-white text-slate-900 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors shadow-sm relative z-10">
                            Xem chi tiết phác đồ
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}