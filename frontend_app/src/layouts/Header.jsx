import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Settings, User, Activity, LogOut, ChevronDown } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';

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
        <header className="h-20 bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant flex items-center justify-between px-4 sm:px-8 shrink-0 z-50 relative print:hidden">
            
            {}
            <div className="flex items-center gap-4">
                <button 
                    onClick={toggleMobileSidebar}
                    className="md:hidden text-on-surface hover:text-primary p-2 bg-surface-container-low rounded-lg transition-colors"
                >
                    <Menu className="w-6 h-6 text-on-surface-variant" />
                </button>
            </div>
            
            {}
            <div className="flex items-center space-x-2 sm:space-x-3">
                <NotificationDropdown />

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                    <button 
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-3 p-1.5 sm:pr-4 bg-transparent hover:bg-surface-container-low border border-transparent hover:border-outline-variant rounded-full transition-all active:scale-95"
                    >
                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm shadow-sm">
                            {getInitials(user?.full_name)}
                        </div>
                        <div className="text-left hidden sm:block">
                            <div className="text-sm font-bold text-on-surface leading-tight">
                                {user?.full_name ? user.full_name.split(' ')[0] : 'Tài khoản'}
                            </div>
                            <div className="text-[10px] font-semibold text-on-surface-variant mt-0.5">
                                {getRoleName(currentRole)}
                            </div>
                        </div>
                        <ChevronDown className={`hidden sm:block w-4 h-4 text-on-surface-variant transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isProfileOpen && (
                        <div className="absolute right-0 mt-3 w-64 bg-surface-container-lowest rounded-2xl shadow-[0_8px_30px_rgba(0,24,72,0.08)] border border-outline-variant py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                            {/* User Info */}
                            <div className="px-4 py-3 mb-2">
                                <p className="text-sm font-bold text-on-surface truncate">{user?.full_name || 'Người dùng'}</p>
                                <p className="text-xs font-medium text-on-surface-variant truncate mt-0.5">{user?.email || 'Chưa cập nhật email'}</p>
                            </div>
                            
                            <div className="h-px bg-outline-variant/30 mb-2"></div>
                            
                            {/* Menu Items */}
                            <div className="px-2">
                                <button 
                                    onClick={() => handleNavigate('/profile')}
                                    className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-on-surface hover:bg-surface-container-low rounded-lg transition-colors"
                                >
                                    <User className="w-4 h-4 mr-3 text-on-surface-variant" /> Hồ sơ cá nhân
                                </button>
                                
                                <button 
                                    onClick={() => { setIsProfileOpen(false); logout(); }}
                                    className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors mt-1"
                                >
                                    <LogOut className="w-4 h-4 mr-3 text-rose-500" /> Đăng xuất
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
