import React from 'react';
import { Stethoscope, MessageSquare } from 'lucide-react';
import DOMPurify from 'dompurify';

export default function PatientDoctorNote({ doctorNotes }) {
    if (!doctorNotes) return null;

    return (
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden relative">
            {/* Header Section */}
            <div className="bg-slate-900 p-6 md:p-8 flex items-center gap-5 md:gap-6">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shrink-0 p-1 shadow-inner relative overflow-hidden">
                    <div className="w-full h-full bg-slate-50 rounded-full flex items-center justify-center border border-slate-200">
                        <Stethoscope className="w-8 h-8 md:w-10 md:h-10 text-slate-900" strokeWidth={1.5} />
                    </div>
                </div>
                <div>
                    <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Chỉ định từ Bác sĩ</h3>
                    <p className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Nhận xét lâm sàng & Điều chỉnh phác đồ</p>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-8 md:p-10 bg-white">
                <div 
                    className="prose prose-slate prose-headings:font-black prose-p:font-medium max-w-none text-slate-800 text-sm md:text-base leading-relaxed [&_a]:text-indigo-600 [&_a]:underline"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(doctorNotes, { ADD_ATTR: ['target'] }).replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ') }}
                />
            </div>
        </div>
    );
}
