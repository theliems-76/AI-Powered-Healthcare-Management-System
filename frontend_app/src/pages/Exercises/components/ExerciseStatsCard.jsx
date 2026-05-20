import React from 'react';
import ProgressBar from '../../../components/ui/ProgressBar';

export default function ExerciseStatsCard({ burnedCalories, dailyGoal }) {
    const isGoalMet = burnedCalories >= dailyGoal;

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="mb-6">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mục tiêu hằng ngày</p>
                    <h2 className="text-base font-black text-slate-900 tracking-tight">Mục tiêu Vận động</h2>
                </div>
                
                <div className="space-y-6">
                    {/* Năng lượng đốt cháy */}
                    <div>
                        <div className="flex justify-between items-baseline mb-2">
                            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Đã đốt cháy</span>
                            <div className="text-right flex items-baseline gap-1">
                                <span className={`font-black text-lg ${isGoalMet ? 'text-emerald-500' : 'text-slate-900'}`}>{Math.round(burnedCalories)}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">/ {dailyGoal} KCAL</span>
                            </div>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className={`h-full transition-all duration-500 ${isGoalMet ? 'bg-emerald-500' : 'bg-slate-900'}`} 
                                style={{ width: `${Math.min((burnedCalories / dailyGoal) * 100, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Medical Advice equivalent */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm">
                <h3 className="font-bold text-slate-400 text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Lợi ích Y khoa
                </h3>
                <p className="text-sm font-medium text-slate-300 leading-relaxed">
                    Mỗi 100 kcal đốt cháy qua vận động giúp cải thiện độ nhạy Insulin, giảm trực tiếp nguy cơ tiến triển Đái tháo đường Tuýp 2.
                </p>
            </div>
        </div>
    );
}