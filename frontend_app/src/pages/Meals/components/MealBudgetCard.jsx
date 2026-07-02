import React from 'react';

export default function MealBudgetCard({ dailyGoal, consumed }) {
    const isOverCalories = consumed.calories > dailyGoal.calories;
    const calPercentage = Math.min((consumed.calories / dailyGoal.calories) * 100, 100) || 0;
    
    // SVG Circle Math
    const radius = 58;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference - (calPercentage / 100) * circumference;

    const carbsPercentage = Math.min((consumed.carbs / dailyGoal.carbs) * 100, 100) || 0;
    const proteinPercentage = Math.min((consumed.protein / dailyGoal.protein) * 100, 100) || 0;

    return (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-surface border border-outline-variant rounded-xl p-6 relative overflow-hidden shadow-sm h-full">
            <div className="absolute left-0 top-0 h-full w-1 bg-primary"></div>
            
            {/* Caloric Target Circular Progress */}
            <div className="flex flex-col items-center justify-center p-4 text-center md:border-r border-b md:border-b-0 border-outline-variant border-dashed">
                <div className="relative w-32 h-32 mb-4">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle 
                            className="text-surface-container-highest stroke-current" 
                            cx="64" cy="64" r={radius} 
                            fill="transparent" strokeWidth="8"
                        ></circle>
                        <circle 
                            className={`${isOverCalories ? 'text-error' : 'text-primary'} stroke-current transition-all duration-700`} 
                            cx="64" cy="64" r={radius} 
                            fill="transparent" strokeWidth="8"
                            strokeDasharray={circumference}
                            strokeDashoffset={dashOffset}
                            strokeLinecap="round"
                        ></circle>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-3xl font-bold tracking-tight ${isOverCalories ? 'text-error' : 'text-on-surface'}`}>
                            {Math.round(consumed.calories)}
                        </span>
                        <span className="text-[10px] font-bold text-secondary uppercase tracking-widest mt-1">kcal</span>
                    </div>
                </div>
                <h4 className="font-semibold text-on-surface text-sm mb-1">Mục Tiêu Năng Lượng</h4>
                <p className="text-xs text-secondary">
                    {Math.round(calPercentage)}% định mức ({dailyGoal.calories} kcal)
                </p>
            </div>

            {/* Macro Distribution */}
            <div className="flex flex-col justify-center gap-4 p-4 md:pl-8">
                <h4 className="font-semibold text-on-surface text-sm mb-2">Chỉ Tiêu Đa Lượng</h4>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="font-bold text-on-surface-variant uppercase tracking-wider text-[10px]">Đạm (Protein)</span>
                            <span className={`font-mono text-[11px] ${consumed.protein > dailyGoal.protein ? 'text-error font-bold' : 'text-secondary'}`}>
                                {Math.round(consumed.protein)}g / {dailyGoal.protein}g
                            </span>
                        </div>
                        <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-500 ${consumed.protein > dailyGoal.protein ? 'bg-error' : 'bg-primary-container'}`} style={{ width: `${proteinPercentage}%` }}></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="font-bold text-on-surface-variant uppercase tracking-wider text-[10px]">Tinh Bột (Carbs)</span>
                            <span className={`font-mono text-[11px] ${consumed.carbs > dailyGoal.carbs ? 'text-error font-bold' : 'text-secondary'}`}>
                                {Math.round(consumed.carbs)}g / {dailyGoal.carbs}g
                            </span>
                        </div>
                        <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-500 ${consumed.carbs > dailyGoal.carbs ? 'bg-error' : 'bg-secondary-fixed-dim'}`} style={{ width: `${carbsPercentage}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}