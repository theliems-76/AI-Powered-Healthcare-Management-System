import React, { forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';
import Logo from '../../../components/ui/Logo';

const MedicalReportTemplate = forwardRef(({ result }, ref) => {
    if (!result) return null;
    
    const riskScore = parseFloat(result.ai_risk_score || result.risk_probability || 0);
    const date = new Date().toLocaleDateString('vi-VN', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });

    const mapFeatureToSuperCategory = (featureName) => {
        const f = featureName.toLowerCase();
        if (f.includes('hút thuốc') || f.includes('rượu') || f.includes('thể dục') || f.includes('vận động') || 
            f.includes('trái cây') || f.includes('rau')) {
            return 'Ngoại lai';
        }
        return 'Nội tại';
    };

    const getBioLevel = (burden) => {
        if (burden <= 0.1) return 0;
        if (burden <= 0.6) return 1;
        if (burden <= 1.5) return 2;
        return 3;
    };

    const getLifeLevel = (burden) => {
        if (burden <= 0.01) return 0;
        if (burden <= 0.04) return 1;
        if (burden <= 0.08) return 2;
        return 3;
    };

    let bioBurden = 0;
    let lifeBurden = 0;

    let factorsToProcess = [];
    if (result.ai_explanation?.all_factors) {
        factorsToProcess = result.ai_explanation.all_factors.map(f => ({
            ...f,
            isWarning: f.contribution > 0
        }));
    } else if (result.ai_explanation) {
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

        if (cat === 'Ngoại lai' && impact > 0) {
            const fLower = f.feature.toLowerCase();
            if (fLower.includes('hút thuốc') && indicators.Smoker === 0) impact = 0;
            if (fLower.includes('rượu') && indicators.HvyAlcoholConsump === 0) impact = 0;
            if (fLower.includes('thể dục') && indicators.PhysActivity === 1) impact = 0;
            if (fLower.includes('trái cây') && indicators.Fruits === 1) impact = 0;
            if (fLower.includes('rau') && indicators.Veggies === 1) impact = 0;
        }

        if (cat === 'Nội tại') {
            if (impact > 0) bioBurden += impact;
        } else {
            if (impact > 0) lifeBurden += impact;
        }
    });

    
    let clinicalLifePenalty = 0;
    if (indicators.Smoker === 1) clinicalLifePenalty += 0.05;
    if (indicators.PhysActivity === 0) clinicalLifePenalty += 0.03;
    if (indicators.HvyAlcoholConsump === 1) clinicalLifePenalty += 0.04;
    if (indicators.Fruits === 0) clinicalLifePenalty += 0.01;
    if (indicators.Veggies === 0) clinicalLifePenalty += 0.01;

    if (clinicalLifePenalty > lifeBurden) {
        lifeBurden = clinicalLifePenalty;
    }

    const bioIdx = getBioLevel(bioBurden);
    const lifeIdx = getLifeLevel(lifeBurden);

    return (
        <div ref={ref} className="bg-white text-slate-900 w-full font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            
            <style type="text/css" media="print">
                {`
                    @page { 
                        size: A4 portrait; 
                        margin: 20mm; 
                    }
                    body { 
                        -webkit-print-color-adjust: exact !important; 
                        print-color-adjust: exact !important; 
                        font-family: 'Plus Jakarta Sans', sans-serif !important; 
                    }
                `}
            </style>

            <div className="p-8 print:p-0">
                
                {/* Header Section */}
                <div className="flex justify-between items-center border-b border-slate-200 pb-6 mb-8">
                    <div className="flex items-center gap-3">
                        <Logo className="w-10 h-10" />
                        <div>
                            <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">Hiệp Sĩ Tiểu Đường</h1>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Hồ sơ Y tế Điện tử</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wider">Báo Cáo Phân Tích</h2>
                        <p className="text-xs text-slate-500 font-medium mt-1">Ngày xuất: {date}</p>
                    </div>
                </div>

                {}

                {}
                {/* Diagnosis Summary Box */}
                <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 mb-8 flex justify-between items-center print:bg-slate-50 print:break-inside-avoid">
                    <div>
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Kết luận Lâm sàng (AI)</h3>
                        <p className="text-xl font-black text-slate-900 uppercase">{result.ai_diagnosis}</p>
                    </div>
                    <div className="text-right border-l border-slate-200 pl-6">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Chỉ số Rủi ro</h3>
                        <div className="flex items-baseline gap-1 justify-end">
                            <span className="text-4xl font-black text-slate-900 tracking-tighter">{riskScore}</span>
                            <span className="text-lg font-bold text-slate-400">%</span>
                        </div>
                    </div>
                </div>

                {/* Biểu đồ Ma trận */}
                <div className="mb-8 print:break-inside-avoid">
                    <h3 className="text-sm font-bold text-slate-800 uppercase border-b border-slate-200 pb-2 mb-4">Ma trận Rủi ro Lâm sàng</h3>
                    
                    <div className="border-2 border-slate-900 rounded-xl overflow-hidden shadow-sm bg-white">
                        <div className="grid grid-cols-[150px_1fr] text-center border-b border-slate-200 bg-slate-50">
                            <div className="border-r-2 border-slate-900 bg-slate-100"></div>
                            <div className="py-2 text-[10px] font-black uppercase tracking-widest text-slate-800">
                                Mức độ Hành vi, Lối sống & Xã hội (Trục X)
                            </div>
                        </div>
                        <div className="grid grid-cols-[150px_1fr_1fr_1fr_1fr] text-[9px] font-black uppercase text-center bg-slate-50 border-b-2 border-slate-900">
                            <div className="p-2 flex items-center justify-center border-r-2 border-slate-900 bg-slate-100">
                                <span className="rotate-180" style={{ writingMode: 'vertical-rl' }}>Nội tại (Trục Y)</span>
                            </div>
                            <div className="p-2 border-r border-slate-200 flex flex-col justify-center">Lành mạnh<br/><span className="text-slate-400 text-[8px]">Tốt ưu</span></div>
                            <div className="p-2 border-r border-slate-200 flex flex-col justify-center">Cần cải thiện<br/><span className="text-slate-400 text-[8px]">Theo dõi</span></div>
                            <div className="p-2 border-r border-slate-200 flex flex-col justify-center">Rủi ro<br/><span className="text-slate-400 text-[8px]">Cảnh báo</span></div>
                            <div className="p-2 flex flex-col justify-center">Báo động<br/><span className="text-slate-400 text-[8px]">Nguy hiểm</span></div>
                        </div>
                        {['Ổn định', 'Suy giảm nhẹ', 'Suy giảm', 'Báo động'].map((yLabel, y) => (
                            <div key={y} className="grid grid-cols-[150px_1fr_1fr_1fr_1fr] text-[10px] text-center border-b border-slate-200 last:border-b-0">
                                <div className="p-2 font-bold uppercase border-r-2 border-slate-900 flex items-center justify-center bg-slate-50">{yLabel}</div>
                                {[0, 1, 2, 3].map(x => {
                                    const isPatientHere = x === lifeIdx && y === bioIdx;
                                    const colors = [
                                        ['bg-[#22c55e]', 'bg-[#22c55e]', 'bg-[#fde047]', 'bg-[#f97316]'],
                                        ['bg-[#22c55e]', 'bg-[#fde047]', 'bg-[#f97316]', 'bg-[#ef4444]'],
                                        ['bg-[#fde047]', 'bg-[#f97316]', 'bg-[#ef4444]', 'bg-[#ef4444]'],
                                        ['bg-[#f97316]', 'bg-[#ef4444]', 'bg-[#ef4444]', 'bg-[#dc2626]']
                                    ];
                                    const bgClass = colors[y][x];
                                    return (
                                        <div key={x} className={`relative h-14 border-r border-slate-200 last:border-r-0 print:border-white ${bgClass} !print-color-adjust-exact`}>
                                            {isPatientHere && (
                                                <div className="absolute inset-0 m-auto w-24 h-6 bg-slate-900 rounded-lg flex items-center justify-center shadow-md print:bg-slate-900 !print-color-adjust-exact border border-white">
                                                    <span className="text-[9px] font-black text-white uppercase tracking-wider">📍 Bệnh nhân</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                {}
                <div className="mb-4">
                    <h3 className="text-sm font-bold text-slate-800 uppercase border-b border-slate-200 pb-2 mb-4">Chi tiết Phân tích</h3>
                    
                    <div className="prose prose-sm prose-slate max-w-none leading-relaxed prose-headings:text-slate-900 prose-headings:font-bold prose-strong:text-slate-900 text-justify">
                        <ReactMarkdown>
                            {result.ai_nutrition_plan}
                        </ReactMarkdown>
                    </div>
                </div>

                {}
                <div className="mt-12 pt-6 border-t border-slate-200 print:break-inside-avoid">
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 print:bg-slate-50">
                        <p className="text-[10px] font-bold text-slate-800 uppercase tracking-widest mb-2">Miễn trừ trách nhiệm Y khoa:</p>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                            Báo cáo này được tự động tạo bởi Trí tuệ nhân tạo (AI) dựa trên các chỉ số bạn nhập vào hệ thống. 
                            Nội dung này mang tính chất tham khảo, dự báo và hỗ trợ quản lý sức khỏe cá nhân. 
                            Nó không thay thế chẩn đoán, tư vấn, hoặc phác đồ điều trị từ chuyên gia y tế.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
});

export default MedicalReportTemplate;