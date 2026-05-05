import React from 'react';

export default function ProgressBar({ title, current, max, unit, colorClass = "bg-blue-500", type = "limit" }) {
    const percentage = Math.min((current / max) * 100, 100) || 0;
    const isOver = current > max;
    
    let finalColor = colorClass;
    let message = null;
    let textColor = 'text-slate-800';

    if (isOver) {
        if (type === "limit") {
            finalColor = "bg-rose-500";
            textColor = "text-rose-600";
            message = <p className="text-[10px] font-bold text-rose-500 mt-1 animate-pulse">⚠️ Vượt mức cho phép!</p>;
        } else if (type === "goal") {
            finalColor = "bg-emerald-500";
            textColor = "text-emerald-600";
            message = <p className="text-[10px] font-bold text-emerald-500 mt-1 animate-pulse">🎉 Vượt mục tiêu, quá tuyệt vời!</p>;
        }
    }

    return (
        <div className="w-full">
            <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-slate-700">{title}</span>
                <div className="text-right">
                    <span className={`text-xl font-black ${textColor}`}>
                        {current.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-slate-400 ml-1">
                        / {max.toLocaleString()} {unit}
                    </span>
                </div>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${finalColor}`} 
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            {message}
        </div>
    );
}