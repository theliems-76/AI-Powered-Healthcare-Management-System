import React from 'react';
import { MdEdit, MdDelete } from 'react-icons/md';

export default function FoodsTable({ data }) {
    if (data.length === 0) {
        return <div className="p-8 text-center text-on-surface-variant font-medium">Không tìm thấy món ăn nào.</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100">
                        <th className="px-6 py-4 text-xs font-extrabold text-on-surface-variant uppercase tracking-widest">Tên Món Ăn</th>
                        <th className="px-6 py-4 text-xs font-extrabold text-on-surface-variant uppercase tracking-widest text-center">Năng lượng</th>
                        <th className="px-6 py-4 text-xs font-extrabold text-on-surface-variant uppercase tracking-widest text-center">Tinh bột (Carbs)</th>
                        <th className="px-6 py-4 text-xs font-extrabold text-on-surface-variant uppercase tracking-widest text-center">Phân loại</th>
                        <th className="px-6 py-4 text-xs font-extrabold text-on-surface-variant uppercase tracking-widest text-right">Thao tác</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {data.map((food) => (
                        <tr key={food.id} className="hover:bg-blue-50/30 transition-colors group">
                            <td className="px-6 py-4 font-bold text-on-surface">{food.name}</td>
                            <td className="px-6 py-4 text-center font-bold text-primary">{food.calories} <span className="text-[10px] text-outline uppercase">kcal</span></td>
                            <td className="px-6 py-4 text-center font-bold text-on-surface-variant">{food.carbs} g</td>
                            <td className="px-6 py-4 text-center">
                                <span className="px-3 py-1 bg-surface-container-low text-on-surface-variant rounded-md text-[10px] font-bold uppercase tracking-wider">{food.category}</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 text-outline hover:text-blue-600 hover:bg-primary-container rounded-lg transition-colors"><MdEdit className="w-4 h-4" /></button>
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
