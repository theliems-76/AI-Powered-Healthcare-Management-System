import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    MdDashboard, MdGroup, MdRestaurant, 
    MdFitnessCenter, MdTimeline, MdCalendarToday, MdStorage, MdClose, MdMonitorHeart, MdFeedback, MdNotifications, MdSecurity, MdSchool
} from 'react-icons/md';
import Logo from '../components/ui/Logo';

export default function Sidebar({ user, isMobileOpen, setIsMobileOpen }) {
    const location = useLocation();

    const allMenuItems = [
    { path: '/dashboard', name: 'Tổng quan', icon: MdDashboard, roles: ['PATIENT', 'DOCTOR', 'ADMIN'] },
    { path: '/assessment', name: 'Khám sức khỏe AI', icon: MdMonitorHeart, roles: ['PATIENT'] },
    { path: '/history', name: 'Biểu đồ Lịch sử', icon: MdTimeline, roles: ['PATIENT'] },
    { path: '/calendar', name: 'Lịch trình', icon: MdCalendarToday, roles: ['PATIENT'] },
    { path: '/meals', name: 'Quản lý Dinh dưỡng', icon: MdRestaurant, roles: ['PATIENT'] },
    { path: '/exercises', name: 'Tập luyện', icon: MdFitnessCenter, roles: ['PATIENT'] },
    { path: '/patients', name: 'Hồ sơ Bệnh nhân', icon: MdGroup, roles: ['DOCTOR'] },
    { path: '/appointments', name: 'Lịch hẹn (Khám bệnh)', icon: MdCalendarToday, roles: ['DOCTOR', 'PATIENT'] },
    { 
        path: '/admin', 
        name: 'Quản trị Dữ liệu', 
        icon: MdStorage, 
        roles: ['ADMIN'],
        subItems: [
            { path: '/admin/users', name: 'Người dùng' },
            { path: '/admin/exercises', name: 'Kho bài tập' },
            { path: '/admin/dishes', name: 'Kho món ăn' },
            { path: '/admin/knowledge', name: 'Cơ sở Tri thức AI' },
            { path: '/admin/logs', name: 'Nhật ký bảo mật' },
            { path: '/admin/notifications', name: 'Thông báo hệ thống' },
            { path: '/admin/feedbacks', name: 'Đánh giá' },
        ]
    },
];

    const currentRole = user?.role || 'PATIENT';
    const menuItems = allMenuItems.filter(item => {
        if (!item.roles.includes(currentRole)) return false;
        
        // Cho phép hiển thị tab Lịch hẹn cho tất cả, trang Appointments sẽ tự xử lý thông báo nếu chưa có bác sĩ
        
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
            <aside className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-surface-container-lowest border-r border-outline-variant flex flex-col shadow-sm transform transition-transform duration-300 ease-in-out print:hidden ${
                isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            }`}>
                
                {/* Logo Area */}
                <div className="h-20 flex items-center justify-between px-6 shrink-0 border-b border-outline-variant">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-primary rounded-[12px] shadow-sm flex items-center justify-center shrink-0">
                            <Logo className="w-7 h-7 text-on-primary" />
                        </div>
                        <div>
                            <div className="text-lg font-black text-on-surface tracking-tight">Hiệp Sĩ Tiểu Đường</div>
                            <div className="text-[10px] tracking-widest text-primary font-bold uppercase">Workspace</div>
                        </div>
                    </div>
                    {/* Nút đóng Sidebar trên Mobile */}
                    <button onClick={() => setIsMobileOpen(false)} className="md:hidden text-on-surface-variant hover:text-error transition-colors">
                        <MdClose className="w-6 h-6" />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isParentActive = location.pathname.startsWith(item.path);
                        const isExactActive = location.pathname === item.path;

                        return (
                            <div key={item.path} className="mb-2">
                                <Link 
                                    to={item.subItems ? item.subItems[0].path : item.path}
                                    onClick={() => !item.subItems && setIsMobileOpen(false)}
                                    className={`flex items-center px-4 py-3 rounded-xl transition-all text-sm group ${
                                        (item.subItems ? isParentActive : isExactActive)
                                            ? 'bg-surface-container-high text-primary font-bold shadow-[0_4px_12px_rgba(0,24,72,0.03)]' 
                                            : 'text-on-surface-variant font-semibold hover:bg-surface-container-low hover:text-on-surface'
                                    }`}
                                >
                                    <Icon className={`w-5 h-5 mr-3 transition-transform ${(item.subItems ? isParentActive : isExactActive) ? 'text-primary' : 'text-on-surface-variant group-hover:text-on-surface'}`} />
                                    {item.name}
                                </Link>
                                
                                {/* SubItems Rendering */}
                                {item.subItems && isParentActive && (
                                    <div className="ml-8 mt-2 space-y-1 border-l-2 border-surface-container-high pl-3">
                                        {item.subItems.map(sub => {
                                            const isSubActive = location.pathname === sub.path;
                                            return (
                                                <Link 
                                                    key={sub.path}
                                                    to={sub.path}
                                                    onClick={() => setIsMobileOpen(false)}
                                                    className={`block px-4 py-2.5 rounded-lg text-xs font-bold transition-all uppercase tracking-widest ${
                                                        isSubActive
                                                            ? 'bg-primary/10 text-primary border-l-2 border-primary'
                                                            : 'text-outline hover:text-on-surface hover:bg-surface-container-low border-l-2 border-transparent'
                                                    }`}
                                                >
                                                    {sub.name}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* Footer Area */}
                <div className="p-4 shrink-0 flex flex-col items-center justify-center text-[10px] font-bold text-outline-variant tracking-widest uppercase border-t border-outline-variant bg-surface-container-lowest">
                    <span className="text-primary mb-1">Hiệp Sĩ Tiểu Đường System</span>
                    <span>v2.5.0 Enterprise</span>
                </div>
            </aside>
        </>
    );
}
