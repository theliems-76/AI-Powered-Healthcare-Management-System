import React from 'react';
import ProgressBar from '../../../components/ui/ProgressBar';
import { HeartPulse } from 'lucide-react';

export default function ExerciseStatsCard({ burnedCalories, dailyGoal }) {
    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
                <div className="mb-6">
                    <h2 className="font-semibold text-slate-800 text-lg">Mục tiêu vận động</h2>
                    <p className="text-xs text-slate-500">Năng lượng tiêu hao qua bài tập</p>
                </div>
                
                {}
                <ProgressBar 
                    title="Năng lượng đã đốt" 
                    current={burnedCalories} 
                    max={dailyGoal} 
                    unit="kcal" 
                    colorClass="bg-orange-500" 
                    type="goal"
                />
            </div>

            {}
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex gap-3 items-start">
                <HeartPulse className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                    <h3 className="font-semibold text-emerald-800 text-sm mb-1">Lợi ích Y khoa</h3>
                    <p className="text-xs text-emerald-700 leading-relaxed font-medium">
                        Mỗi 100 kcal đốt cháy qua vận động giúp cải thiện độ nhạy Insulin, giảm trực tiếp nguy cơ tiến triển Đái tháo đường Tuýp 2.
                    </p>
                </div>
            </div>
        </div>
    );
}