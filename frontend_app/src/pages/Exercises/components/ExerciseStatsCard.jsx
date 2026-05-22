import React from 'react';
import ProgressBar from '../../../components/ui/ProgressBar';
import { HeartPulse } from 'lucide-react';

export default function ExerciseStatsCard({ burnedCalories, dailyGoal }) {
    return (
        <div className="space-y-6">
            <div>
                <div className="mb-4">
                    <h2 className="font-black text-slate-900 tracking-tight">Mục tiêu vận động</h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Năng lượng tiêu hao qua bài tập</p>
                </div>
                
                <ProgressBar 
                    title="Năng lượng đã đốt" 
                    current={burnedCalories} 
                    max={dailyGoal} 
                    unit="kcal" 
                    colorClass="bg-orange-500" 
                    type="goal"
                />
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex gap-3 items-start shadow-sm mt-8">
                <HeartPulse className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                    <h3 className="font-bold text-slate-900 text-sm mb-1 tracking-tight">Lợi ích Y khoa</h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        Mỗi 100 kcal đốt cháy qua vận động giúp cải thiện độ nhạy Insulin, giảm trực tiếp nguy cơ tiến triển Đái tháo đường Tuýp 2.
                    </p>
                </div>
            </div>
        </div>
    );
}