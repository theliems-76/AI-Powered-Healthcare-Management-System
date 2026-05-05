import React from 'react';
import { Trash2 } from 'lucide-react';

export default function ExerciseList({ exercises, onRemoveExercise }) {
    if (exercises.length === 0) {
        return (
            <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                <p className="text-slate-500 text-sm">Chưa có hoạt động nào được ghi nhận hôm nay.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {exercises.map((ex) => (
                <div key={ex.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="px-3 py-1 bg-slate-100 text-slate-600 rounded text-[11px] font-bold uppercase tracking-wider">
                            {ex.duration} PHÚT
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-800 text-sm">{ex.name}</h4>
                            <p className="text-xs text-slate-500 mt-0.5">Hệ số MET: {ex.met}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <span className="font-bold text-lg text-orange-600">-{ex.calories}</span>
                            <span className="text-[10px] text-slate-500 ml-1 uppercase">Kcal</span>
                        </div>
                        <button onClick={() => onRemoveExercise(ex.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}