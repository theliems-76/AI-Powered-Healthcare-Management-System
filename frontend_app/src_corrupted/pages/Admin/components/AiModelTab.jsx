import React from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { BrainCircuit, Database, CheckCircle, Target, Activity } from 'lucide-react';

export default function AiModelTab() {
    // Dữ liệu thực tế từ mô hình CatBoost
    const performanceMetrics = [
        { label: 'Độ chính xác (Accuracy)', value: '75.0%', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: Target },
        { label: 'Độ nhạy (Recall)', value: '80.0%', color: 'text-blue-600', bg: 'bg-blue-50', icon: Activity },
        { label: 'Độ đặc hiệu (Specificity)', value: '70.4%', color: 'text-indigo-600', bg: 'bg-indigo-50', icon: CheckCircle },
        { label: 'Điểm F1 (F1-Score)', value: '76.0%', color: 'text-purple-600', bg: 'bg-purple-50', icon: BrainCircuit },
    ];

    const featureImportanceData = [
        { name: 'Sức khỏe chung', importance: 0.298 },
        { name: 'Chỉ số BMI', importance: 0.197 },
        { name: 'Tuổi tác', importance: 0.183 },
        { name: 'Huyết áp cao', importance: 0.131 },
        { name: 'Cholesterol cao', importance: 0.084 },
        { name: 'Bệnh tim mạch', importance: 0.023 },
        { name: 'Thu nhập', importance: 0.022 },
        { name: 'Lạm dụng rượu', importance: 0.022 },
        { name: 'Khó đi lại', importance: 0.013 },
        { name: 'Chỉ số khác', importance: 0.027 },
    ];

    const confusionMatrixData = [
        { name: 'Dự đoán: Bình thường', actual_normal: 4975, actual_disease: 1443 },
        { name: 'Dự đoán: Có nguy cơ', actual_normal: 2095, actual_disease: 5626 },
    ];

    const pieColors = ['#d97706', '#9a3412']; // Màu cam/nâu giống ảnh report của bạn
    const distributionData = [
        { name: 'Không mắc bệnh (Class 0)', value: 7070 },
        { name: 'Có nguy cơ (Class 1)', value: 7069 }
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header / Intro */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                            <BrainCircuit className="w-6 h-6 text-indigo-600" /> Báo Cáo Minh Bạch Mô Hình AI (XAI)
                        </h2>
                        <p className="text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
                            Mô hình Trí tuệ nhân tạo (AI) trong hệ thống được huấn luyện bằng thuật toán <strong className="text-slate-700">CatBoost Classifier</strong> dựa trên bộ dữ liệu <strong className="text-slate-700">BRFSS (Behavioral Risk Factor Surveillance System)</strong>. Kết quả dưới đây được trích xuất từ tập Test (14,139 mẫu) sau khi đã cân bằng dữ liệu.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 shrink-0">
                        <Database className="w-5 h-5 text-indigo-600" />
                        <div className="text-sm">
                            <p className="text-indigo-900 font-bold">14,139</p>
                            <p className="text-[10px] text-indigo-600 font-semibold uppercase">Mẫu kiểm thử</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {performanceMetrics.map((metric, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center items-center text-center">
                        <div className={`p-3 rounded-full ${metric.bg} mb-3`}>
                            <metric.icon className={`w-6 h-6 ${metric.color}`} />
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">{metric.label}</p>
                        <p className={`text-2xl font-black ${metric.color}`}>{metric.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Feature Importance Chart */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Mức độ quan trọng của các chỉ số (Feature Importance)</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={featureImportanceData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                <XAxis type="number" tickFormatter={(val) => `${(val * 100).toFixed(0)}%`} tick={{fontSize: 12}} />
                                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12, fontWeight: 600, fill: '#475569'}} />
                                <RechartsTooltip 
                                    formatter={(value) => [`${(value * 100).toFixed(1)}%`, 'Độ quan trọng']}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="importance" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Confusion Matrix & Distribution */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Ma trận nhầm lẫn (Confusion Matrix)</h3>
                        <p className="text-xs text-slate-500 mb-4">Kết quả đánh giá trên tập Test Data (đã chia tỷ lệ).</p>
                        
                        <div className="grid grid-cols-3 gap-2 text-center text-sm">
                            <div className="p-2"></div>
                            <div className="p-2 font-bold text-slate-600 bg-slate-50 rounded-t-lg">Thực tế: Bình thường</div>
                            <div className="p-2 font-bold text-slate-600 bg-slate-50 rounded-t-lg">Thực tế: Có bệnh</div>
                            
                            <div className="p-4 font-bold text-slate-600 bg-slate-50 rounded-l-lg flex items-center justify-center">Dự đoán:<br/>Bình thường</div>
                            <div className="p-4 bg-orange-100 text-orange-800 rounded-lg border border-orange-200 flex flex-col justify-center">
                                <span className="font-black text-xl">4,975</span>
                                <span className="text-[10px] uppercase">True Negative (TN)</span>
                            </div>
                            <div className="p-4 bg-rose-50 text-rose-700 rounded-lg border border-rose-100 flex flex-col justify-center">
                                <span className="font-black text-xl">1,443</span>
                                <span className="text-[10px] uppercase">False Negative (FN)</span>
                            </div>

                            <div className="p-4 font-bold text-slate-600 bg-slate-50 rounded-l-lg flex items-center justify-center">Dự đoán:<br/>Có bệnh</div>
                            <div className="p-4 bg-orange-50 text-orange-700 rounded-lg border border-orange-100 flex flex-col justify-center">
                                <span className="font-black text-xl">2,095</span>
                                <span className="text-[10px] uppercase">False Positive (FP)</span>
                            </div>
                            <div className="p-4 bg-orange-200 text-orange-900 rounded-lg border border-orange-300 flex flex-col justify-center">
                                <span className="font-black text-xl">5,626</span>
                                <span className="text-[10px] uppercase">True Positive (TP)</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center">
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-800">Phân bổ tập kiểm thử (Test Set)</h3>
                            <p className="text-xs text-slate-500 mt-1">Gồm 14,139 mẫu thử nghiệm đã được cân bằng.</p>
                        </div>
                        <div className="w-32 h-32">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={distributionData} cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={5} dataKey="value">
                                        {distributionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip formatter={(value) => new Intl.NumberFormat('en-US').format(value)} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
