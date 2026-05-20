import React from 'react';
import ProgressBar from '../../../components/ui/ProgressBar';

export default function MealBudgetCard({ dailyGoal, consumed, medicalAdvice }) {
    const isOverCalories = consumed.calories > dailyGoal.calories;
    
    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="mb-6">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mục tiêu hằng ngày</p>
                    <h2 className="text-base font-black text-slate-900 tracking-tight">Ngân sách Dinh dưỡng</h2>
                </div>
                
                <div className="space-y-6">
                    {/* Calo */}
                    <div>
                        <div className="flex justify-between items-baseline mb-2">
                            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Năng lượng</span>
                            <div className="text-right flex items-baseline gap-1">
                                <span className={`font-black text-lg ${isOverCalories ? 'text-rose-500' : 'text-slate-900'}`}>{Math.round(consumed.calories)}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">/ {dailyGoal.calories} KCAL</span>
                            </div>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className={`h-full transition-all duration-500 ${isOverCalories ? 'bg-rose-500' : 'bg-slate-900'}`} 
                                style={{ width: `${Math.min((consumed.calories / dailyGoal.calories) * 100, 100)}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="border-t border-slate-100"></div>

                    {/* Macros */}
                    <div className="space-y-5">
                        <ProgressBar title="TINH BỘT (CARBS)" current={consumed.carbs} max={dailyGoal.carbs} unit="g" colorClass="bg-emerald-500" />
                        <ProgressBar title="ĐẠM (PROTEIN)" current={consumed.protein} max={dailyGoal.protein} unit="g" colorClass="bg-amber-500" />
                    </div>
                </div>
            </div>

            {/* Medical Advice */}
            {medicalAdvice && (
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm">
                    <h3 className="font-bold text-slate-400 text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Ghi chú Lâm sàng
                    </h3>
                    <p className="text-sm font-medium text-slate-300 leading-relaxed">{medicalAdvice}</p>
                </div>
            )}
        </div>
    );
}