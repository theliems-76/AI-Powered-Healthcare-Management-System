import React from 'react';

export default function ExerciseStatsCard({ burnedCalories, dailyGoal }) {
    const isGoalReached = burnedCalories >= dailyGoal;
    const burnPercentage = Math.min((burnedCalories / dailyGoal) * 100, 100) || 0;
    
    // SVG Circle Math
    const radius = 58;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference - (burnPercentage / 100) * circumference;

    return (
        <section className="grid grid-cols-1 gap-4 bg-surface border border-outline-variant rounded-xl p-6 relative overflow-hidden shadow-sm h-full">
            <div className="absolute left-0 top-0 h-full w-1 bg-tertiary"></div>
            
            {/* Caloric Target Circular Progress */}
            <div className="flex flex-col items-center justify-center p-4 text-center">
                <div className="relative w-32 h-32 mb-4">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle 
                            className="text-surface-container-highest stroke-current" 
                            cx="64" cy="64" r={radius} 
                            fill="transparent" strokeWidth="8"
                        ></circle>
                        <circle 
                            className={`${isGoalReached ? 'text-tertiary' : 'text-orange-500'} stroke-current transition-all duration-700`} 
                            cx="64" cy="64" r={radius} 
                            fill="transparent" strokeWidth="8"
                            strokeDasharray={circumference}
                            strokeDashoffset={dashOffset}
                            strokeLinecap="round"
                        ></circle>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-3xl font-bold tracking-tight ${isGoalReached ? 'text-tertiary' : 'text-on-surface'}`}>
                            {Math.round(burnedCalories)}
                        </span>
                        <span className="text-[10px] font-bold text-secondary uppercase tracking-widest mt-1">kcal</span>
                    </div>
                </div>
                <h4 className="font-semibold text-on-surface text-sm mb-1">Mục Tiêu Vận Động</h4>
                <p className="text-xs text-secondary">
                    {Math.round(burnPercentage)}% định mức ({dailyGoal} kcal)
                </p>
            </div>
        </section>
    );
}