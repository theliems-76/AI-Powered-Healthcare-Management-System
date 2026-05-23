import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import { Send, Loader2, Clock } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export default function AdminNotificationsTab() {
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        targetRoles: ['ALL'],
        type: 'SYSTEM'
    });

    const quillRef = React.useRef(null);

    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    const quill = quillRef.current.getEditor();
                    const range = quill.getSelection(true);
                    quill.insertEmbed(range.index, 'image', reader.result);
                    quill.setSelection(range.index + 1);
                };
                reader.readAsDataURL(file);
            }
        };
    };

    const quillModules = React.useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{'list': 'ordered'}, {'list': 'bullet'}],
                [{ 'color': [] }, { 'background': [] }],
                ['link', 'image'],
                ['clean']
            ],
            handlers: {
                image: imageHandler
            }
        }
    }), []);

    const fetchHistory = async () => {
        try {
            const res = await api.get('/admin/logs?action=BROADCAST_NOTIFICATION&limit=5');
            setHistory(res.data.data);
        } catch (error) {
            console.error('Lỗi lấy lịch sử:', error);
        } finally {
            setHistoryLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/admin/notifications/broadcast', formData);
            toast.success(res.data.message || 'Đã gửi thông báo thành công!');
            setFormData({ ...formData, title: '', message: '' });
            fetchHistory();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Lỗi gửi thông báo!');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleToggle = (role) => {
        let newRoles = [...formData.targetRoles];
        if (role === 'ALL') {
            newRoles = ['ALL'];
        } else {
            newRoles = newRoles.filter(r => r !== 'ALL');
            if (newRoles.includes(role)) {
                newRoles = newRoles.filter(r => r !== role);
            } else {
                newRoles.push(role);
            }
            if (newRoles.length === 0) newRoles = ['ALL'];
        }
        setFormData({ ...formData, targetRoles: newRoles });
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100 animate-in slide-in-from-right-4 duration-300">
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-amber-400 to-orange-500 shadow-sm"></div>
                            <h2 className="text-base font-bold text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                Phát Sóng Thông Báo
                            </h2>
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Gửi thông điệp quan trọng tới toàn bộ hệ thống.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Đối Tượng Nhận</label>
                            <div className="flex flex-wrap gap-2">
                                {['ALL', 'DOCTOR', 'PATIENT'].map(role => {
                                    const isSelected = formData.targetRoles.includes(role);
                                    const label = role === 'ALL' ? 'Tất cả' : (role === 'DOCTOR' ? 'Bác sĩ' : 'Bệnh nhân');
                                    return (
                                        <button
                                            type="button"
                                            key={role}
                                            onClick={() => handleRoleToggle(role)}
                                            className={`px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 ${
                                                isSelected 
                                                ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10' 
                                                : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200'
                                            }`}
                                        >
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Phân Loại</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-sm"
                            >
                                <option value="SYSTEM">Hệ thống (Bảo trì, Update)</option>
                                <option value="ALERT">Cảnh báo Khẩn cấp</option>
                                <option value="INFO">Tin tức / Kiến thức</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Tiêu đề</label>
                        <input
                            type="text"
                            required
                            placeholder="VD: HỆ THỐNG SẼ BẢO TRÌ VÀO LÚC 12H ĐÊM NAY..."
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold uppercase tracking-wider text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-sm transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Nội dung chi tiết (Có thể chèn ảnh, định dạng)</label>
                        <div className="bg-white rounded-xl focus-within:ring-1 focus-within:ring-amber-500 transition-all [&_.ql-toolbar]:rounded-t-xl [&_.ql-toolbar]:border-slate-200 [&_.ql-toolbar]:bg-slate-50 [&_.ql-container]:rounded-b-xl [&_.ql-container]:border-slate-200 [&_.ql-editor]:min-h-[250px] [&_.ql-editor]:text-sm [&_.ql-editor]:font-medium">
                            <ReactQuill 
                                bounds={'body'}
                                ref={quillRef}
                                theme="snow"
                                value={formData.message}
                                onChange={(content) => setFormData({ ...formData, message: content })}
                                modules={quillModules}
                                placeholder="Soạn thảo thông báo chuyên nghiệp tại đây..."
                            />
                        </div>
                    </div>

                    <div className="pt-2 flex justify-start gap-3">
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
                                            
                                            const quill = quillRef.current.getEditor();
                                            const range = quill.getSelection(true) || { index: quill.getLength() };
                                            
                                            quill.insertText(range.index, `\n📎 Đính kèm: ${fileName}\n`, 'link', fileUrl);
                                            quill.setSelection(range.index + fileName.length + 14);
                                            toast.update(toastId, { render: "Đã đính kèm file!", type: "success", isLoading: false, autoClose: 2000 });
                                        }
                                    } catch (err) {
                                        toast.update(toastId, { render: "Lỗi tải file lên", type: "error", isLoading: false, autoClose: 3000 });
                                    }
                                };
                                input.click();
                            }}
                            className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-sm active:scale-95"
                        >
                            📎 Đính kèm File
                        </button>

                        <button
                            type="submit"
                            disabled={loading || !formData.title || !formData.message || formData.message === '<p><br></p>'}
                            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-amber-500/20 active:scale-95"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                            {loading ? 'Đang gửi...' : 'Phát Sóng Ngay'}
                        </button>
                    </div>
                </form>
            </div>

            {/* History Section */}
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100 animate-in slide-in-from-right-4 duration-300 delay-100">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
                        <Clock className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Lịch sử phát sóng gần đây</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">5 thông báo mới nhất</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {historyLoading ? (
                        <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-amber-500" /></div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-8 text-sm font-bold text-slate-400">Chưa có lịch sử phát sóng.</div>
                    ) : (
                        history.map(log => {
                            let details = {};
                            try { details = JSON.parse(log.details); } catch(e) {}
                            return (
                                <div key={log.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-amber-200 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-sm font-bold text-slate-900">{details.title || 'Thông báo không tên'}</h4>
                                        <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-200">
                                            {new Date(log.createdAt).toLocaleString('vi-VN')}
                                        </span>
                                    </div>
                                    <div 
                                        className="text-xs font-medium text-slate-500 mb-3 line-clamp-3 prose prose-sm max-w-none"
                                        dangerouslySetInnerHTML={{ __html: details.message }}
                                    />
                                    <div className="flex gap-2">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                                            Loại: {details.type}
                                        </span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                                            Đối tượng: {(details.targetRoles || []).join(', ')}
                                        </span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                                            Đã gửi: {details.count || 0} người
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
