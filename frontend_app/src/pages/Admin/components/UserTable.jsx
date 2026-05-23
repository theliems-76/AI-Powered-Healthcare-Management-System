import React from 'react';
import { Shield, ShieldAlert, Lock, Unlock } from 'lucide-react';

export default function UserTable({ users, onRoleChange, onToggleStatus }) {
    return (
        <div className="w-full">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white border-b border-slate-100">
                            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Họ và Tên</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Email / SĐT</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Phân quyền</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Trạng thái</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-5 font-bold text-slate-900 text-sm">{user.full_name}</td>
                                <td className="px-6 py-5">
                                    <div className="font-bold text-slate-700 text-sm">{user.email}</div>
                                    <div className="text-[11px] text-slate-400 font-medium mt-0.5">{user.phone || '—'}</div>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <select 
                                        value={user.role}
                                        onChange={(e) => onRoleChange(user.id, e.target.value)}
                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest outline-none cursor-pointer border ${
                                            user.role === 'ADMIN' ? 'bg-slate-900 text-white border-slate-900' :
                                            'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                                        }`}
                                    >
                                        <option value="PATIENT">BỆNH NHÂN</option>
                                        <option value="DOCTOR">BÁC SĨ</option>
                                        <option value="ADMIN">QUẢN TRỊ</option>
                                    </select>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    {user.is_active ? (
                                        <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-slate-900 bg-slate-100 px-3 py-1.5 rounded-md">
                                            Hoạt động
                                        </span>
                                    ) : (
                                        <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200">
                                            Đã Khóa
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <button 
                                        onClick={() => onToggleStatus(user.id)}
                                        title={user.is_active ? "Khóa tài khoản" : "Mở khóa"}
                                        className={`p-2 rounded-xl transition-colors ${
                                            user.is_active 
                                            ? 'text-slate-300 hover:text-slate-900 hover:bg-slate-100' 
                                            : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
                                        }`}
                                    >
                                        {user.is_active ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && <div className="py-16 text-center text-[11px] font-bold uppercase tracking-widest text-slate-400">Không có dữ liệu.</div>}
            </div>
        </div>
    );
}
