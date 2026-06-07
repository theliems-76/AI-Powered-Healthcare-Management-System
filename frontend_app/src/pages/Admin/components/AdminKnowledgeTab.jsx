import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import { UploadCloud, FileText, Trash2, CheckCircle2, Clock, XCircle, FileType } from 'lucide-react';

export default function AdminKnowledgeTab() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/knowledge');
            setDocuments(res.data.data);
        } catch (error) {
            toast.error("Lỗi lấy danh sách tài liệu RAG!");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
        // Cập nhật trạng thái sau mỗi 10 giây nếu có file đang PROCESSING
        const interval = setInterval(() => {
            setDocuments(prev => {
                const hasProcessing = prev.some(d => d.status === 'PROCESSING');
                if (hasProcessing) {
                    fetchDocuments();
                }
                return prev;
            });
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf' && file.type !== 'text/plain') {
            return toast.error("Chỉ chấp nhận file PDF hoặc TXT!");
        }

        if (file.size > 10 * 1024 * 1024) {
            return toast.error("File không được vượt quá 10MB!");
        }

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            const res = await api.post('/admin/knowledge/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success(res.data.message);
            // Thêm tạm vào UI
            setDocuments([res.data.document, ...documents]);
        } catch (error) {
            toast.error(error.response?.data?.error || "Lỗi upload tài liệu!");
        } finally {
            setUploading(false);
            e.target.value = ''; // Reset input
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa tài liệu này? (Lưu ý: Vector trong bộ nhớ AI hiện tại sẽ không bị xóa ngay lập tức)")) return;
        
        try {
            await api.delete(`/admin/knowledge/${id}`);
            toast.success("Đã xóa tài liệu khỏi danh sách!");
            setDocuments(documents.filter(d => d.id !== id));
        } catch (error) {
            toast.error("Lỗi xóa tài liệu!");
        }
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <UploadCloud className="w-6 h-6 text-slate-700" />
                            Cơ sở Tri thức Hệ thống
                        </h2>
                        <p className="text-sm text-slate-500 mt-2 max-w-2xl">
                            Tải lên các tài liệu y khoa (PDF, TXT) để bổ sung kiến thức. Dữ liệu sẽ được tự động phân tích và trích xuất để làm cơ sở tham chiếu chuẩn mực cho hệ thống tư vấn.
                        </p>
                    </div>
                    
                    <div className="shrink-0 flex flex-col items-start md:items-end">
                        <label className={`inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold cursor-pointer transition-colors shadow-sm ${uploading ? 'opacity-70 pointer-events-none' : ''}`}>
                            {uploading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Đang xử lý dữ liệu...
                                </>
                            ) : (
                                <>
                                    <UploadCloud className="w-5 h-5" />
                                    Tải lên tài liệu
                                </>
                            )}
                            <input 
                                type="file" 
                                className="hidden" 
                                accept=".pdf,.txt" 
                                onChange={handleFileUpload}
                                disabled={uploading}
                            />
                        </label>
                        <p className="text-xs text-slate-400 mt-3 font-medium">Hỗ trợ PDF, TXT (Tối đa 10MB)</p>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800 uppercase tracking-wide text-sm flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-500" />
                        Danh sách Tài liệu
                    </h3>
                    <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                        {documents.length} File
                    </span>
                </div>
                
                {loading && documents.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">
                        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        Đang tải danh sách...
                    </div>
                ) : documents.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 flex flex-col items-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <FileType className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="font-medium">Chưa có tài liệu nào.</p>
                        <p className="text-sm mt-1">Hãy tải lên Phác đồ điều trị hoặc Hướng dẫn dinh dưỡng.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 font-bold tracking-wider">Tên tài liệu</th>
                                    <th className="px-6 py-4 font-bold tracking-wider">Loại</th>
                                    <th className="px-6 py-4 font-bold tracking-wider">Trạng thái AI</th>
                                    <th className="px-6 py-4 font-bold tracking-wider">Ngày tải lên</th>
                                    <th className="px-6 py-4 font-bold tracking-wider text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {documents.map(doc => (
                                    <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${doc.file_type === 'application/pdf' ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'}`}>
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <span className="truncate max-w-[250px]" title={doc.original_name}>
                                                {doc.original_name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-bold px-2 py-1 rounded bg-slate-100 text-slate-600">
                                                {doc.file_type === 'application/pdf' ? 'PDF' : 'TXT'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {doc.status === 'COMPLETED' && (
                                                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                                                    <CheckCircle2 className="w-3.5 h-3.5" /> Đã ghi nhớ
                                                </span>
                                            )}
                                            {doc.status === 'PROCESSING' && (
                                                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100">
                                                    <Clock className="w-3.5 h-3.5 animate-spin" /> Đang học...
                                                </span>
                                            )}
                                            {doc.status === 'FAILED' && (
                                                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
                                                    <XCircle className="w-3.5 h-3.5" /> Lỗi đọc file
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-xs">
                                            {new Date(doc.createdAt).toLocaleString('vi-VN')}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => handleDelete(doc.id)}
                                                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                                title="Xóa tài liệu"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
