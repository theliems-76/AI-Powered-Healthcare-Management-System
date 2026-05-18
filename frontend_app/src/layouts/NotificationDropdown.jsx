import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Loader2, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data.data);
        } catch (err) {
            console.error('Lỗi lấy thông báo', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000); // Polling every minute
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const handleRead = async (id, link) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
            if (link) {
                navigate(link);
                setIsOpen(false);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleReadAll = async () => {
        try {
            await api.put('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="relative hidden sm:block" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                    <div className="px-4 py-3 border-b border-slate-50 flex justify-between items-center">
                        <h3 className="text-sm font-bold text-slate-800">Thông báo</h3>
                        {unreadCount > 0 && (
                            <button onClick={handleReadAll} className="text-xs font-bold text-blue-600 hover:text-blue-800">
                                Đánh dấu đã đọc
                            </button>
                        )}
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto custom-scrollbar">
                        {loading ? (
                            <div className="flex justify-center p-4"><Loader2 className="w-5 h-5 animate-spin text-blue-600" /></div>
                        ) : notifications.length === 0 ? (
                            <div className="text-center p-6 text-sm text-slate-500">Chưa có thông báo nào.</div>
                        ) : (
                            notifications.map(n => (
                                <div 
                                    key={n.id} 
                                    onClick={() => handleRead(n.id, n.link)}
                                    className={`px-4 py-3 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${!n.is_read ? 'bg-blue-50/50' : ''}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <p className={`text-sm ${!n.is_read ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>
                                            {n.title}
                                        </p>
                                        {!n.is_read && <span className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></span>}
                                    </div>
                                    <p className="text-xs text-slate-500 line-clamp-2">{n.message}</p>
                                    <p className="text-[10px] font-medium text-slate-400 mt-1">
                                        {new Date(n.createdAt).toLocaleString('vi-VN')}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
