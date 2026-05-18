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
                            <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">Clinical AI</h1>
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