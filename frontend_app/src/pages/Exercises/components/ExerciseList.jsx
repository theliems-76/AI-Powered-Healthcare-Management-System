import React from 'react';
import { Trash2 } from 'lucide-react';

export default function ExerciseList({ exercises, onRemoveExercise }) {
    if (exercises.length === 0) {
        return (
            <div className="text-center py-12 bg-surface-container-lowest border border-dashed border-outline-variant rounded-xl">
                <p className="text-on-surface-variant text-sm font-medium">Chưa có hoạt động nào được ghi nhận hôm nay.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-surface-container-lowest border-b border-outline-variant">
                        <th className="px-4 py-3 font-bold text-[10px] text-secondary uppercase tracking-widest w-2/5">Bài Tập</th>
                        <th className="px-4 py-3 font-bold text-[10px] text-secondary uppercase tracking-widest">Thời Lượng / MET</th>
                        <th className="px-4 py-3 font-bold text-[10px] text-secondary uppercase tracking-widest text-right">Tiêu Hao</th>
                        <th className="px-4 py-3 font-bold text-[10px] text-secondary uppercase tracking-widest text-right w-16">Tác vụ</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                    {exercises.map((ex) => (
                        <tr key={ex.id} className="hover:bg-surface-container-low transition-colors h-14 group">
                            <td className="px-4 font-semibold text-on-surface text-sm">{ex.name}</td>
                            <td className="px-4 font-mono text-sm text-secondary">
                                {ex.duration} phút <span className="text-outline-variant mx-1">•</span> MET: {ex.met}
                            </td>
                            <td className="px-4 text-right font-bold text-orange-600 text-sm">
                                -{ex.calories} <span className="text-[10px] text-secondary uppercase tracking-widest ml-1">kcal</span>
                            </td>
                            <td className="px-4 text-right">
                                <button 
                                    onClick={() => onRemoveExercise(ex.id)} 
                                    className="p-1.5 text-on-surface-variant hover:text-error transition-colors sm:opacity-0 group-hover:opacity-100 inline-flex items-center justify-center"
                                    title="Xóa bài tập"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}