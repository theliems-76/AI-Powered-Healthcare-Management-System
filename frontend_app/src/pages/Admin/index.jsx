import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';

import AdminStats from './components/AdminStats';
import UserTable from './components/UserTable';
import AdminPagination from './components/AdminPagination';
import AdminExerciseTab from './components/AdminExerciseTab';
import AdminDishTab from './components/AdminDishTab';
import AuditLogsTab from './components/AuditLogsTab';
import AdminNotificationsTab from './components/AdminNotificationsTab';
import { Loader2, ShieldCheck, Search } from 'lucide-react';

const ITEMS_PER_PAGE = 20;

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState(null);

    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [activeTab, setActiveTab] = useState('users');

    const fetchData = useCallback(async (page = 1, searchQuery = search, currentRole = roleFilter) => {
        setLoading(true);
        try {
            const [statsRes, usersRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get(`/admin/users?page=${page}&limit=${ITEMS_PER_PAGE}&search=${searchQuery}&role=${currentRole}`)
            ]);
            setStats(statsRes.data.data);
            setUsers(usersRes.data.data);
            setPagination(usersRes.data.pagination);
            setCurrentPage(page);
        } catch (error) {
            toast.error("Lỗi lấy dữ liệu Admin!");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [search, roleFilter]);

    useEffect(() => {
        fetchData(1, search, roleFilter);
    }, [fetchData]);

    const handlePageChange = (page) => {
        fetchData(page, search, roleFilter);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchData(1, search, roleFilter);
    };

    const handleRoleFilterChange = (e) => {
        const newRole = e.target.value;
        setRoleFilter(newRole);
        fetchData(1, search, newRole);
    };

    const handleRoleChange = async (userId, newRole) => {
        if (!window.confirm(`Xác nhận đổi quyền thành ${newRole}?`)) return;
        try {
            await api.put(`/admin/users/${userId}/role`, { role: newRole });
            toast.success("Đã cập nhật quyền thành công!");
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        } catch (error) {
            toast.error("Lỗi cập nhật quyền!");
        }
    };

    const handleToggleStatus = async (userId) => {
        try {
            const res = await api.put(`/admin/users/${userId}/status`);
            toast.success(res.data.message);
            setUsers(users.map(u => u.id === userId ? { ...u, is_active: !u.is_active } : u));
        } catch (error) {
            toast.error(error.response?.data?.error || "Lỗi thay đổi trạng thái!");
        }
    };

    if (loading && !users.length) return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-100 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight uppercase">
                        Quản Trị Hệ Thống
                    </h1>
                    <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest">
                        Bảng điều khiển dành riêng cho Administrator
                    </p>
                </div>
            </div>

            {/* Điều hướng Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-px">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-6 py-3.5 text-[11px] font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'users' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-900'}`}
                >
                    Người Dùng
                </button>
                <button
                    onClick={() => setActiveTab('exercises')}
                    className={`px-6 py-3.5 text-[11px] font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'exercises' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-900'}`}
                >
                    Kho Bài Tập
                </button>
                <button
                    onClick={() => setActiveTab('dishes')}
                    className={`px-6 py-3.5 text-[11px] font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'dishes' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-900'}`}
                >
                    Kho Món Ăn
                </button>
                <button
                    onClick={() => setActiveTab('logs')}
                    className={`px-6 py-3.5 text-[11px] font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'logs' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-900'}`}
                >
                    Nhật Ký Bảo Mật
                </button>
                <button
                    onClick={() => setActiveTab('notifications')}
                    className={`px-6 py-3.5 text-[11px] font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'notifications' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-900'}`}
                >
                    Thông Báo Hệ Thống
                </button>
            </div>

            {/* TAB: NGƯỜI DÙNG */}
            {activeTab === 'users' && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                            Danh sách Tài khoản
                            {loading && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
                        </h2>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                            <div className="relative w-full sm:w-40">
                                <select
                                    value={roleFilter}
                                    onChange={handleRoleFilterChange}
                                    className="w-full pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none cursor-pointer text-slate-700 font-medium"
                                >
                                    <option value="ALL">Tất cả quyền</option>
                                    <option value="ADMIN">Quản trị viên</option>
                                    <option value="DOCTOR">Bác sĩ</option>
                                    <option value="PATIENT">Bệnh nhân</option>
                                </select>
                                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>

                            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm Email, Tên, SĐT..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                                />
                            </form>
                        </div>
                    </div>
                    
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4">
                        <UserTable 
                            users={users} 
                            onRoleChange={handleRoleChange} 
                            onToggleStatus={handleToggleStatus} 
                        />
                        
                        {pagination && (
                            <AdminPagination
                                pagination={{ ...pagination, limit: ITEMS_PER_PAGE }}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </div>
                </div>
            )}

            {/* TAB: BÀI TẬP */}
            {activeTab === 'exercises' && <AdminExerciseTab />}

            {/* TAB: MÓN ĂN */}
            {activeTab === 'dishes' && <AdminDishTab />}
            
            {/* TAB: NHẬT KÝ BẢO MẬT */}
            {activeTab === 'logs' && <AuditLogsTab />}

            {/* TAB: THÔNG BÁO HỆ THỐNG */}
            {activeTab === 'notifications' && <AdminNotificationsTab />}
        </div>
    );
}
