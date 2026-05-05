import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, Settings, User, Activity, LogOut, ChevronDown } from 'lucide-react';

export default function Header({ user, logout, toggleMobileSidebar }) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    },[]);

    const getRoleName = (role) => {
        if (role === 'DOCTOR') return 'Bác sĩ Điều trị';
        if (role === 'ADMIN') return 'Quản trị Hệ thống';
        return 'Bệnh nhân';
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        return name.substring(0, 2).toUpperCase();
    };

    const currentRole = user?.role || 'PATIENT';

    const handleNavigate = (path) => {
        navigate(path);
        setIsProfileOpen(false);
    };

    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0 z-10 print:hidden">
            
            {}
            <div className="flex items-center gap-4">
                <button 
                    onClick={toggleMobileSidebar}
                    className="md:hidden text-slate-500 hover:text-blue-600 p-2 bg-slate-100 rounded-lg transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>
                
                {}
                <div className="hidden lg:flex items-center relative">
                    <Search className="w-5 h-5 absolute left-3 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm..." 
                        className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm w-80 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                    />
                </div>
            </div>
            
            {}
            <div className="flex items-center space-x-2 sm:space-x-3">
                <button className="hidden sm:block p-2.5 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                {}
                <div className="relative" ref={profileRef}>
                    <button 
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-3 p-1.5 sm:pr-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-full transition-all active:scale-95 shadow-sm"
                    >
                        {}
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold shadow-sm text-sm">
                            {getInitials(user?.full_name)}
                        </div>
                        <div className="text-left hidden sm:block">
                            <div className="text-sm font-bold text-slate-800 leading-tight">
                                {user?.full_name ? user.full_name.split(' ')[0] : 'Tài khoản'}
                            </div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                                {getRoleName(currentRole)}
                            </div>
                        </div>
                        <ChevronDown className={`hidden sm:block w-4 h-4 text-slate-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {}
                    {isProfileOpen && (
                        <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                            {}
                            <div className="px-4 py-3 border-b border-slate-50 mb-2 bg-slate-50/50">
                                <p className="text-sm font-bold text-slate-800 truncate">{user?.full_name || 'Người dùng'}</p>
                                <p className="text-xs font-medium text-slate-500 truncate mt-0.5">{user?.email || 'Chưa cập nhật email'}</p>
                            </div>
                            
                            {}
                            <button 
                                onClick={() => handleNavigate('/profile')}
                                className="w-full flex items-center px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                            >
                                <User className="w-4 h-4 mr-3" /> Hồ sơ cá nhân
                            </button>
                            
                            <button 
                                onClick={() => handleNavigate('/history')}
                                className="w-full flex items-center px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                            >
                                <Activity className="w-4 h-4 mr-3" /> Tiến trình sức khỏe
                            </button>
                            
                            <div className="h-px bg-slate-100 my-2"></div>
                            
                            <button 
                                onClick={() => { setIsProfileOpen(false); logout(); }}
                                className="flex items-center w-full px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut className="w-4 h-4 mr-3" /> Đăng xuất
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}