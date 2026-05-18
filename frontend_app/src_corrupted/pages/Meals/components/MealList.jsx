import React from 'react';
import { Trash2, Sun, SunDim, Moon, Coffee } from 'lucide-react';

export default function MealList({ meals, onRemoveMeal }) {
    if (meals.length === 0) {
        return (
            <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                <p className="text-slate-500 text-sm font-medium">Chưa có món ăn nào được thêm.</p>
            </div>
        );
    }

    const timeOrder = ['Sáng', 'Trưa', 'Tối', 'Phụ'];
    const timeIcons = {
        'Sáng': <Sun className="w-6 h-6 text-amber-500" />,
        'Trưa': <SunDim className="w-6 h-6 text-orange-500" />,
        'Tối': <Moon className="w-6 h-6 text-indigo-500" />,
        'Phụ': <Coffee className="w-6 h-6 text-emerald-500" />
    };

    const groupedMeals = timeOrder.map(time => ({
        time,
        items: meals.filter(m => m.time === time)
    })).filter(group => group.items.length > 0);

    return (
        <div className="space-y-0">
            {groupedMeals.map((group, index) => (
                <div key={group.time} className="flex gap-4 group/timeline">
                    {/* Cột Timeline */}
                    <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-white border border-slate-200 rounded-full shadow-sm z-10 transition-transform group-hover/timeline:scale-110">
                            {timeIcons[group.time]}
                        </div>
                        {/* Đường dọc nối tiếp (ẩn đi ở mục cuối cùng nếu muốn, hoặc cứ để nhạt) */}
                        {index !== groupedMeals.length - 1 && (
                            <div className="flex-1 w-0.5 bg-slate-100 my-2 group-hover/timeline:bg-blue-100 transition-colors"></div>
                        )}
                    </div>

                    {/* Cột Nội dung */}
                    <div className={`flex-1 ${index !== groupedMeals.length - 1 ? 'pb-8' : 'pb-2'}`}>
                        {/* Header của Buổi */}
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 mt-2">
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">
                                Buổi {group.time}
                            </h3>
                            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg">
                                {Math.round(group.items.reduce((sum, item) => sum + item.calories, 0))} KCAL
                            </span>
                        </div>
                        
                        {/* Danh sách Món ăn */}
                        <div className="space-y-3">
                            {group.items.map(meal => (
                                <div key={meal.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white hover:border-blue-200 hover:shadow-md transition-all group/item">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-800 text-sm">
                                            {meal.name} <span className="text-slate-400 font-medium ml-1">({meal.weight}g)</span>
                                        </h4>
                                        <p className="text-xs text-slate-500 mt-1 font-medium">
                                            Carbs: {Number(meal.carbs).toFixed(1)}g <span className="text-slate-300 mx-1">&bull;</span> Protein: {Number(meal.protein).toFixed(1)}g
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between sm:justify-end gap-4 mt-3 sm:mt-0">
                                        <div className="text-right">
                                            <span className="font-black text-lg text-slate-800">{Math.round(meal.calories)}</span>
                                            <span className="text-[10px] text-slate-500 ml-1 font-bold">KCAL</span>
                                        </div>
                                        <button 
                                            onClick={() => onRemoveMeal(meal.id)} 
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors sm:opacity-0 group-hover/item:opacity-100"
                                            title="Xóa món ăn"
                                        >
                                            <Trash2 className="w-4.5 h-4.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
