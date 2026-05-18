import React, { useRef } from 'react';
import { AlertTriangle, ShieldCheck, FileText, Printer, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Tooltip from '../../components/ui/Tooltip';
import { toast } from 'react-toastify';
import { useReactToPrint } from 'react-to-print';
import MedicalReportTemplate from './components/MedicalReportTemplate';

export default function AIResults({ result, userRole }) {
    const componentRef = useRef();

   const handleDownloadPDF = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Clinical_AI_Report_${new Date().toISOString().split('T')[0]}`,
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

                {}
                {result.ai_explanation && (
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                            {/* Yếu tố Cảnh báo */}
                            <div className="p-8">
                                <h3 className="text-[11px] font-bold text-rose-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-rose-500"></span> Yếu tố Cảnh báo (Làm tăng rủi ro)
                                </h3>
                                <ul className="space-y-4">
                                    {result.ai_explanation.warning_factors?.map((factor, idx) => (
                                        <li key={idx} className="flex items-start justify-between border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                                            <p className="font-bold text-slate-700 text-sm pr-4">{factor.feature}</p>
                                            <span className="text-rose-600 font-black text-sm shrink-0">+{factor.contribution.toFixed(1)}%</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Yếu tố Bảo vệ */}
                            <div className="p-8">
                                <h3 className="text-[11px] font-bold text-emerald-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Yếu tố Bảo vệ (Làm giảm rủi ro)
                                </h3>
                                <ul className="space-y-4">
                                    {result.ai_explanation.good_factors?.map((factor, idx) => (
                                        <li key={idx} className="flex items-start justify-between border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                                            <p className="font-bold text-slate-700 text-sm pr-4">{factor.feature}</p>
                                            <span className="text-emerald-600 font-black text-sm shrink-0">-{Math.abs(factor.contribution).toFixed(1)}%</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10">
                    <div className="mb-8 pb-6 border-b border-slate-100">
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2">Phác đồ Cá nhân hóa</p>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Kế hoạch Điều trị & Dinh dưỡng</h3>
                    </div>
                    
                    <div className="prose prose-slate max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-blue-600 prose-p:font-medium prose-p:text-slate-600 text-sm">
                        <ReactMarkdown>{result.ai_nutrition_plan}</ReactMarkdown>
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-3 print:hidden">
                        <button 
                            onClick={handleDownloadPDF}
                            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors active:scale-95"
                        >
                            <Printer size={16}/> In Bệnh án
                        </button>
                        
                        {(userRole === 'DOCTOR' || userRole === 'ADMIN') && (
                            <button 
                                onClick={() => toast.success("Đã lưu hồ sơ và gửi thông báo cho bệnh nhân thành công!")}
                                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition-colors active:scale-95"
                            >
                                <Send size={16}/> Gửi cho Bệnh nhân
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}