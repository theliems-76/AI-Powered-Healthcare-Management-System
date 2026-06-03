import React, { useState, useEffect } from 'react';

export default function AIThinkingSteps() {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const timer1 = setTimeout(() => setStep(1), 2500);
        const timer2 = setTimeout(() => setStep(2), 6000);
        return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }, []);

    const steps = [
        "Đồng bộ hồ sơ lâm sàng...",
        "Tính toán trọng số rủi ro (XAI)...",
        "Trích xuất phác đồ điều trị..."
    ];

    const progressPercentage = Math.round(((step + 1) / steps.length) * 100);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 py-24 px-8 flex flex-col items-center justify-center min-h-[450px] shadow-sm animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col items-center max-w-sm w-full">
                
                {/* Header & Percentage */}
                <div className="w-full flex justify-between items-end mb-4 px-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Tiến trình phân tích
                    </span>
                    <span className="text-xl font-black text-slate-900 tracking-tighter leading-none">
                        {progressPercentage}%
                    </span>
                </div>

                {/* Thin loading bar */}
                <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mb-16 relative">
                    {/* Subtle pulse for background to show activity */}
                    <div className="absolute inset-0 bg-white/50 w-full h-full animate-pulse"></div>
                    <div className="h-full bg-slate-900 transition-all duration-1000 ease-out relative" style={{ width: `${progressPercentage}%` }}></div>
                </div>

                {/* Steps text */}
                <div className="space-y-8 w-full pl-4 border-l border-slate-100 relative">
                    {/* Active step indicator on the line */}
                    <div 
                        className="absolute left-[-2.5px] w-1 h-8 bg-slate-900 rounded-full transition-all duration-700 ease-out"
                        style={{ top: `${step * 3.5}rem` }} // Approximation, using spacing
                    ></div>
                    
                    {steps.map((text, idx) => {
                        const isActive = idx === step;
                        const isPast = idx < step;
                        return (
                            <div key={idx} className={`flex items-baseline gap-6 transition-all duration-700 ease-out ${isActive || isPast ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                                <span className={`text-[10px] font-black tracking-widest ${isPast ? 'text-slate-300' : isActive ? 'text-slate-900' : 'text-slate-200'}`}>
                                    {String(idx + 1).padStart(2, '0')}
                                </span>
                                <p className={`text-[13px] md:text-sm font-bold transition-colors duration-500 tracking-wide ${isPast ? 'text-slate-400' : isActive ? 'text-slate-900' : 'text-slate-200'}`}>
                                    {text}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
