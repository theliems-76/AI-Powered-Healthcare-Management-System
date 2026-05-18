import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import api from '../../services/api';

import RiskChart from './components/RiskChart';
import BMIChart from './components/BMIChart';
import InsightsTimeline from './components/InsightsTimeline';

const TIME_RANGES = [
    { label: '3T', value: 3 },
    { label: '6T', value: 6 },
    { label: '1N', value: 12 },
    { label: 'Tất cả', value: 0 },
];

export default function History() {
    const location = useLocation();
    const navigate = useNavigate();
    const [timeRange, setTimeRange] = useState(6);
    const [fullData, setFullData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const patientId = location.state?.patientId || null;
    const patientName = location.state?.patientName || null;

    useEffect(() => {
        const fetchHistoryData = async () => {
            try {
                setIsLoading(true);
                const url = patientId
                    ? `/records/history?patientId=${patientId}`
                    : '/records/history';
                const response = await api.get(url);

                if (response.data.status === "success" && response.data.data) {
                    const formattedData = response.data.data.map(item => ({
                        id: item.id,
                        month: item.date.substring(0, 5),
                        fullDate: item.date,
                        rawDate: item.date, // giữ nguyên để parse
                        risk: parseFloat(item.risk_score),
                        bmi: parseFloat(item.bmi),
                        diagnosis: item.ai_diagnosis,
                        health_status: item.health_status,
                        explanation: item.ai_explanation
                    }));
                    setFullData(formattedData);
                }
            } catch (error) {
                console.error("Lỗi khi tải lịch sử khám:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistoryData();
    }, [patientId]);

    // Parse vi-VN date string "dd/MM/yyyy, HH:mm" -> Date object
    const parseViDate = (dateStr) => {
        try {
            const [datePart] = dateStr.split(', ');
            const [dd, mm, yyyy] = datePart.split('/');
            return new Date(parseInt(yyyy), parseInt(mm) - 1, parseInt(dd));
        } catch {
            return new Date(0);
        }
    };

    const chartData = useMemo(() => {
        if (timeRange === 0) return fullData;
        const cutoff = new Date();
        cutoff.setMonth(cutoff.getMonth() - timeRange);
        cutoff.setHours(0, 0, 0, 0);
        return fullData.filter(item => parseViDate(item.fullDate) >= cutoff);
    }, [fullData, timeRange]);

    const insightsData = useMemo(() => {
        if (!fullData || fullData.length === 0) return [];
        return [...fullData].reverse().map((item, index) => {
            let type = 'Thông tin';
            if (item.risk <= 33) type = 'Thành tựu';
            else if (item.risk > 66) type = 'Cảnh báo';
            return {
                id: item.id || index,
                date: item.fullDate,
                type,
                risk: item.risk,
                diagnosis: item.diagnosis,
                health_status: item.health_status,
                explanation: item.explanation
            };
        });
    }, [fullData]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    {patientName && (
                        <button
                            onClick={() => navigate('/patients')}
                            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 mb-3 transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" /> Quay lại danh sách
                        </button>
                    )}
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                        {patientName ? `Tiến trình: ${patientName}` : 'Tiến Trình Sức Khỏe'}
                    </h1>
                    <p className="text-sm font-medium text-slate-400 mt-1">Phân tích dọc AI & Chỉ số lâm sàng</p>
                </div>
            </div>

            {/* Charts Unified Panel */}
            {chartData.length > 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    {/* Panel header with time range filter */}
                    <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Biểu đồ theo thời gian</p>
                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                            {TIME_RANGES.map(r => (
                                <button
                                    key={r.value}
                                    onClick={() => setTimeRange(r.value)}
                                    className={`px-3 py-1 text-xs font-black rounded-lg transition-all ${
                                        timeRange === r.value
                                            ? 'bg-slate-900 text-white'
                                            : 'text-slate-500 hover:text-slate-700'
                                    }`}
                                >
                                    {r.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Two charts side by side, divided */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 p-8 gap-8 lg:gap-0">
                        <div className="lg:pr-8">
                            <RiskChart data={chartData} />
                        </div>
                        <div className="lg:pl-8 pt-8 lg:pt-0">
                            <BMIChart data={chartData} />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
                    <p className="text-sm font-medium text-slate-400">Chưa có dữ liệu để hiển thị biểu đồ.</p>
                </div>
            )}

            {/* Clinical Summary Table */}
            <InsightsTimeline insights={insightsData} />
        </div>
    );
}