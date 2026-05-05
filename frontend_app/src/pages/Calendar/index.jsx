import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Flame, Utensils, Activity, ArrowDown, ArrowUp, AlertCircle, Info } from 'lucide-react';
import api from '../../services/api';

export default function CalendarSchedule() {
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [selectedDate, setSelectedDate] = useState(today.toISOString().split('T')[0]);
    
    const [monthlyData, setMonthlyData] = useState({});
    const [targetCalories, setTargetCalories] = useState(2000);
    const [isLoadingMonth, setIsLoadingMonth] = useState(false);

    const [dailyMeals, setDailyMeals] = useState([]);
    const [dailyExercises, setDailyExercises] = useState([]);
    const [isLoadingDay, setIsLoadingDay] = useState(false);

    useEffect(() => {
        const fetchMonthly = async () => {
            setIsLoadingMonth(true);
            try {
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth() + 1;
                const res = await api.get(`/calendar/monthly?year=${year}&month=${month}`);
                if (res.data.status === 'success') {
                    setMonthlyData(res.data.data || {});
                    setTargetCalories(res.data.target_calories || 2000);
                }
            } catch (error) {
                console.error("Lỗi tải lịch tháng:", error);
            } finally {
                setIsLoadingMonth(false);
            }
        };
        fetchMonthly();
    }, [currentDate]);

    useEffect(() => {
        const fetchDaily = async () => {
            setIsLoadingDay(true);
            try {
                const [mealsRes, exRes] = await Promise.all([
                    api.get(`/meals/schedule?date=${selectedDate}`),
                    api.get(`/exercises/schedule?date=${selectedDate}`)
                ]);
                
                if (mealsRes.data.status === 'success') {
                    setDailyMeals(mealsRes.data.data || []);
                }
                if (exRes.data.status === 'success') {
                    setDailyExercises(exRes.data.data || []);
                }
            } catch (error) {
                console.error("Lỗi tải chi tiết ngày:", error);
            } finally {
                setIsLoadingDay(false);
            }
        };
        if (selectedDate) fetchDaily();
    }, [selectedDate]);

    const getDaysInMonth = (year, month) => {
        const firstDay = new Date(year, month, 1).getDay(); 
        const startOffset = firstDay === 0 ? 6 : firstDay - 1;
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const days = [];
        for (let i = 0; i < startOffset; i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) {
            const d = new Date(year, month, i);
            const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            days.push({ date: d, dateStr });
        }
        return days;
    };

    const days = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];

    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

    const timelineEvents = [
        ...dailyMeals.map(m => ({
            id: `m-${m.id}`,
            time: m.meal_time,
            title: m.Dish ? m.Dish.name : 'Món ăn tự chọn',
            desc: `Nạp ${Math.round(m.total_calories_calculated)} kcal (Carb: ${Math.round(m.total_carbs_calculated)}g, Pro: ${Math.round(m.total_protein_calculated)}g)`,
            type: 'meal',
            timestamp: m.createdAt
        })),
        ...dailyExercises.map(e => ({
            id: `e-${e.id}`,
            time: 'Thể thao',
            title: e.Exercise ? e.Exercise.name : 'Bài tập tự do',
            desc: `Đốt cháy ${Math.round(e.calories_burned)} kcal trong ${e.duration_minutes} phút`,
            type: 'exercise',
            timestamp: e.createdAt
        }))
    ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    const selectedDayData = monthlyData[selectedDate] || { consumed: 0, burned: 0, deficit: 0 };
    const isWeightLoss = selectedDayData.deficit > 0;

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight font-[Manrope] flex items-center gap-3">
                        <CalendarIcon className="text-blue-600 w-8 h-8" />
                        Lịch Hoạt Động & Dinh Dưỡng
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Theo dõi nhật ký nạp và tiêu hao năng lượng mỗi ngày.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {}
                <div className="lg:col-span-7 space-y-6">
                    
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-xl text-slate-800">
                                {monthNames[currentDate.getMonth()]}, {currentDate.getFullYear()}
                            </h3>
                            <div className="flex gap-2">
                                <button onClick={prevMonth} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"><ChevronLeft className="w-5 h-5"/></button>
                                <button onClick={nextMonth} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"><ChevronRight className="w-5 h-5"/></button>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 mb-4">
                            <div>T2</div><div>T3</div><div>T4</div><div>T5</div><div>T6</div><div>T7</div><div>CN</div>
                        </div>
                        
                        <div className="grid grid-cols-7 gap-2">
                            {days.map((dayObj, i) => {
                                if (!dayObj) return <div key={i} className="min-h-[100px] bg-slate-50/50 rounded-xl border border-dashed border-slate-100"></div>;
                                
                                const isSelected = selectedDate === dayObj.dateStr;
                                const data = monthlyData[dayObj.dateStr];
                                const hasData = !!data;
                                const isToday = dayObj.dateStr === today.toISOString().split('T')[0];

                                return (
                                    <div 
                                        key={i} 
                                        onClick={() => setSelectedDate(dayObj.dateStr)}
                                        className={`min-h-[100px] p-2 rounded-xl border transition-all cursor-pointer relative overflow-hidden group
                                            ${isSelected ? 'bg-blue-600 border-blue-600 shadow-md shadow-blue-500/30' : 
                                              isToday ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-100 hover:border-blue-300 hover:shadow-sm'}`}
                                    >
                                        <div className={`text-sm font-bold mb-2 ${isSelected ? 'text-white' : 'text-slate-700'}`}>
                                            {dayObj.date.getDate()}
                                        </div>

                                        {hasData ? (
                                            <div className="space-y-1 mt-1">
                                                <div className={`flex items-center justify-between text-[10px] font-bold px-1.5 py-0.5 rounded ${isSelected ? 'bg-white/20 text-white' : 'bg-orange-50 text-orange-600'}`}>
                                                    <Utensils className="w-3 h-3" />
                                                    <span>{data.consumed}</span>
                                                </div>
                                                <div className={`flex items-center justify-between text-[10px] font-bold px-1.5 py-0.5 rounded ${isSelected ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-600'}`}>
                                                    <Activity className="w-3 h-3" />
                                                    <span>{data.burned}</span>
                                                </div>
                                            </div>
                                        ) : null}

                                        {}
                                        {isSelected && <div className="absolute top-0 right-0 w-8 h-8 bg-white/10 rounded-bl-full"></div>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    
                    {}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 shadow-xl text-white relative overflow-hidden">
                        <div className="absolute -right-6 -bottom-6 opacity-10"><Activity className="w-40 h-40" /></div>
                        
                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div>
                                <h3 className="text-slate-300 font-medium text-sm mb-1">Ngày {new Date(selectedDate).toLocaleDateString('vi-VN')}</h3>
                                <h2 className="text-2xl font-bold">Thâm Hụt Năng Lượng</h2>
                            </div>
                            <div className={`px-3 py-1.5 rounded-xl font-bold text-sm flex items-center gap-1 ${isWeightLoss ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                {isWeightLoss ? <ArrowDown className="w-4 h-4"/> : <ArrowUp className="w-4 h-4"/>}
                                {Math.abs(selectedDayData.deficit)} kcal
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-2 relative z-10">
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/5">
                                <Flame className="w-5 h-5 text-orange-400 mb-2" />
                                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Nạp vào</div>
                                <div className="text-lg font-bold">{selectedDayData.consumed}</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/5">
                                <Activity className="w-5 h-5 text-emerald-400 mb-2" />
                                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Tiêu hao</div>
                                <div className="text-lg font-bold">{selectedDayData.burned}</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/5">
                                <Info className="w-5 h-5 text-blue-400 mb-2" />
                                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">TDEE / Nền</div>
                                <div className="text-lg font-bold">{targetCalories}</div>
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 font-medium mt-3 text-center relative z-10">
                            Thâm hụt = (TDEE + Tiêu hao) - Nạp vào
                        </p>
                    </div>

                    {}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex-1">
                        <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2">
                            <Clock className="text-blue-600 w-5 h-5" /> Chi tiết hoạt động
                        </h3>

                        {isLoadingDay ? (
                            <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
                        ) : timelineEvents.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <AlertCircle className="w-8 h-8 text-slate-300" />
                                </div>
                                <p className="text-slate-500 font-medium">Chưa có dữ liệu ăn uống/tập luyện trong ngày này.</p>
                            </div>
                        ) : (
                            <div className="relative pl-3 border-l-2 border-slate-100 space-y-6">
                                {timelineEvents.map((event) => {
                                    const isMeal = event.type === 'meal';
                                    const Icon = isMeal ? Utensils : Activity;
                                    const bgColor = isMeal ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600';
                                    const dotColor = isMeal ? 'bg-orange-500' : 'bg-emerald-500';

                                    return (
                                        <div key={event.id} className="relative pl-5">
                                            <div className={`absolute -left-[21px] top-1 w-4 h-4 rounded-full border-4 border-white ${dotColor}`}></div>
                                            
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-slate-800 text-sm">{event.title}</h4>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${bgColor}`}>{event.time}</span>
                                            </div>
                                            <p className="text-xs font-medium text-slate-500">{event.desc}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}