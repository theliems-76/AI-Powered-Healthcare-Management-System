import React, { useRef } from 'react';
import { AlertTriangle, ShieldCheck, FileText, Printer, Send, Target, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Tooltip from '../../components/ui/Tooltip';
import { toast } from 'react-toastify';
import { useReactToPrint } from 'react-to-print';
import MedicalReportTemplate from './components/MedicalReportTemplate';
import PatientDoctorNote from '../History/components/PatientDoctorNote';

export default function AIResults({ result, userRole }) {
    const componentRef = useRef();

   const handleDownloadPDF = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `HSTD_Report_${new Date().toISOString().split('T')[0]}`,
    onBeforePrint: () => {
        toast.info("Đang mở cửa sổ in PDF...", { autoClose: 2000 });
        return Promise.resolve(); 
    },
    onAfterPrint: () => {
        toast.success("Xử lý hoàn tất!");
    }
});

    if (!result) return null;

    const riskScore = parseFloat(result.ai_risk_score || result.risk_probability || 0);

    const getRiskLabel = (score) => {
        if (score <= 33) return { label: 'Rủi ro thấp', color: 'text-emerald-600' };
        if (score <= 66) return { label: 'Cảnh báo tiền tiểu đường', color: 'text-amber-600' };
        return { label: 'Rủi ro rất cao', color: 'text-rose-600' };
    };
    const riskInfo = getRiskLabel(riskScore);

    return (
        <section className="mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {}
            <div className="absolute left-[-9999px] top-[-9999px]">
                <MedicalReportTemplate ref={componentRef} result={result} />
            </div>

            {}
            <div className="space-y-8">
                
                {}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
                    <div className="flex-1 p-10 border-b md:border-b-0 md:border-r border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Kết luận Lâm sàng (AI)</p>
                        <h2 className={`text-4xl md:text-5xl font-black tracking-tight mb-4 ${riskInfo.color}`}>
                            {riskInfo.label}
                        </h2>
                        <p className="text-sm font-medium text-slate-600 leading-relaxed max-w-xl">
                            {result.ai_diagnosis}
                        </p>
                    </div>
                    <div className="w-full md:w-72 p-10 bg-slate-50/50 flex flex-col justify-center items-center text-center shrink-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Chỉ số rủi ro</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-6xl font-black text-slate-900 tracking-tighter">{riskScore}</span>
                            <span className="text-xl font-bold text-slate-400">%</span>
                        </div>
                        <div className="w-full mt-8">
                            <div className="relative h-2 bg-slate-100 rounded-full overflow-visible">
                                {/* Tiers */}
                                <div className="absolute left-[33%] top-0 bottom-0 w-px bg-white z-10"></div>
                                <div className="absolute left-[66%] top-0 bottom-0 w-px bg-white z-10"></div>
                                
                                {/* Progress Fill */}
                                <div 
                                    className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ${
                                        riskScore <= 33 ? 'bg-emerald-500' : riskScore <= 66 ? 'bg-amber-500' : 'bg-rose-500'
                                    }`}
                                    style={{ width: `${riskScore}%` }}
                                ></div>

                                {/* Indicator Dot */}
                                <div 
                                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-slate-900 rounded-full shadow-sm transition-all duration-1000 z-20"
                                    style={{ left: `calc(${riskScore}% - 6px)` }}
                                ></div>
                            </div>
                            
                            <div className="relative w-full mt-3 text-[10px] font-bold text-slate-400">
                                <span className="absolute left-0 -translate-x-1/2">0</span>
                                <span className="absolute left-[33%] -translate-x-1/2">33</span>
                                <span className="absolute left-[66%] -translate-x-1/2">66</span>
                                <span className="absolute right-0 translate-x-1/2">100</span>
                            </div>
                        </div>
                    </div>
                </div>

                {result.ai_explanation && (() => {
                    const mapFeatureToSuperCategory = (featureName) => {
                        const f = featureName.toLowerCase();
                        
                        // Lối sống (Trục X) CHỈ bao gồm các hành vi do bệnh nhân TỰ QUYẾT ĐỊNH
                        if (f.includes('hút thuốc') || f.includes('rượu') || f.includes('thể dục') || f.includes('vận động') || 
                            f.includes('trái cây') || f.includes('rau')) {
                            return 'Ngoại lai';
                        }
                        // Thu nhập, Học vấn, Bảo hiểm y tế (SDOH) là Hoàn cảnh xã hội (Cố định/Khó thay đổi ngay), 
                        // nên xếp vào Trục Y cùng với Sinh trắc học và Bệnh nền.
                        return 'Nội tại';
                    };

                    let bioScore = 0;
                    let lifeScore = 0;
                    let bioBurden = 0; // Chỉ tính gánh nặng (Điểm Xấu)
                    let lifeBurden = 0; // Chỉ tính gánh nặng (Điểm Xấu)
                    const bioFactors = [];
                    const lifeFactors = [];

                    // Sử dụng toàn bộ 21 chỉ số (nếu có từ bản cập nhật mới) để tính toán điểm tuyệt đối chính xác 100%
                    // Nếu là hồ sơ cũ trong Database, fallback về warning/good factors
                    let factorsToProcess = [];
                    if (result.ai_explanation.all_factors) {
                        factorsToProcess = result.ai_explanation.all_factors.map(f => ({
                            ...f,
                            isWarning: f.contribution > 0
                        }));
                    } else {
                        factorsToProcess = [
                            ...(result.ai_explanation.warning_factors || []).map(f => ({...f, isWarning: true})),
                            ...(result.ai_explanation.good_factors || []).map(f => ({...f, isWarning: false}))
                        ];
                    }

                    const indicators = typeof result.health_indicators === 'string' 
                        ? JSON.parse(result.health_indicators) 
                        : (result.health_indicators || {});

                    factorsToProcess.forEach(f => {
                        const cat = mapFeatureToSuperCategory(f.feature);
                        let impact = f.contribution;
                        
                        // HYBRID AI: Khử nhiễu SHAP (Zero-out false positives)
                        // Nếu bệnh nhân có thói quen tốt, nhưng thuật toán (do nhiễu hoặc sai lệch trong tập dữ liệu) 
                        // lại gán cho nó một giá trị SHAP dương nhỏ, ta phải triệt tiêu nó để tránh phạt oan bệnh nhân.
                        if (cat === 'Ngoại lai' && impact > 0) {
                            const fLower = f.feature.toLowerCase();
                            if (fLower.includes('hút thuốc') && indicators.Smoker === 0) impact = 0;
                            if (fLower.includes('rượu') && indicators.HvyAlcoholConsump === 0) impact = 0;
                            if (fLower.includes('thể dục') && indicators.PhysActivity === 1) impact = 0;
                            if (fLower.includes('trái cây') && indicators.Fruits === 1) impact = 0;
                            if (fLower.includes('rau') && indicators.Veggies === 1) impact = 0;
                        }

                        if (cat === 'Nội tại') {
                            bioScore += impact;
                            if (impact > 0) bioBurden += impact;
                            bioFactors.push({...f, contribution: impact});
                        } else {
                            lifeScore += impact;
                            if (impact > 0) lifeBurden += impact;
                            lifeFactors.push({...f, contribution: impact});
                        }
                    });

                    // HYBRID AI: Clinical Heuristics Override (Luật Lâm sàng)
                    // Can thiệp nếu AI chấm điểm lối sống quá thấp (bỏ sót do bệnh nền quá nặng)
                    let clinicalLifePenalty = 0;
                    const heuristicFactors = [];
                    
                    if (indicators.Smoker === 1) {
                        clinicalLifePenalty += 0.05;
                        heuristicFactors.push({ feature: 'Hút thuốc lá (Cảnh báo Lâm sàng)', contribution: 0.05, isWarning: true });
                    }
                    if (indicators.PhysActivity === 0) {
                        clinicalLifePenalty += 0.03;
                        heuristicFactors.push({ feature: 'Lười vận động (Cảnh báo Lâm sàng)', contribution: 0.03, isWarning: true });
                    }
                    if (indicators.HvyAlcoholConsump === 1) {
                        clinicalLifePenalty += 0.04;
                        heuristicFactors.push({ feature: 'Lạm dụng rượu bia (Cảnh báo Lâm sàng)', contribution: 0.04, isWarning: true });
                    }
                    if (indicators.Fruits === 0 || indicators.Veggies === 0) {
                        const score = (indicators.Fruits === 0 ? 0.01 : 0) + (indicators.Veggies === 0 ? 0.01 : 0);
                        clinicalLifePenalty += score;
                        heuristicFactors.push({ feature: 'Thiếu rau/trái cây (Cảnh báo Lâm sàng)', contribution: score, isWarning: true });
                    }

                    // Nếu điểm phạt Lâm sàng cao hơn điểm SHAP của AI, ưu tiên Lâm sàng
                    if (clinicalLifePenalty > lifeBurden) {
                        lifeBurden = clinicalLifePenalty;
                        // Xóa các yếu tố lối sống từ AI có điểm quá bé (< 0.01) để thay bằng Heuristics
                        for (let i = lifeFactors.length - 1; i >= 0; i--) {
                            if (lifeFactors[i].contribution < 0.01) {
                                lifeFactors.splice(i, 1);
                            }
                        }
                        lifeFactors.push(...heuristicFactors);
                    }

                    // Fix Logic: Align matrix cell with overall riskScore (0-100%)
                    const targetLevel = Math.min(6, Math.max(0, Math.round((riskScore / 100) * 6)));
                    
                    // BẢN VÁ TOÁN HỌC TỐI THƯỢNG (Burden-based Matrix):
                    // Do đặc thù của mô hình ML y khoa, các chỉ số Sinh học (Huyết áp, BMI) có SHAP values rất lớn (lên tới 1.5).
                    // Trong khi đó, các chỉ số Lối sống (Thuốc lá, Vận động) có SHAP values rất nhỏ (chỉ cỡ 0.01 - 0.1) 
                    // vì chúng đã bị nội hàm vào chỉ số sinh học.
                    // Để Ma trận phản ánh đúng lâm sàng, ta phải dùng 2 bộ Threshold riêng biệt (Zoom-in cho trục X).
                    
                    const getBioLevel = (burden) => {
                        if (burden <= 0.1) return 0; // Lành mạnh
                        if (burden <= 0.6) return 1; // Cần cải thiện
                        if (burden <= 1.5) return 2; // Rủi ro
                        return 3; // Báo động
                    };

                    const getLifeLevel = (burden) => {
                        if (burden <= 0.01) return 0; // Lành mạnh
                        if (burden <= 0.04) return 1; // Cần cải thiện
                        if (burden <= 0.08) return 2; // Rủi ro
                        return 3; // Báo động
                    };

                    const bioIdx = getBioLevel(bioBurden);
                    const lifeIdx = getLifeLevel(lifeBurden);

                    const colors = [
                        ['bg-[#22c55e]', 'bg-[#22c55e]', 'bg-[#fde047]', 'bg-[#f97316]'],
                        ['bg-[#22c55e]', 'bg-[#fde047]', 'bg-[#f97316]', 'bg-[#ef4444]'],
                        ['bg-[#fde047]', 'bg-[#f97316]', 'bg-[#ef4444]', 'bg-[#ef4444]'],
                        ['bg-[#f97316]', 'bg-[#ef4444]', 'bg-[#ef4444]', 'bg-[#dc2626]']
                    ];

                    return (
                        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden mb-8">
                            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Target size={16} /> Tiên lượng Rủi ro Lâm sàng (KDIGO/MDCalc Style)
                                </h3>
                                <p className="text-xs text-slate-500 mt-2 font-medium">Bệnh nhân được định vị trên ma trận dựa trên sự tương tác giữa yếu tố Sinh trắc (Nội tại) và Hành vi lối sống (Ngoại lai).</p>
                            </div>
                            
                            <div className="p-8">
                                <div className="overflow-x-auto mb-8">
                                    <table className="w-full border-collapse border-2 border-slate-900 text-xs text-center font-medium bg-white">
                                        <thead>
                                            <tr>
                                                <th colSpan="2" rowSpan="2" className="border-2 border-slate-900 bg-white p-3 w-1/4">
                                                    <p className="font-black text-sm text-slate-900 leading-tight">Ma trận Rủi ro Đái tháo đường Type 2</p>
                                                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Trích xuất từ dữ liệu XAI SHAP</p>
                                                </th>
                                                <th colSpan="4" className="border-2 border-slate-900 bg-slate-50 p-2 font-black text-slate-800">
                                                    Mức độ Hành vi, Lối sống & Xã hội (Trục X)<br/>
                                                    <span className="text-[10px] font-medium text-slate-500">Thuốc lá, Rượu bia, Thể dục, Dinh dưỡng, Kinh tế</span>
                                                </th>
                                            </tr>
                                            <tr>
                                                <th className="border-2 border-slate-900 bg-slate-50 p-2 w-[18%]">Lành mạnh<br/><span className="text-[9px] font-bold text-emerald-600 block mt-0.5">TỐT ƯU</span></th>
                                                <th className="border-2 border-slate-900 bg-slate-50 p-2 w-[18%]">Cần cải thiện<br/><span className="text-[9px] font-bold text-amber-600 block mt-0.5">THEO DÕI</span></th>
                                                <th className="border-2 border-slate-900 bg-slate-50 p-2 w-[18%]">Rủi ro<br/><span className="text-[9px] font-bold text-orange-600 block mt-0.5">CẢNH BÁO</span></th>
                                                <th className="border-2 border-slate-900 bg-slate-50 p-2 w-[18%]">Báo động<br/><span className="text-[9px] font-bold text-rose-600 block mt-0.5">NGUY HIỂM</span></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[
                                                { label: 'Ổn định', sub: 'TỐT ƯU' },
                                                { label: 'Suy giảm nhẹ', sub: 'THEO DÕI' },
                                                { label: 'Suy giảm', sub: 'CẢNH BÁO' },
                                                { label: 'Báo động', sub: 'NGUY HIỂM' }
                                            ].map((bObj, r) => (
                                                <tr key={r}>
                                                    {r === 0 && (
                                                        <td rowSpan="4" className="border-2 border-slate-900 bg-slate-50 p-2 w-12 font-black text-slate-800 [writing-mode:vertical-lr] rotate-180 text-center">
                                                            Sinh trắc, Bệnh nền & Thể trạng (Trục Y)
                                                        </td>
                                                    )}
                                                    <td className="border-2 border-slate-900 bg-slate-50 p-3 font-bold text-slate-800 text-left">
                                                        {bObj.label}<br/>
                                                        <span className="text-[9px] font-bold text-slate-500">{bObj.sub}</span>
                                                    </td>
                                                    {[0,1,2,3].map(c => {
                                                        const isCurrent = (r === bioIdx && c === lifeIdx);
                                                        return (
                                                            <td key={c} className={`border-2 border-slate-900 relative p-0 transition-all ${colors[r][c]}`}>
                                                                <div className="absolute inset-0"></div>
                                                                {isCurrent && (
                                                                    <div className="absolute inset-0 border-[3px] border-slate-900 shadow-[0_0_15px_rgba(0,0,0,0.5)] z-10 flex items-center justify-center">
                                                                        <div className="bg-white text-slate-900 font-black px-2.5 py-1 rounded-full text-[10px] uppercase tracking-widest shadow-md flex items-center gap-1">
                                                                            📍 Bệnh nhân
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </td>
                                                        )
                                                    })}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="mt-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                                        <div className="text-[10px] font-bold text-slate-600 flex flex-wrap gap-4">
                                            <span className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 bg-[#22c55e] border border-slate-900 rounded-sm"></div> Nguy cơ thấp</span>
                                            <span className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 bg-[#fde047] border border-slate-900 rounded-sm"></div> Tăng trung bình</span>
                                            <span className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 bg-[#f97316] border border-slate-900 rounded-sm"></div> Nguy cơ cao</span>
                                            <span className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 bg-[#ef4444] border border-slate-900 rounded-sm"></div> Báo động đỏ</span>
                                        </div>
                                    </div>

                                    <div className="mt-6 p-6 bg-slate-50/80 border border-slate-200 shadow-sm rounded-2xl">
                                        <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <Target size={14} className="text-slate-400" />
                                            Cơ sở Khoa học & Thuật toán XAI
                                        </h4>
                                        <div className="text-xs text-slate-600 font-medium space-y-4 leading-relaxed">
                                            <p>Ma trận định vị tọa độ của bệnh nhân dựa trên việc phân tích <strong className="text-slate-900">Gánh nặng Rủi ro (Burden of Disease)</strong> thông qua thang điểm <strong>Log-Odds</strong> do mô hình AI trích xuất (Thuật toán SHAP):</p>
                                            
                                            <ul className="space-y-3 list-decimal pl-5">
                                                <li><strong className="text-slate-900">Thang điểm Log-Odds là gì?</strong> Khác với tỷ lệ phần trăm (%), Log-Odds là thước đo tác động cận biên trong Học máy (Machine Learning). Mọi yếu tố làm tăng bệnh (điểm Dương) hoặc bảo vệ bệnh (điểm Âm) đều được số hóa. Một điểm +0.5 Log-Odds biểu thị sự gia tăng rủi ro cực kỳ sắc nét ở cấp độ tế bào/mô hình.</li>
                                                <li><strong className="text-slate-900">Tọa độ chỉ đo lường "Gánh nặng" (Burden):</strong> Ma trận KHÔNG lấy điểm tốt (như Tuổi trẻ) để bù trừ cho điểm xấu (như Béo phì). Nó chỉ cộng dồn các YẾU TỐ XẤU. Nếu bạn bị Béo phì và Cao huyết áp, tọa độ của bạn CHẮC CHẮN phải nằm ở Vùng Đỏ, bất kể bạn 30 hay 80 tuổi.</li>
                                                <li><strong className="text-amber-700">Điểm Lối sống thường thấp hơn Sinh trắc học?</strong> 
                                                    <p className="mt-1">Đây là bản chất của AI Y khoa. Khi bạn ĐÃ BỊ Béo phì hoặc Cao huyết áp, hệ quả của việc "Lười vận động" đã được nội hàm vào bệnh lý nền. Do đó, điểm Log-Odds của Lối sống có thể rất nhỏ (chỉ 0.05 điểm), nhưng thuật toán đã được <strong>khuếch đại (Zoom-in)</strong> để đảm bảo bạn vẫn bị cảnh báo đỏ nếu duy trì lối sống tệ.</p>
                                                </li>
                                                <li><strong className="text-rose-700">Tại sao màu Ma trận có thể khác với màu Tổng Rủi ro?</strong> 
                                                    <p className="mt-1">Ví dụ: Ma trận nằm ở Vùng Đỏ (Do Lối sống tồi tệ), nhưng Tổng rủi ro chỉ 5% (Vùng Xanh). Điều này có nghĩa là: <em>"Lối sống của bạn đang hủy hoại cơ thể (Ma trận Đỏ), nhưng bạn chưa bị bệnh ngay bây giờ (Risk 5%) CHỈ VÌ bạn còn sức trẻ bảo vệ. Đừng ỷ lại, hãy thay đổi!"</em></p>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Detailed factors listing */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
                                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                                        <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-widest mb-4 flex items-center justify-between">
                                            Gánh nặng Trục Dọc (Nội tại)
                                            <span className={`text-xs ${bioBurden > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{bioBurden > 0 ? '+' : ''}{bioBurden.toFixed(2)} điểm</span>
                                        </h4>
                                        <div className="space-y-2">
                                            {bioFactors.sort((a,b) => Math.abs(b.contribution) - Math.abs(a.contribution)).map((f, i) => (
                                                <div key={i} className="flex justify-between items-center text-[11px] py-1 border-b border-slate-100 last:border-0">
                                                    <span className="font-bold text-slate-600">{f.feature}</span>
                                                    <span className={`font-black ${f.isWarning ? 'text-rose-600' : 'text-emerald-600'}`}>
                                                        {f.isWarning ? '+' : ''}{f.contribution.toFixed(2)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                                        <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-widest mb-4 flex items-center justify-between">
                                            Gánh nặng Trục Ngang (Ngoại lai)
                                            <span className={`text-xs ${lifeBurden > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{lifeBurden > 0 ? '+' : ''}{lifeBurden.toFixed(2)} điểm</span>
                                        </h4>
                                        <div className="space-y-2">
                                            {lifeFactors.sort((a,b) => Math.abs(b.contribution) - Math.abs(a.contribution)).map((f, i) => (
                                                <div key={i} className="flex justify-between items-center text-[11px] py-1 border-b border-slate-100 last:border-0">
                                                    <span className="font-bold text-slate-600">{f.feature}</span>
                                                    <span className={`font-black ${f.isWarning ? 'text-rose-600' : 'text-emerald-600'}`}>
                                                        {f.isWarning ? '+' : ''}{f.contribution.toFixed(2)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })()}

                {/* Phác đồ & Lời khuyên */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 space-y-10">
                    
                    {/* Bác sĩ nhận xét (Chỉ hiện nếu có) */}
                    {result.doctor_notes && (
                        <div>
                            <PatientDoctorNote doctorNotes={result.doctor_notes} />
                        </div>
                    )}

                    <div>
                        <div className="mb-8 pb-6 border-b border-slate-900">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Phác đồ Cá nhân hóa (Bởi AI & Bác sĩ)</p>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Kế hoạch Điều trị & Dinh dưỡng</h3>
                        </div>
                    
                    <div className="prose prose-slate max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-slate-900 prose-p:font-medium prose-p:text-slate-600 text-sm">
                        {result.ai_nutrition_plan === 'PROCESSING' ? (
                            <div className="space-y-4 animate-pulse py-4">
                                <div className="h-4 bg-slate-200 rounded-full w-3/4"></div>
                                <div className="h-4 bg-slate-200 rounded-full w-1/2"></div>
                                <div className="h-4 bg-slate-200 rounded-full w-5/6"></div>
                                <div className="h-4 bg-slate-200 rounded-full w-full"></div>
                                <div className="h-4 bg-slate-200 rounded-full w-2/3"></div>
                                <p className="text-xs text-indigo-600 font-bold mt-6 flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
                                    Bác sĩ AI đang hội chẩn chuyên sâu và thiết kế phác đồ. Vui lòng không làm mới trang...
                                </p>
                            </div>
                        ) : (
                            <ReactMarkdown>{result.ai_nutrition_plan}</ReactMarkdown>
                        )}
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-3 print:hidden">
                        <button 
                            onClick={handleDownloadPDF}
                            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-900 text-slate-900 font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-colors active:scale-95"
                        >
                            <Printer size={16}/> In Bệnh án
                        </button>
                        
                        {(userRole === 'DOCTOR' || userRole === 'ADMIN') && (
                            <button 
                                onClick={() => toast.success("Đã lưu hồ sơ và gửi thông báo cho bệnh nhân thành công!")}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-black text-[11px] uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-colors active:scale-95 shadow-xl shadow-slate-900/10"
                            >
                                <Send size={16}/> Gửi cho Bệnh nhân
                            </button>
                        )}
                    </div>
                    </div>
                </div>

                {/* Cơ sở Khoa học & Tài liệu tham khảo (MDCalc Style) */}
                <div className="bg-slate-50 rounded-3xl border border-slate-200 shadow-sm p-8">
                    <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <FileText size={16} /> Cơ sở Khoa học & Tài liệu tham khảo (Evidence-Based)
                    </h3>
                    <div className="space-y-4 text-xs font-medium text-slate-600 leading-relaxed">
                        <p>
                            <strong className="text-slate-900">1. Nguồn Dữ liệu (Dataset):</strong> Hệ thống phân tích dựa trên bộ dữ liệu lâm sàng quy mô lớn <a href="https://www.cdc.gov/brfss/index.html" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">BRFSS 2015</a> (Behavioral Risk Factor Surveillance System) của Trung tâm Kiểm soát và Phòng ngừa Dịch bệnh Hoa Kỳ (CDC).
                        </p>
                        <p>
                            <strong className="text-slate-900">2. Thuật toán Mô hình hóa (Model Algorithm):</strong> Chỉ số nguy cơ Đái tháo đường Type 2 được tính toán bằng mô hình Học máy (Machine Learning) Gradient Boosting, tập trung vào 21 đặc trưng lâm sàng có trọng số ảnh hưởng lớn nhất (XAI SHAP Feature Importance).
                        </p>
                        <p>
                            <strong className="text-slate-900">3. Mục tiêu Lâm sàng:</strong> Các mốc mục tiêu điều trị (Huyết áp, Cholesterol) được trích xuất dựa trên Hướng dẫn Chăm sóc Y tế cho Bệnh nhân Đái tháo đường của Hiệp hội Đái tháo đường Hoa Kỳ (ADA).
                        </p>
                        <div className="mt-4 pt-4 border-t border-slate-200">
                            <p className="text-slate-500 italic">
                                <strong className="text-slate-700 not-italic">Disclaimer (Miễn trừ trách nhiệm):</strong> Công cụ này đóng vai trò Hỗ trợ Ra quyết định Lâm sàng (Clinical Decision Support). Kết quả dự đoán chỉ mang tính chất tham khảo nguy cơ dựa trên dữ liệu thống kê, KHÔNG thay thế chẩn đoán y khoa chính thức từ Bác sĩ chuyên khoa.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}