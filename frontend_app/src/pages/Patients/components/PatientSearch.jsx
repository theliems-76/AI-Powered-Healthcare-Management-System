import React from 'react';
import { Search } from 'lucide-react';

export default function PatientSearch({ search, setSearch, total }) {
    return (
        <div className="flex items-center gap-4">
            <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="TÌM KIẾM THEO TÊN HOẶC SỐ ĐIỆN THOẠI..." 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-[1.25rem] text-[11px] font-bold uppercase tracking-widest focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all placeholder:text-slate-400 shadow-sm"
                />
            </div>
            <div className="hidden md:flex items-center gap-3 px-6 py-4 bg-slate-900 rounded-[1.25rem] shadow-xl shadow-slate-900/10 text-[11px] font-bold uppercase tracking-widest text-white">
                <span className="text-slate-400">TỔNG SỐ HỒ SƠ</span> <span className="text-white text-base leading-none">{total}</span>
            </div>
        </div>
    );
}