import React from 'react';
import { MdLock, MdLockOpen } from 'react-icons/md';

export default function UserTable({ users, onRoleChange, onToggleStatus }) {
    return (
        <div className="w-full">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-surface-container-low text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">
                            <th className="px-4 py-3 border-b border-outline-variant">Họ và Tên</th>
                            <th className="px-4 py-3 border-b border-outline-variant">Email / SĐT</th>
                            <th className="px-4 py-3 border-b border-outline-variant text-center">Phân quyền</th>
                            <th className="px-4 py-3 border-b border-outline-variant text-center">Trạng thái</th>
                            <th className="px-4 py-3 border-b border-outline-variant text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm bg-surface-container-lowest">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-surface-container-low/50 transition-colors h-14 border-b border-outline-variant/30">
                                <td className="px-4 py-3 font-bold text-on-surface text-sm">{user.full_name}</td>
                                <td className="px-4 py-3">
                                    <div className="font-bold text-on-surface text-sm">{user.email}</div>
                                    <div className="text-[11px] text-on-surface-variant font-medium mt-0.5">{user.phone || '—'}</div>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <select 
                                        value={user.role}
                                        onChange={(e) => onRoleChange(user.id, e.target.value)}
                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest outline-none cursor-pointer border ${
                                            user.role === 'ADMIN' ? 'bg-primary-container text-on-primary-container border-primary-container' :
                                            'bg-surface-container-lowest text-on-surface border-outline-variant hover:border-outline'
                                        }`}
                                    >
                                        <option value="PATIENT">BỆNH NHÂN</option>
                                        <option value="DOCTOR">BÁC SĨ</option>
                                        <option value="ADMIN">QUẢN TRỊ</option>
                                    </select>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    {user.is_active ? (
                                        <span className="inline-block text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-600 px-3 py-1.5 rounded-md">
                                            Hoạt động
                                        </span>
                                    ) : (
                                        <span className="inline-block text-[10px] font-bold uppercase tracking-widest bg-rose-500/10 text-rose-600 px-3 py-1.5 rounded-md">
                                            Đã Khóa
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <button 
                                        onClick={() => onToggleStatus(user.id)}
                                        title={user.is_active ? "Khóa tài khoản" : "Mở khóa"}
                                        className={`p-2 rounded-xl transition-colors ${
                                            user.is_active 
                                            ? 'text-outline hover:text-on-surface hover:bg-surface-container-low' 
                                            : 'text-outline hover:text-on-surface hover:bg-surface-container-low'
                                        }`}
                                    >
                                        {user.is_active ? <MdLock className="w-4 h-4" /> : <MdLockOpen className="w-4 h-4" />}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && <div className="py-16 text-center text-[11px] font-bold uppercase tracking-widest text-secondary">Không có dữ liệu.</div>}
            </div>
        </div>
    );
}
