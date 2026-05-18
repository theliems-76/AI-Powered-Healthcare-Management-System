import React from 'react';
import { Shield, ShieldAlert, Lock, Unlock } from 'lucide-react';

export default function UserTable({ users, onRoleChange, onToggleStatus }) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <th className="p-4">Họ và Tên</th>
                            <th className="p-4">Email / SĐT</th>
                            <th className="p-4 text-center">Phân quyền</th>
                            <th className="p-4 text-center">Trạng thái</th>
                            <th className="p-4 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {users.map(user => (
                            <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                <td className="p-4 font-bold text-slate-800">{user.full_name}</td>
                                <td className="p-4">
                                    <div className="font-semibold text-slate-600">{user.email}</div>
                                    <div className="text-xs text-slate-400">{user.phone || 'N/A'}</div>
                                </td>
                                <td className="p-4 text-center">
                                    <select 
                                        value={user.role}
                                        onChange={(e) => onRoleChange(user.id, e.target.value)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold outline-none cursor-pointer border ${
                                            user.role === 'ADMIN' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                            user.role === 'DOCTOR' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                            'bg-slate-100 text-slate-700 border-slate-200'
                                        }`}
                                    >
                                        <option value="PATIENT">BỆNH NHÂN</option>
                                        <option value="DOCTOR">BÁC SĨ</option>
                                        <option value="ADMIN">QUẢN TRỊ</option>
                                    </select>
                                </td>
                                <td className="p-4 text-center">
                                    {user.is_active ? (
                                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                                            <Shield className="w-3.5 h-3.5" /> Hoạt động
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-md">
                                            <ShieldAlert className="w-3.5 h-3.5" /> Đã Khóa
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 text-center">
                                    <button 
                                        onClick={() => onToggleStatus(user.id)}
                                        title={user.is_active ? "Khóa tài khoản" : "Mở khóa"}
                                        className={`p-2 rounded-xl transition-colors ${
                                            user.is_active 
                                            ? 'text-slate-400 hover:text-red-600 hover:bg-red-50' 
                                            : 'text-red-500 hover:text-emerald-600 hover:bg-emerald-50'
                                        }`}
                                    >
                                        {user.is_active ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && <div className="p-8 text-center text-slate-500">Không có dữ liệu.</div>}
            </div>
        </div>
    );
}
