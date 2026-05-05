import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TrendingDown, ArrowDown, ArrowUp, Calendar, Loader2, ArrowLeft } from 'lucide-react';
import api from '../../services/api';

import RiskChart from './components/RiskChart';
import BMIChart from './components/BMIChart';
import InsightsTimeline from './components/InsightsTimeline';

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

    const chartData = useMemo(() => fullData.slice(-timeRange),[fullData, timeRange]);
    const latestRecord = fullData.length > 0 ? fullData[fullData.length - 1] : null;
    const previousRecord = fullData.length > 1 ? fullData[fullData.length - 2] : null;

    let riskTrend = 0;
    if (latestRecord && previousRecord) {
        riskTrend = (latestRecord.risk - previousRecord.risk).toFixed(1);
    }

    const insightsData = useMemo(() => {
    if (!fullData || fullData.length === 0) return [];
    
    return [...fullData].reverse().slice(0, 3).map((item, index) => {
        let type = 'Thông tin';
        if (item.risk <= 33) type = 'Thành tựu';
        else if (item.risk > 66) type = 'Cảnh báo';

        return {
            id: item.id || index,
            date: item.fullDate,
            type: type,
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
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
            {}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    {}
                    {patientName && (
                        <button
                            onClick={() => navigate('/patients')}
                            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 mb-2 transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" /> Quay lại danh sách
                        </button>
                    )}
                    <h1 className="text-2xl font-extrabold text-slate-800">
                        {patientName ? `Tiến trình: ${patientName}` : 'Tiến Trình Sức Khỏe'}
                    </h1>
                    <p className="text-slate-500 text-sm">Phân tích dọc AI &amp; Chỉ số lâm sàng</p>
                </div>
            </div>

            {}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {}
            </div>

            {}
            {chartData.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <RiskChart data={chartData} />
                    <BMIChart data={chartData} />
                </div>
            ) : null}

            {}
            <InsightsTimeline insights={insightsData} />
        </div>
    );
}