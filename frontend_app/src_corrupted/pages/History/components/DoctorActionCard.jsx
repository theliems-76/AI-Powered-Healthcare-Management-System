import React, { useState, useContext } from 'react';
import { Stethoscope, Save, CheckCircle, Loader2, Edit3, X } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import DOMPurify from 'dompurify';
import api from '../../../services/api';
import { AuthContext } from '../../../context/AuthContext';
import { toast } from 'react-toastify';

export default function DoctorActionCard({ recordId, initialNotes }) {
    const { user } = useContext(AuthContext);
    const [notes, setNotes] = useState(initialNotes || '');
    const [isEditing, setIsEditing] = useState(!initialNotes);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(!!initialNotes);

    if (user?.role !== 'DOCTOR') return null;

    const handleSave = async () => {
        if (!notes.trim()) {
            toast.warning('Vui lòng nhập ghi chú trước khi lưu.');
            return;
        }
        setSaving(true);
        try {
            await api.put(`/doctor/records/${recordId}/notes`, { doctor_notes: notes });
            setSaved(true);
            setIsEditing(false);
            toast.success('Đã lưu ghi chú bác sĩ!');
        } catch (err) {
            toast.error('Lỗi lưu ghi chú. Vui lòng thử lại.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                    <div className="bg-white/20 p-2 rounded-xl">
                        <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-black text-base">Ghi chú Chuyên môn</h3>
                        <p className="text-blue-200 text-xs font-medium">Chỉ bác sĩ quản lý mới thấy mục này</p>
                    </div>
                </div>
                {saved && !isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-1.5 text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-xl transition"
                    >
                        <Edit3 className="w-3 h-3" /> Chỉnh sửa
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="space-y-3">
                    <div className="bg-white text-slate-800 rounded-xl overflow-hidden">
                        <ReactQuill 
                            theme="snow"
                            value={notes}
                            onChange={setNotes}
                            placeholder="Nhập nhận xét chuyên môn, có thể định dạng, thêm ảnh..."
                            className="h-48 pb-10"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 bg-white text-blue-700 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-50 transition active:scale-95 disabled:opacity-60"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {saving ? 'Đang lưu...' : 'Lưu ghi chú'}
                        </button>
                        {saved && (
                            <button
                                onClick={() => { setNotes(initialNotes); setIsEditing(false); }}
                                className="flex items-center gap-1.5 text-sm font-bold bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-xl transition"
                            >
                                <X className="w-4 h-4" /> Hủy
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                    <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-300 mt-0.5 flex-shrink-0" />
                        <div 
                            className="text-sm text-white leading-relaxed prose prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(notes) }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
