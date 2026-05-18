import React from 'react';
import { Stethoscope, MessageSquare } from 'lucide-react';
import DOMPurify from 'dompurify';

export default function PatientDoctorNote({ doctorNotes }) {
    if (!doctorNotes) return null;

    return (
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl">
            <div className="flex items-center gap-2.5 mb-4">
                <div className="bg-white/20 p-2 rounded-xl">
                    <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-black text-base">Nhận xét từ Bác sĩ</h3>
                    <p className="text-blue-200 text-xs font-medium">Ghi chú chuyên môn dành riêng cho bạn</p>
                </div>
            </div>

            <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                <div className="flex items-start gap-3">
                    <MessageSquare className="w-4 h-4 text-blue-200 mt-0.5 flex-shrink-0" />
                    <div 
                        className="text-sm text-white leading-relaxed prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(doctorNotes) }}
                    />
                </div>
            </div>
        </div>
    );
}
