import React, { useState, useEffect } from 'react';
import { Search, Filter, ShieldAlert, Loader2, FileText, User as UserIcon } from 'lucide-react';
import api from '../../../services/api';
import AdminPagination from './AdminPagination';

export default function AuditLogsTab() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [actionFilter, setActionFilter] = useState('ALL');
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

    const fetchLogs = async (page = 1) => {
        setLoading(true);
        try {
            const res = await api.get('/admin/logs', {
                params: { page, limit: 10, search, action: actionFilter }
            });
            setLogs(res.data.data);
            setPagination(res.data.pagination);
        } catch (error) {
            console.error('Lỗi lấy logs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [actionFilter]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchLogs(1);
    };

    const formatAction = (action) => {
        switch (action) {
            case 'VIEW_RECORD_DETAIL': return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-bold">XEM HỒ SƠ</span>;
            case 'UPDATE_DOCTOR_NOTES': return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-xs font-bold">CẬP NHẬT GHI CHÚ</span>;
            default: return <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-bold">{action}</span>;
        }
    };

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-indigo-600" /> Nhật ký Bảo mật (Audit Logs)
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Giám sát mọi truy cập và thay đổi dữ liệu nhạy cảm.</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <form onSubmit={handleSearch} className="flex-1 relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Tìm theo email, tên, IP..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </form>
                <div className="flex gap-2">
                    <select
                        value={actionFilter}
                        onChange={(e) => setActionFilter(e.target.value)}
                        className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="ALL">Tất cả hành động</option>
                        <option value="VIEW_RECORD_DETAIL">Xem Hồ sơ</option>
                        <option value="UPDATE_DOCTOR_NOTES">Cập nhật Ghi chú</option>
                    </select>
                    <button onClick={() => fetchLogs(1)} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition">
                        Lọc
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Thời gian</th>
                                <th className="px-6 py-4">Người thực hiện</th>
                                <th className="px-6 py-4">Hành động</th>
                                <th className="px-6 py-4">IP Address</th>
                                <th className="px-6 py-4">Chi tiết (JSON)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {logs.length > 0 ? logs.map(log => (
                                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-700">
                                        {new Date(log.createdAt).toLocaleString('vi-VN')}
                                    </td>
                                    <td className="px-6 py-4">
                                        {log.User ? (
                                            <div>
                                                <p className="font-bold text-slate-800">{log.User.full_name}</p>
                                                <p className="text-xs text-slate-500">{log.User.email}</p>
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 italic">Hệ thống</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">{formatAction(log.action)}</td>
                                    <td className="px-6 py-4 text-xs font-mono text-slate-500">{log.ip_address || 'N/A'}</td>
                                    <td className="px-6 py-4">
                                        <div className="max-w-[200px] overflow-hidden text-ellipsis text-xs bg-slate-100 p-2 rounded text-slate-600 font-mono">
                                            {log.details}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                                        <ShieldAlert className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                                        Không tìm thấy lịch sử nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {!loading && logs.length > 0 && (
                <div className="mt-6">
                    <AdminPagination 
                        pagination={{
                            page: pagination.currentPage,
                            totalPages: pagination.totalPages,
                            total: pagination.totalItems || logs.length,
                            limit: pagination.limit || 10
                        }}
                        onPageChange={fetchLogs} 
                    />
                </div>
            )}
        </div>
    );
}
