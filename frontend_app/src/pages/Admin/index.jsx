import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { MdOutlineStorage, MdSecurity, MdApi, MdCheckCircle, MdPeople, MdPerson, MdLocalHospital, MdFoodBank } from 'react-icons/md';
import api from '../../services/api';

export default function AdminLayout() {
    const location = useLocation();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/stats');
                setStats(res.data.data);
            } catch (error) {
                console.error("Lỗi lấy thống kê:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // Tự động chuyển hướng /admin sang /admin/users
    if (location.pathname === '/admin' || location.pathname === '/admin/') {
        return <Navigate to="/admin/users" replace />;
    }

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-6 animate-in fade-in duration-500 w-full pb-12">
            <div className="mb-8 flex justify-between items-end border-b border-outline-variant pb-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 mb-2">
                        Tổng Quan Hệ Thống
                    </h1>
                    <p className="text-sm font-medium text-slate-500">
                        Giám sát tình trạng hạ tầng và hoạt động người dùng trong thời gian thực.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Main Content */}
                <div className="xl:col-span-9">
                    <Outlet />
                </div>

                {/* System Insights Sidebar - Thực tế với dữ liệu từ API */}
                <div className="xl:col-span-3 space-y-6 hidden lg:block">
                    <div className="bg-surface-container border border-outline-variant rounded-[2rem] p-6 relative overflow-hidden shadow-[0_4px_12px_rgba(0,24,72,0.02)]">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-6 -mt-6 z-0"></div>
                        <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-6 relative z-10 flex items-center gap-2">
                            <MdPeople className="w-5 h-5 text-indigo-500" />
                            Người Dùng Hệ Thống
                        </h3>
                        <div className="space-y-5 relative z-10">
                            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <MdPeople className="w-4 h-4" /> Tổng cộng
                                </span>
                                <span className="text-sm font-black text-slate-900">{loading ? '...' : stats?.totalUsers || 0}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <MdPerson className="w-4 h-4 text-emerald-500" /> Bệnh nhân
                                </span>
                                <span className="text-sm font-black text-slate-900">{loading ? '...' : stats?.totalPatients || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <MdLocalHospital className="w-4 h-4 text-amber-500" /> Bác sĩ
                                </span>
                                <span className="text-sm font-black text-slate-900">{loading ? '...' : stats?.totalDoctors || 0}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface-container-lowest border border-outline-variant rounded-[2rem] p-6 shadow-[0_4px_12px_rgba(0,24,72,0.03)]">
                        <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                            <MdOutlineStorage className="w-5 h-5 text-emerald-500" />
                            Dữ Liệu Khám Bệnh
                        </h3>
                        <div className="flex flex-col items-center justify-center py-4 bg-emerald-50 rounded-2xl border border-emerald-100 mb-4">
                            <span className="text-3xl font-black text-emerald-600">{loading ? '...' : stats?.totalRecords || 0}</span>
                            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mt-1">Hồ Sơ Y Tế</span>
                        </div>
                    </div>

                    <div className="bg-surface-container-low border border-outline-variant rounded-[2rem] p-6 shadow-[0_4px_12px_rgba(0,24,72,0.02)]">
                        <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                            <MdFoodBank className="w-5 h-5 text-amber-500" />
                            Kho Hệ Thống
                        </h3>
                        <div className="space-y-4">
                             <div className="flex justify-between items-center bg-white px-4 py-3 rounded-xl border border-slate-100">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Món ăn mẫu</span>
                                <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-md">
                                    {loading ? '...' : stats?.totalDishes || 0}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

