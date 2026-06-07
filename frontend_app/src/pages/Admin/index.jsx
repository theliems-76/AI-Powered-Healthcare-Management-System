import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';

export default function AdminLayout() {
    const location = useLocation();

    // Tự động chuyển hướng /admin sang /admin/users
    if (location.pathname === '/admin' || location.pathname === '/admin/') {
        return <Navigate to="/admin/users" replace />;
    }

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

            <div className="mt-6">
                <Outlet />
            </div>
        </div>
    );
}
