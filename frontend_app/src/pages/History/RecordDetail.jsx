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
import Button from '../../components/ui/Button';

export default function RecordDetail() {
    const { recordId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [record, setRecord] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [doctorNotes, setDoctorNotes] = useState('');
    const [aiPlan, setAiPlan] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchRecord = async () => {
            try {
                const res = await api.get(`/records/${recordId}`);
                setRecord(res.data.data);
                if (res.data.data.doctor_notes) {
                    setDoctorNotes(res.data.data.doctor_notes);
                }
                if (res.data.data.ai_nutrition_plan) {
                    setAiPlan(res.data.data.ai_nutrition_plan);
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
            const res = await api.put(`/doctor/records/${recordId}/notes`, { 
                doctor_notes: doctorNotes,
                ai_nutrition_plan: aiPlan 
            });
            if (res.data.status === 'success') {
                toast.success("Đã lưu nhận xét lâm sàng và duyệt phác đồ!");
                setRecord({ ...record, doctor_notes: doctorNotes, ai_nutrition_plan: aiPlan });
            }
        } catch (error) {
            toast.error("Lỗi khi lưu nhận xét.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin w-8 h-8 text-outline" /></div>;

    const isDoctor = user?.role === 'DOCTOR' || user?.role === 'ADMIN';

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
            <button onClick={() => navigate(-1)} className="flex items-center text-xs font-bold uppercase tracking-wider text-on-surface-variant hover:text-on-surface transition-colors bg-surface-container-lowest px-4 py-2 rounded border border-outline-variant shadow-sm w-fit">
                <ArrowLeft size={16} className="mr-2" /> Quay lại
            </button>
            
            {/* Doctor Clinical Panel */}
            {isDoctor && (
                <div className="bg-surface-container-lowest border border-outline-variant rounded-lg shadow-sm flex flex-col overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-primary p-6 md:p-8 flex items-center gap-5 md:gap-6">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-surface-container-lowest rounded-full flex items-center justify-center shrink-0 p-1 shadow-inner relative overflow-hidden">
                            <div className="w-full h-full bg-surface-container-low rounded-full flex items-center justify-center border border-outline-variant">
                                <Stethoscope className="w-8 h-8 md:w-10 md:h-10 text-primary" strokeWidth={1.5} />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-on-primary uppercase tracking-tight">Bảng Điều Khiển Lâm Sàng</h2>
                            <p className="text-xs font-semibold text-on-primary uppercase tracking-wider mt-1 opacity-80">Khu vực dành riêng cho Bác sĩ điều trị</p>
                        </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="p-8 md:p-10 flex-1">
                        <div className="space-y-4">
                            <label className="block text-xs font-bold text-on-surface uppercase tracking-wider">Nhận xét & Chẩn đoán bổ sung</label>
                            <div className="bg-surface-container-lowest rounded [&_.ql-toolbar]:rounded-t [&_.ql-toolbar]:border-outline-variant [&_.ql-toolbar]:bg-surface-container-low [&_.ql-container]:rounded-b [&_.ql-container]:border-outline-variant [&_.ql-editor]:min-h-[250px] [&_.ql-editor]:text-sm [&_.ql-editor]:font-medium text-on-surface">
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

                            <div className="mt-8">
                                <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">Chỉnh sửa Phác đồ Lâm sàng (Hiển thị cho bệnh nhân)</label>
                                <textarea 
                                    className="w-full p-4 rounded border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm font-medium text-on-surface min-h-[250px] whitespace-pre-wrap bg-surface-container-lowest transition-colors"
                                    value={aiPlan}
                                    onChange={(e) => setAiPlan(e.target.value)}
                                    placeholder="Chỉnh sửa nội dung phác đồ do hệ thống tạo..."
                                />
                            </div>
                            
                            <div className="flex justify-end gap-3 mt-8">
                                <Button
                                    variant="ghost"
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
                                    className="flex items-center gap-2"
                                >
                                    📎 Đính kèm File
                                </Button>
                                
                                <Button 
                                    onClick={handleSaveNotes}
                                    disabled={isSaving}
                                    isLoading={isSaving}
                                    className="flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    Lưu & Duyệt Kết Quả
                                </Button>
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