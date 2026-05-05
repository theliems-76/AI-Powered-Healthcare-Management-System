import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    Activity, LayoutDashboard, Users, Apple, 
    Dumbbell, LineChart, Calendar, Database, X,Stethoscope
} from 'lucide-react';

export default function Sidebar({ user, isMobileOpen, setIsMobileOpen }) {
    const location = useLocation();

    const allMenuItems = [
    { path: '/', name: 'Tổng quan', icon: LayoutDashboard, roles: ['PATIENT', 'DOCTOR', 'ADMIN'] },
    
    { path: '/assessment', name: 'Khám sức khỏe AI', icon: Stethoscope, roles: ['PATIENT'] },
    
    { path: '/history', name: 'Biểu đồ Lịch sử', icon: LineChart, roles: ['PATIENT'] },
    { path: '/calendar', name: 'Lịch trình', icon: Calendar, roles: ['PATIENT'] },
    { path: '/meals', name: 'Quản lý Dinh dưỡng', icon: Apple, roles: ['PATIENT'] },
    { path: '/exercises', name: 'Tập luyện', icon: Dumbbell, roles: ['PATIENT'] },
    { path: '/patients', name: 'Hồ sơ Bệnh nhân', icon: Users, roles: ['DOCTOR', 'ADMIN'] },
    { path: '/admin', name: 'Quản trị Dữ liệu', icon: Database, roles: ['ADMIN'] },
];

    const currentRole = user?.role || 'PATIENT';
    const menuItems = allMenuItems.filter(item => item.roles.includes(currentRole));

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
                
                {}
                <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100 shrink-0">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mr-3 shadow-lg shadow-blue-600/30">
                            <Activity className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-xl font-extrabold text-blue-900 tracking-tight">Clinical AI</div>
                            <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Hệ sinh thái Y tế</div>
                        </div>
                    </div>
                    {}
                    <button onClick={() => setIsMobileOpen(false)} className="md:hidden text-slate-500 hover:text-red-500">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link 
                                key={item.path} 
                                to={item.path}
                                onClick={() => setIsMobileOpen(false)}
                                className={`flex items-center px-4 py-3 rounded-xl transition-all font-semibold text-sm group ${
                                    isActive 
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                                        : 'text-slate-500 hover:bg-blue-50 hover:text-blue-700'
                                }`}
                            >
                                <Icon className={`w-5 h-5 mr-3 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {}
                <div className="p-6 border-t border-slate-100 bg-slate-50/50 shrink-0">
                    <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-100">
                        <p className="text-xs font-bold text-blue-800 mb-1">Cần hỗ trợ?</p>
                        <p className="text-[10px] text-blue-600 mb-3">Liên hệ đội ngũ kỹ thuật</p>
                        <button className="w-full py-2 bg-white text-blue-700 rounded-lg text-xs font-bold shadow-sm hover:shadow transition-all border border-blue-100">
                            Gửi yêu cầu
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}