import React from 'react';
import ProgressBar from '../../../components/ui/ProgressBar';
import { HeartPulse } from 'lucide-react';

export default function ExerciseStatsCard({ burnedCalories, dailyGoal }) {
    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
                <div className="mb-6">
                    <h2 className="font-semibold text-slate-800 text-lg">M?c tiêu v?n d?ng</h2>
                    <p className="text-xs text-slate-500">Nang lu?ng tiêu hao qua bài t?p</p>
                </div>
                
                {}
                <ProgressBar 
                    title="Nang lu?ng dã d?t" 
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
                    <h3 className="font-semibold text-emerald-800 text-sm mb-1">L?i ích Y khoa</h3>
                    <p className="text-xs text-emerald-700 leading-relaxed font-medium">
                        M?i 100 kcal d?t cháy qua v?n d?ng giúp c?i thi?n d? nh?y Insulin, gi?m tr?c ti?p nguy co ti?n tri?n Ðái tháo du?ng Tuýp 2.
                    </p>
                </div>
            </div>
        </div>
    );
}
