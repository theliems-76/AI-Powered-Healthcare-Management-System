import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    Activity, LayoutDashboard, Users, Apple, 
    Dumbbell, LineChart, Calendar, Database, X, Stethoscope
} from 'lucide-react';
import Logo from '../components/ui/Logo';

export default function Sidebar({ user, isMobileOpen, setIsMobileOpen }) {
    const location = useLocation();

    const allMenuItems = [
    { path: '/dashboard', name: 'Tổng quan', icon: LayoutDashboard, roles: ['PATIENT', 'DOCTOR', 'ADMIN'] },
    { path: '/assessment', name: 'Khám sức khỏe AI', icon: Stethoscope, roles: ['PATIENT'] },
    { path: '/history', name: 'Biểu đồ Lịch sử', icon: LineChart, roles: ['PATIENT'] },
    { path: '/calendar', name: 'Lịch trình', icon: Calendar, roles: ['PATIENT'] },
    { path: '/meals', name: 'Quản lý Dinh dưỡng', icon: Apple, roles: ['PATIENT'] },
    { path: '/exercises', name: 'Tập luyện', icon: Dumbbell, roles: ['PATIENT'] },
    { path: '/patients', name: 'Hồ sơ Bệnh nhân', icon: Users, roles: ['DOCTOR'] },
    { path: '/appointments', name: 'Lịch hẹn (Khám bệnh)', icon: Calendar, roles: ['DOCTOR', 'PATIENT'] },
    { path: '/admin', name: 'Quản trị Dữ liệu', icon: Database, roles: ['ADMIN'] },
];

    const currentRole = user?.role || 'PATIENT';
    const menuItems = allMenuItems.filter(item => {
        if (!item.roles.includes(currentRole)) return false;
        
        // Bệnh nhân chưa có bác sĩ phụ trách sẽ không thấy tab Lịch hẹn
        if (currentRole === 'PATIENT' && item.path === '/appointments') {
            if (!user?.Profile?.managed_by_doctor_id) {
                return false;
            }
        }
        
        return true;
    });

    return (
        <>
            {}
            {isMobileOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/50 z-20 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {}
            <aside className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm transform transition-transform duration-300 ease-in-out print:hidden ${
                isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            }`}>
                
                {/* Logo Area */}
                <div className="h-20 flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-slate-900 rounded-[12px] shadow-md flex items-center justify-center shrink-0">
                            <Logo className="w-7 h-7" />
                        </div>
                        <div>
                            <div className="text-lg font-black text-slate-900 tracking-tight">Hiệp Sĩ Tiểu Đường</div>
                            <div className="text-[10px] tracking-widest text-slate-400 font-semibold uppercase">Workspace</div>
                        </div>
                    </div>
                    {}
                    <button onClick={() => setIsMobileOpen(false)} className="md:hidden text-slate-500 hover:text-red-500">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link 
                                key={item.path} 
                                to={item.path}
                                onClick={() => setIsMobileOpen(false)}
                                className={`flex items-center px-3 py-2.5 rounded-lg transition-all text-sm group ${
                                    isActive 
                                        ? 'bg-slate-100 text-slate-900 font-bold' 
                                        : 'text-slate-500 font-semibold hover:bg-slate-50 hover:text-slate-900'
                                }`}
                            >
                                <Icon className={`w-4 h-4 mr-3 transition-transform ${isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Area */}
                <div className="p-4 shrink-0 flex items-center justify-between text-xs font-medium text-slate-400">
                    <span>Hiệp Sĩ Tiểu Đường System</span>
                    <span>v2.4.0</span>
                </div>
            </aside>
        </>
    );
}
