import React from 'react';
import { Search } from 'lucide-react';

export default function PatientSearch({ search, setSearch, total }) {
    return (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Tìm kiếm theo Tên hoặc Số điện thoại..." 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold text-slate-600">
                <span>Tổng số:</span> <span className="text-blue-600 text-lg leading-none">{total}</span>
            </div>
        </div>
    );
}