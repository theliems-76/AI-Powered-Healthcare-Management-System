import React from 'react';
import { Trash2 } from 'lucide-react';

export default function MealList({ meals, onRemoveMeal }) {
    if (meals.length === 0) {
        return (
            <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <p className="text-slate-400 text-sm font-medium">Chưa có món ăn nào được thêm.</p>
            </div>
        );
    }

    const timeOrder = ['Sáng', 'Trưa', 'Tối', 'Phụ'];
    const timeColorMap = {
        'Sáng': 'bg-amber-50 text-amber-700 border-amber-100',
        'Trưa': 'bg-orange-50 text-orange-700 border-orange-100',
        'Tối': 'bg-indigo-50 text-indigo-700 border-indigo-100',
        'Phụ': 'bg-emerald-50 text-emerald-700 border-emerald-100'
    };
    const timeIconBgMap = {
        'Sáng': 'bg-amber-100 text-amber-600',
        'Trưa': 'bg-orange-100 text-orange-600',
        'Tối': 'bg-indigo-100 text-indigo-600',
        'Phụ': 'bg-emerald-100 text-emerald-600'
    };

    const groupedMeals = timeOrder.map(time => ({
        time,
        items: meals.filter(m => m.time === time)
    })).filter(group => group.items.length > 0);

    return (
        <div className="space-y-6">
            {groupedMeals.map((group) => {
                const headerColor = timeColorMap[group.time] || 'bg-slate-50 text-slate-700 border-slate-200';
                const badgeColor = timeIconBgMap[group.time] || 'bg-slate-100 text-slate-600';
                
                return (
                <div key={group.time} className={`rounded-2xl border overflow-hidden shadow-sm ${headerColor.split(' ')[2]}`}>
                    {/* Header Buổi */}
                    <div className={`px-5 py-3 border-b flex items-center justify-between ${headerColor}`}>
                        <h3 className="text-[11px] font-bold uppercase tracking-widest">
                            Buổi {group.time}
                        </h3>
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md ${badgeColor}`}>
                            {Math.round(group.items.reduce((sum, item) => sum + item.calories, 0))} KCAL
                        </span>
                    </div>
                    
                    {/* Danh sách Món ăn */}
                    <div className="divide-y divide-slate-100 bg-white">
                        {group.items.map(meal => (
                            <div key={meal.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 group hover:bg-slate-50/50 transition-colors">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-slate-800 text-sm tracking-tight">{meal.name}</h4>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${badgeColor}`}>{meal.weight}g</span>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-500 mt-1.5 uppercase tracking-widest">
                                        Carbs: <span className="text-slate-700">{Number(meal.carbs).toFixed(1)}g</span> <span className="mx-2 text-slate-200">•</span> Protein: <span className="text-slate-700">{Number(meal.protein).toFixed(1)}g</span>
                                    </p>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end gap-6 mt-3 sm:mt-0">
                                    <div className="text-right flex items-baseline gap-1">
                                        <span className="font-black text-lg text-slate-800">{Math.round(meal.calories)}</span>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Kcal</span>
                                    </div>
                                    <button 
                                        onClick={() => onRemoveMeal(meal.id)} 
                                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors sm:opacity-0 group-hover:opacity-100"
                                        title="Xóa món ăn"
                                    >
                                        <Trash2 className="w-4.5 h-4.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                );
            })}
        </div>
    );
}