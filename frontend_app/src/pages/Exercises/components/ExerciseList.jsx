import React from 'react';
import { Trash2 } from 'lucide-react';

export default function ExerciseList({ exercises, onRemoveExercise }) {
    if (exercises.length === 0) {
        return (
            <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <p className="text-slate-400 text-sm font-medium">Chưa có hoạt động nào được ghi nhận hôm nay.</p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            {/* Header Danh sách */}
            <div className="bg-slate-50/80 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Danh sách Bài tập
                </h3>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    {Math.round(exercises.reduce((sum, item) => sum + item.calories, 0))} KCAL ĐỐT CHÁY
                </span>
            </div>
            
            <div className="divide-y divide-slate-100 bg-white">
                {exercises.map((ex) => (
                    <div key={ex.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 group hover:bg-slate-50/50 transition-colors">
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h4 className="font-bold text-slate-800 text-sm tracking-tight">{ex.name}</h4>
                                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">{ex.duration} PHÚT</span>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-widest">
                                Hệ số MET: {ex.met}
                            </p>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-6 mt-3 sm:mt-0">
                            <div className="text-right flex items-baseline gap-1">
                                <span className="font-black text-lg text-slate-800">-{Math.round(ex.calories)}</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Kcal</span>
                            </div>
                            <button 
                                onClick={() => onRemoveExercise(ex.id)} 
                                className="text-slate-300 hover:text-rose-500 transition-colors sm:opacity-0 group-hover:opacity-100"
                                title="Xóa hoạt động"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}