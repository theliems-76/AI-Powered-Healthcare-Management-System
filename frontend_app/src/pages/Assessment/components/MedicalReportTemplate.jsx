import React, { forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Activity } from 'lucide-react';

const MedicalReportTemplate = forwardRef(({ result }, ref) => {
    if (!result) return null;
    
    const riskScore = parseFloat(result.ai_risk_score || result.risk_probability || 0);
    const date = new Date().toLocaleDateString('vi-VN', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });

    return (
        <div ref={ref} className="bg-white text-slate-900 w-full font-sans" style={{ fontFamily: "'Inter', 'Roboto', 'Arial', sans-serif" }}>
            
            <style type="text/css" media="print">
                {`
                    @page { 
                        size: A4 portrait; 
                        margin: 20mm; 
                    }
                    body { 
                        -webkit-print-color-adjust: exact !important; 
                        print-color-adjust: exact !important; 
                        font-family: 'Inter', 'Roboto', 'Arial', sans-serif !important; 
                    }
                `}
            </style>

            <div className="p-8 print:p-0">
                
                {}
                <div className="flex justify-between items-center border-b-2 border-slate-200 pb-5 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center print:bg-blue-600">
                            <Activity className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">Clinical AI System</h1>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Hệ sinh thái Dự báo Sức khỏe</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wider">Báo Cáo Phân Tích</h2>
                        <p className="text-xs text-slate-500 font-medium mt-1">Ngày xuất: {date}</p>
                    </div>
                </div>

                {}

                {}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8 flex justify-between items-center print:bg-slate-50 print:break-inside-avoid">
                    <div>
                        <h3 className="text-sm font-bold text-slate-500 uppercase mb-1">Kết luận từ AI</h3>
                        <p className="text-xl font-black text-rose-600 print:text-rose-600 uppercase">{result.ai_diagnosis}</p>
                    </div>
                    <div className="text-right border-l border-slate-200 pl-6">
                        <h3 className="text-sm font-bold text-slate-500 uppercase mb-1">Tỷ lệ Rủi ro</h3>
                        <p className="text-3xl font-black text-slate-900">{riskScore}%</p>
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
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 print:bg-amber-50">
                        <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">⚠️ Tuyên bố miễn trừ trách nhiệm Y khoa:</p>
                        <p className="text-xs text-amber-700 leading-relaxed text-justify">
                            Báo cáo này được tự động tạo bởi Trí tuệ nhân tạo (AI) dựa trên các chỉ số bạn nhập vào hệ thống. 
                            Nội dung này <strong>chỉ mang tính chất tham khảo</strong>, dự báo và hỗ trợ quản lý sức khỏe cá nhân. 
                            Nó <strong>không thể thay thế</strong> cho việc chẩn đoán, tư vấn, hoặc phác đồ điều trị chính thức từ bác sĩ chuyên môn. 
                            Vui lòng mang báo cáo này đến cơ sở y tế gần nhất để được thăm khám nếu tỷ lệ rủi ro ở mức cao.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
});

export default MedicalReportTemplate;