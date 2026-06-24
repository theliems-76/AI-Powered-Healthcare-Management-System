import React from 'react';
import { Search } from 'lucide-react';
import Input from '../../../components/ui/Input';

export default function PatientSearch({ search, setSearch, total }) {
    return (
        <div className="flex items-center gap-4">
            <div className="flex-1 pt-1">
                <Input
                    type="text" 
                    placeholder="Tìm kiếm theo Tên hoặc Số điện thoại..." 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)}
                    icon={Search}
                />
            </div>
            <div className="hidden md:flex items-center gap-3 px-6 py-4 bg-primary rounded-lg text-[11px] font-bold uppercase tracking-widest text-on-primary">
                <span className="opacity-80">TỔNG SỐ HỒ SƠ</span> <span className="text-base leading-none">{total}</span>
            </div>
        </div>
    );
}