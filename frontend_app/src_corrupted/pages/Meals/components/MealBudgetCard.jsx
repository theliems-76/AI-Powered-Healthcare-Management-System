import React from 'react';
import ProgressBar from '../../../components/ui/ProgressBar';

export default function MealBudgetCard({ dailyGoal, consumed, medicalAdvice }) {
    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
                <div className="mb-4">
                    <h2 className="font-semibold text-slate-800 text-lg">Ngân sách dinh du?ng</h2>
                    <p className="text-xs text-slate-500">M?c tiêu hàng ngày d?a trên h? so y t?</p>
                </div>
                
                <div className="space-y-5">
                    {}
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-slate-600">Nang lu?ng (Calo)</span>
                            <span className="font-bold text-slate-800">{consumed.calories} / {dailyGoal.calories} kcal</span>
                        </div>
                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className={`h-full transition-all duration-500 ${consumed.calories > dailyGoal.calories ? 'bg-red-500' : 'bg-slate-800'}`} 
                                style={{ width: `${Math.min((consumed.calories / dailyGoal.calories) * 100, 100)}%` }}
                            ></div>
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    {}
                    <ProgressBar title="Tinh b?t (Carbs)" current={consumed.carbs} max={dailyGoal.carbs} unit="g" colorClass="bg-blue-500" />
                    <ProgressBar title="Ð?m (Protein)" current={consumed.protein} max={dailyGoal.protein} unit="g" colorClass="bg-emerald-500" />
                </div>
            </div>

            {}
            {medicalAdvice && (
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <h3 className="font-semibold text-blue-800 text-sm mb-1">Ghi chú lâm sàng</h3>
                    <p className="text-sm text-blue-700 leading-relaxed">{medicalAdvice}</p>
                </div>
            )}
        </div>
    );
}
