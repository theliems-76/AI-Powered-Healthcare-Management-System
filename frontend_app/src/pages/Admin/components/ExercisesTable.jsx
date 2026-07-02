import React from 'react';
import { MdEdit, MdDelete } from 'react-icons/md';

export default function ExercisesTable({ data }) {
    if (data.length === 0) {
        return <div className="p-8 text-center text-on-surface-variant font-medium">Không tìm thấy môn thể thao nào.</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100">
                        <th className="px-6 py-4 text-xs font-extrabold text-on-surface-variant uppercase tracking-widest">Tên Môn Tập</th>
                        <th className="px-6 py-4 text-xs font-extrabold text-on-surface-variant uppercase tracking-widest text-center">Chỉ số MET</th>
                        <th className="px-6 py-4 text-xs font-extrabold text-on-surface-variant uppercase tracking-widest text-center">Phân loại</th>
                        <th className="px-6 py-4 text-xs font-extrabold text-on-surface-variant uppercase tracking-widest text-right">Thao tác</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {data.map((ex) => (
                        <tr key={ex.id} className="hover:bg-indigo-50/30 transition-colors group">
                            <td className="px-6 py-4 font-bold text-on-surface">{ex.name}</td>
                            <td className="px-6 py-4 text-center font-bold text-indigo-600">{ex.met}</td>
                            <td className="px-6 py-4 text-center">
                                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-md text-[10px] font-bold uppercase tracking-wider">{ex.category}</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 text-outline hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><MdEdit className="w-4 h-4" /></button>
                                    <button className="p-2 text-outline hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><MdDelete className="w-4 h-4" /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
