import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Bell, Check, Loader2, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
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

    const [selectedNotification, setSelectedNotification] = useState(null);

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const handleRead = async (notification) => {
        try {
            if (!notification.is_read) {
                await api.put(`/notifications/${notification.id}/read`);
                setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n));
            }
            
            // Nếu là yêu cầu kết nối, luôn mở Modal để hiện nút Chấp nhận/Từ chối
            if (notification.type === 'DOCTOR_REQUEST' || notification.type === 'PATIENT_REQUEST') {
                setSelectedNotification(notification);
                setIsOpen(false);
            } 
            // Nếu có link và link là một đường dẫn hợp lệ (bắt đầu bằng '/')
            else if (notification.link && notification.link.startsWith('/')) {
                navigate(notification.link);
                setIsOpen(false);
            } 
            // Các trường hợp còn lại mở Modal
            else {
                setSelectedNotification(notification);
                setIsOpen(false);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleRequestAction = async (id, action) => {
        try {
            await api.post(`/users/${action}-request/${id}`);
            toast.success(action === 'accept' ? 'Đã chấp nhận kết nối!' : 'Đã từ chối kết nối!');
            setNotifications(prev => prev.filter(n => n.id !== id));
            setSelectedNotification(null);
            setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
            toast.error(error.response?.data?.error || "Lỗi xử lý yêu cầu!");
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
        <>
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
                                <button onClick={handleReadAll} className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-800">
                                    Đánh dấu đã đọc
                                </button>
                            )}
                        </div>
                        
                        <div className="max-h-80 overflow-y-auto custom-scrollbar">
                            {loading ? (
                                <div className="flex justify-center p-4"><Loader2 className="w-5 h-5 animate-spin text-indigo-600" /></div>
                            ) : notifications.length === 0 ? (
                                <div className="text-center p-6 text-sm text-slate-500">Chưa có thông báo nào.</div>
                            ) : (
                                notifications.map(n => (
                                    <div 
                                        key={n.id} 
                                        onClick={() => handleRead(n)}
                                        className={`px-4 py-3 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${!n.is_read ? 'bg-indigo-50/50' : ''}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <p className={`text-sm ${!n.is_read ? 'font-bold text-slate-900' : 'font-medium text-slate-600'}`}>
                                                {n.title}
                                            </p>
                                            {!n.is_read && <span className="w-2 h-2 bg-indigo-600 rounded-full mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(79,70,229,0.5)]"></span>}
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

            {/* Notification Detail Modal */}
            {selectedNotification && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className={`px-6 py-5 border-b border-slate-100 flex items-center gap-3 ${
                            selectedNotification.type === 'ALERT' ? 'bg-rose-50' :
                            selectedNotification.type === 'SYSTEM' ? 'bg-indigo-50' :
                            'bg-blue-50'
                        }`}>
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                                selectedNotification.type === 'ALERT' ? 'bg-rose-100 text-rose-600' :
                                selectedNotification.type === 'SYSTEM' ? 'bg-indigo-100 text-indigo-600' :
                                'bg-blue-100 text-blue-600'
                            }`}>
                                <Info className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    Từ: Quản trị Hệ thống (Admin)
                                </h3>
                                <p className="text-sm font-bold text-slate-900 mt-0.5">
                                    Chi tiết Thông báo
                                </p>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <h4 className="text-lg font-black text-slate-900 mb-2 leading-snug">
                                {selectedNotification.title}
                            </h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
                                Thời gian gửi: {new Date(selectedNotification.createdAt).toLocaleString('vi-VN')}
                            </p>
                            
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 max-h-[50vh] overflow-y-auto custom-scrollbar">
                                <div 
                                    className="text-sm font-medium text-slate-700 whitespace-pre-wrap leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: selectedNotification.message }}
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            {(selectedNotification.type === 'DOCTOR_REQUEST' || selectedNotification.type === 'PATIENT_REQUEST') && (
                                <>
                                    <button 
                                        onClick={() => handleRequestAction(selectedNotification.id, 'reject')}
                                        className="px-6 py-2.5 bg-white border border-slate-200 text-rose-600 text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-50 transition-colors shadow-sm active:scale-95"
                                    >
                                        Từ Chối
                                    </button>
                                    <button 
                                        onClick={() => handleRequestAction(selectedNotification.id, 'accept')}
                                        className="px-6 py-2.5 bg-emerald-600 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 active:scale-95"
                                    >
                                        Chấp Nhận
                                    </button>
                                </>
                            )}
                            <button 
                                onClick={() => setSelectedNotification(null)}
                                className="px-6 py-2.5 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 active:scale-95"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
