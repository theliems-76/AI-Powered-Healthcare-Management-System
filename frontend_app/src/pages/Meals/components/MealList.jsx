import React from 'react';
import { Trash2 } from 'lucide-react';

export default function MealList({ meals, onRemoveMeal }) {
    if (meals.length === 0) {
        return (
            <div className="text-center py-12 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm">
                <p className="text-on-surface-variant text-sm font-medium">Chưa có món ăn nào được thêm.</p>
            </div>
        );
    }

    const timeOrder = { 'Sáng': 1, 'Trưa': 2, 'Tối': 3, 'Phụ': 4 };
    
    // Sắp xếp các bữa ăn theo thời gian trong ngày
    const sortedMeals = [...meals].sort((a, b) => {
        return (timeOrder[a.time] || 99) - (timeOrder[b.time] || 99);
    });

    return (
        <div className="space-y-6 relative ml-1">
            <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-outline-variant"></div>
            
            {sortedMeals.map((meal, index) => (
                <div key={meal.id} className="relative pl-8 sm:pl-10 group">
                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-on-primary text-[10px] font-bold z-10 ring-4 ring-surface shadow-sm">
                        {index + 1}
                    </div>
                    
                    <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant hover:bg-surface-container-high transition-colors relative">
                        <div className="flex justify-between items-start mb-2 gap-4">
                            <div>
                                <h5 className="font-semibold text-on-surface text-sm tracking-tight">{meal.name}</h5>
                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary-container/20 px-2 py-0.5 rounded mt-1 inline-block">
                                    Buổi {meal.time}
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <div className="text-right flex items-baseline gap-1">
                                    <span className="font-semibold text-lg text-on-surface">{Math.round(meal.calories)}</span>
                                    <span className="text-[10px] text-secondary font-bold uppercase tracking-wider">Kcal</span>
                                </div>
                                <button 
                                    onClick={() => onRemoveMeal(meal.id)} 
                                    className="text-on-surface-variant hover:text-error transition-colors sm:opacity-0 group-hover:opacity-100"
                                    title="Xóa món ăn"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        
                        <p className="text-xs text-secondary mb-2 flex items-center gap-2">
                            <span>Khối lượng: <span className="font-semibold text-on-surface">{meal.weight}g</span></span>
                        </p>
                        
                        <div className="flex gap-4 text-[11px] font-mono text-outline-variant border-t border-outline-variant/50 pt-2 mt-2">
                            <span className="text-secondary"><span className="font-semibold text-on-surface">P:</span> {Number(meal.protein).toFixed(1)}g</span>
                            <span className="text-secondary"><span className="font-semibold text-on-surface">C:</span> {Number(meal.carbs).toFixed(1)}g</span>
                            {meal.fat !== undefined && (
                                <span className="text-secondary"><span className="font-semibold text-on-surface">F:</span> {Number(meal.fat).toFixed(1)}g</span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}