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
        if (score <= 33) return { label: 'Rủi ro thấp', color: 'text-emerald-700', bg: 'bg-emerald-100', icon: '🟢' };
        if (score <= 66) return { label: 'Nguy cơ tiền tiểu đường', color: 'text-amber-700', bg: 'bg-amber-100', icon: '🟡' };
        return { label: 'Báo động đỏ', color: 'text-rose-700', bg: 'bg-rose-100', icon: '🔴' };
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
                <div className="relative overflow-hidden bg-white p-8 md:p-10 rounded-[2rem] border border-slate-200 shadow-xl">
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                        <div className="text-center md:text-left flex-1">
                            <span className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-extrabold tracking-widest uppercase mb-4 inline-block">AI Diagnostic Report</span>
                            <h2 className={`text-4xl md:text-5xl font-extrabold tracking-tighter mb-4 font-[Manrope] ${riskInfo.color.replace('text-', 'text-')}`}>
                                {riskInfo.label}
                            </h2>
                            <p className="text-slate-500 font-medium leading-relaxed max-w-lg">
                                {result.ai_diagnosis}
                            </p>
                        </div>
                        
                        {}
                        <div className="w-full md:w-80 bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-inner flex flex-col items-center">
                            <div className="text-6xl font-black text-slate-800 tracking-tighter">{riskScore}%</div>
                            <div className={`mt-2 px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider ${riskInfo.bg} ${riskInfo.color}`}>
                                {riskInfo.icon} {riskInfo.label}
                            </div>

                            <div className="relative w-full h-3 bg-slate-200 rounded-full mt-8 overflow-visible">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500"></div>
                                <div className="absolute top-0 h-full w-px bg-white/50 left-[33%]"></div>
                                <div className="absolute top-0 h-full w-px bg-white/50 left-[66%]"></div>
                                <div 
                                    className="absolute top-1/2 -translate-y-1/2 w-4 h-8 bg-slate-800 rounded-full border-2 border-white shadow-md transition-all duration-1000 ease-out z-10"
                                    style={{ left: `calc(${riskScore}% - 8px)` }}
                                ></div>
                            </div>
                            <div className="flex justify-between w-full mt-3 text-[10px] font-bold text-slate-400">
                                <span>0%</span><span>33%</span><span>66%</span><span>100%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {}
                {result.ai_explanation && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {}
                        <div className="bg-rose-50 p-8 rounded-3xl border border-rose-100 shadow-sm">
                            <div className="flex items-center space-x-3 mb-6">
                                <AlertTriangle className="text-rose-600 w-8 h-8" />
                                <Tooltip text="Các yếu tố đẩy % rủi ro mắc bệnh LÊN CAO.">
                                    <h3 className="text-xl font-extrabold text-rose-900">Yếu tố Cảnh báo</h3>
                                </Tooltip>
                            </div>
                            <ul className="space-y-4">
                                {result.ai_explanation.warning_factors?.map((factor, idx) => (
                                    <li key={idx} className="flex items-center bg-white p-4 rounded-xl shadow-sm border border-rose-50">
                                        <span className="text-rose-600 font-black text-lg w-16">+{factor.contribution.toFixed(1)}%</span>
                                        <p className="font-bold text-slate-700 text-lg">{factor.feature}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {}
                        <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100 shadow-sm">
                            <div className="flex items-center space-x-3 mb-6">
                                <ShieldCheck className="text-emerald-600 w-8 h-8" />
                                <Tooltip text="Các thói quen tốt giúp KÉO GIẢM rủi ro mắc bệnh.">
                                    <h3 className="text-xl font-extrabold text-emerald-900">Yếu tố Bảo vệ</h3>
                                </Tooltip>
                            </div>
                            <ul className="space-y-4">
                                {result.ai_explanation.good_factors?.map((factor, idx) => (
                                    <li key={idx} className="flex items-center bg-white p-4 rounded-xl shadow-sm border border-emerald-50">
                                        <span className="text-emerald-600 font-black text-lg w-16">-{Math.abs(factor.contribution).toFixed(1)}%</span>
                                        <p className="font-bold text-slate-700 text-lg">{factor.feature}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {}
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl">
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="w-14 h-14 bg-blue-600 flex items-center justify-center rounded-2xl text-white shadow-lg shadow-blue-600/30">
                            <FileText size={28} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-extrabold tracking-tight text-slate-800">Phác đồ Điều trị & Dinh dưỡng</h3>
                            <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mt-1">Generative AI Nutritionist</p>
                        </div>
                    </div>
                    
                    <div className="prose prose-blue prose-headings:text-slate-800 prose-headings:font-bold prose-p:text-slate-600 prose-a:text-blue-600 prose-li:text-slate-600 prose-strong:text-slate-800 max-w-none leading-relaxed border-l-4 border-slate-200 pl-6 py-2">
                        <ReactMarkdown>{result.ai_nutrition_plan}</ReactMarkdown>
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 print:hidden">
                        <div className="flex space-x-4 w-full md:w-auto">
                            <button 
                                onClick={handleDownloadPDF}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 border-2 border-slate-200 text-slate-600 font-bold rounded-full hover:bg-slate-50 transition-colors active:scale-95"
                            >
                                <Printer size={18}/> Tải PDF Báo Cáo
                            </button>
                            
                            {(userRole === 'DOCTOR' || userRole === 'ADMIN') && (
                                <button 
                                    onClick={() => toast.success("Đã lưu hồ sơ và gửi thông báo cho bệnh nhân thành công!")}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-full shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all active:scale-95"
                                >
                                    <Send size={18}/> Lưu & Gửi Bệnh nhân
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}