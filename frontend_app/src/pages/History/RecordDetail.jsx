import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import AssessmentForm from '../Assessment/AssessmentForm';
import AIResults from '../Assessment/AIResults';
import { Loader2, ArrowLeft, Stethoscope, Save } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export default function RecordDetail() {
    const { recordId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [record, setRecord] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [doctorNotes, setDoctorNotes] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchRecord = async () => {
            try {
                const res = await api.get(`/records/${recordId}`);
                setRecord(res.data.data);
                if (res.data.data.doctor_notes) {
                    setDoctorNotes(res.data.data.doctor_notes);
                }
            } catch (err) {
                console.error("Lỗi lấy chi tiết:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRecord();
    }, [recordId]);

    const handleSaveNotes = async () => {
        setIsSaving(true);
        try {
            const res = await api.put(`/doctor/records/${recordId}/notes`, { doctor_notes: doctorNotes });
            if (res.data.status === 'success') {
                toast.success("Đã lưu nhận xét lâm sàng và duyệt phác đồ!");
                setRecord({ ...record, doctor_notes: doctorNotes });
            }
        } catch (error) {
            toast.error("Lỗi khi lưu nhận xét.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin w-8 h-8 text-slate-900" /></div>;

    const isDoctor = user?.role === 'DOCTOR' || user?.role === 'ADMIN';

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
            <button onClick={() => navigate(-1)} className="flex items-center text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm w-fit">
                <ArrowLeft size={16} className="mr-2" /> Quay lại
            </button>
            
            {/* Doctor Clinical Panel */}
            {isDoctor && (
                <div className="bg-white border border-slate-200 rounded-[2rem] shadow-xl shadow-slate-200/50 flex flex-col overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-slate-900 p-6 md:p-8 flex items-center gap-5 md:gap-6">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shrink-0 p-1 shadow-inner relative overflow-hidden">
                            <div className="w-full h-full bg-slate-50 rounded-full flex items-center justify-center border border-slate-200">
                                <Stethoscope className="w-8 h-8 md:w-10 md:h-10 text-slate-900" strokeWidth={1.5} />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Bảng Điều Khiển Lâm Sàng</h2>
                            <p className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Khu vực dành riêng cho Bác sĩ điều trị</p>
                        </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="p-8 md:p-10 flex-1">
                        <div className="space-y-4">
                            <label className="block text-[11px] font-bold text-slate-900 uppercase tracking-widest">Nhận xét & Chẩn đoán bổ sung</label>
                            <div className="bg-white rounded-xl [&_.ql-toolbar]:rounded-t-xl [&_.ql-toolbar]:border-slate-200 [&_.ql-toolbar]:bg-slate-50 [&_.ql-container]:rounded-b-xl [&_.ql-container]:border-slate-200 [&_.ql-editor]:min-h-[250px] [&_.ql-editor]:text-sm [&_.ql-editor]:font-medium">
                                <ReactQuill 
                                    bounds={'body'}
                                    theme="snow"
                                    value={doctorNotes}
                                    onChange={setDoctorNotes}
                                    modules={{
                                        toolbar: [
                                            [{ 'header': [1, 2, 3, false] }],
                                            ['bold', 'italic', 'underline', 'strike'],
                                            [{'list': 'ordered'}, {'list': 'bullet'}],
                                            ['link', 'image'],
                                            ['clean']
                                        ],
                                    }}
                                />
                            </div>
                            
                            <div className="flex justify-end gap-3 mt-8">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const input = document.createElement('input');
                                        input.type = 'file';
                                        input.onchange = async (e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;
                                            const uploadData = new FormData();
                                            uploadData.append('file', file);
                                            const toastId = toast.loading('Đang tải lên...');
                                            try {
                                                const res = await api.post('/upload', uploadData, {
                                                    headers: { 'Content-Type': 'multipart/form-data' }
                                                });
                                                if (res.data.status === 'success') {
                                                    const fileUrl = res.data.data.url;
                                                    const fileName = res.data.data.name;
                                                    setDoctorNotes(prev => prev + `\n<p><a href="${fileUrl}" target="_blank" rel="noopener noreferrer">📎 Đính kèm: ${fileName}</a></p>\n`);
                                                    toast.update(toastId, { render: "Đã đính kèm file!", type: "success", isLoading: false, autoClose: 2000 });
                                                }
                                            } catch (err) {
                                                toast.update(toastId, { render: "Lỗi tải file lên", type: "error", isLoading: false, autoClose: 3000 });
                                            }
                                        };
                                        input.click();
                                    }}
                                    className="px-6 py-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-black text-[11px] uppercase tracking-widest rounded-xl transition-colors flex items-center gap-2 shadow-sm active:scale-95"
                                >
                                    📎 Đính kèm File
                                </button>
                                
                                <button 
                                    onClick={handleSaveNotes}
                                    disabled={isSaving}
                                    className="px-8 py-4 bg-slate-900 text-white font-black text-[11px] uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-xl shadow-slate-900/10 active:scale-95 disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Lưu & Duyệt Kết Quả
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Assessment Input */}
            <AssessmentForm formData={record.health_indicators} readOnly={true} />
            
            {/* AI Results & Final Prescription */}
            <AIResults result={record} userRole={user?.role} />
        </div>
    );
}