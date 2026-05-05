import React from 'react';
import { Trash2 } from 'lucide-react';

export default function MealList({ meals, onRemoveMeal }) {
    if (meals.length === 0) {
        return (
            <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                <p className="text-slate-500 text-sm">Chưa có món ăn nào được thêm.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {meals.map((meal) => (
                <div key={meal.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-4">
                        {}
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded text-[11px] font-bold uppercase tracking-wider">
                            {meal.time}
                        </span>
                        <div>
                            <h4 className="font-semibold text-slate-800 text-sm">{meal.name} ({meal.weight}g)</h4>
                            <p className="text-xs text-slate-500 mt-0.5">Carbs: {meal.carbs}g &bull; Protein: {meal.protein}g</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <span className="font-bold text-lg text-slate-800">{meal.calories}</span>
                            <span className="text-[10px] text-slate-500 ml-1">KCAL</span>
                        </div>
                        <button 
                            onClick={() => onRemoveMeal(meal.id)} 
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}