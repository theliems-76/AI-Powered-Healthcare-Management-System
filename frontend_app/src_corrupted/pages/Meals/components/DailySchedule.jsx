import React from 'react';

export default function DailySchedule({ selectedDate, onSelectDate }) {
    const getWeekDates = () => {
        const curr = new Date();
        const day = curr.getDay() === 0 ? 7 : curr.getDay();
        
        const monday = new Date(curr);
        monday.setDate(curr.getDate() - day + 1);
        
        const dates =[];
        for (let i = 0; i < 7; i++) {
            const nextDate = new Date(monday);
            nextDate.setDate(monday.getDate() + i);
            dates.push(nextDate);
        }
        return dates;
    };

    const weekDates = getWeekDates();
    const dayNames =['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    
    const todayString = new Date().toISOString().split('T')[0];

    return (
        <div className="flex justify-between md:justify-start gap-2 md:gap-4 overflow-x-auto pb-2">
            {weekDates.map((date, index) => {
                const dateString = date.toISOString().split('T')[0];
                const isSelected = selectedDate === dateString;
                const isToday = todayString === dateString;

                return (
                    <button
                        key={index}
                        onClick={() => onSelectDate(dateString)}
                        className={`min-w-[65px] flex flex-col items-center p-3 rounded-xl border transition-all ${
                            isSelected 
                                ? 'bg-slate-800 border-slate-800 text-white shadow-md' 
                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400 hover:bg-slate-50'
                        }`}
                    >
                        <span className={`text-[10px] font-bold uppercase mb-1 ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                            {dayNames[index]}
                        </span>
                        <span className="text-lg font-black">{date.getDate()}</span>
                        
                        {}
                        {isToday && <div className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-white' : 'bg-rose-500'}`}></div>}
                    </button>
                );
            })}
        </div>
    );
}
