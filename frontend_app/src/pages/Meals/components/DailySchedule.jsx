import React from 'react';
import { getLocalDateString } from '../../../utils/dateUtils';

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
    
    const todayString = getLocalDateString();

    return (
        <div className="flex w-full bg-slate-200/50 p-1.5 rounded-2xl">
            {weekDates.map((date, index) => {
                const dateString = getLocalDateString(date);
                const isSelected = selectedDate === dateString;
                const isToday = todayString === dateString;

                return (
                    <button
                        key={index}
                        onClick={() => onSelectDate(dateString)}
                        className={`flex-1 flex flex-col items-center py-2 rounded-xl transition-all relative ${
                            isSelected 
                                ? 'bg-white shadow-sm text-slate-900' 
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                        }`}
                    >
                        <span className={`text-[10px] font-bold uppercase mb-0.5 ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>
                            {dayNames[index]}
                        </span>
                        <span className="text-sm font-black">{date.getDate()}</span>
                        
                        {/* Dot Today */}
                        {isToday && <div className={`absolute bottom-1 w-1 h-1 rounded-full ${isSelected ? 'bg-slate-900' : 'bg-slate-400'}`}></div>}
                    </button>
                );
            })}
        </div>
    );
}