import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Flame, Utensils, Activity, ArrowDown, ArrowUp, AlertCircle, Info } from 'lucide-react';
import api from '../../services/api';
import { getLocalDateString } from '../../utils/dateUtils';

export default function CalendarSchedule() {
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [selectedDate, setSelectedDate] = useState(getLocalDateString(today));
    
    const [monthlyData, setMonthlyData] = useState({});
    const [targetCalories, setTargetCalories] = useState(2000);
    const [isLoadingMonth, setIsLoadingMonth] = useState(false);

    const [dailyMeals, setDailyMeals] = useState([]);
    const [dailyExercises, setDailyExercises] = useState([]);
    const [dailyAppointments, setDailyAppointments] = useState([]);
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
                const [mealsRes, exRes, apptRes] = await Promise.all([
                    api.get(`/meals/schedule?date=${selectedDate}`),
                    api.get(`/exercises/schedule?date=${selectedDate}`),
                    api.get(`/appointments?date=${selectedDate}`)
                ]);
                
                if (mealsRes.data.status === 'success') {
                    setDailyMeals(mealsRes.data.data || []);
                }
                if (exRes.data.status === 'success') {
                    setDailyExercises(exRes.data.data || []);
                }
                if (apptRes.data.status === 'success') {
                    setDailyAppointments(apptRes.data.data || []);
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
        })),
        ...dailyAppointments.map(a => ({
            id: `a-${a.id}`,
            time: a.appointment_time.slice(0, 5),
            title: `Lịch khám bệnh ${a.Doctor?.full_name ? `- BS. ${a.Doctor.full_name}` : ''}`,
            desc: `${a.reason || 'Khám định kỳ'} - Trạng thái: ${a.status === 'PENDING' ? 'Chờ duyệt' : a.status === 'CONFIRMED' ? 'Đã xác nhận' : a.status === 'COMPLETED' ? 'Đã khám' : 'Đã hủy'}`,
            type: 'appointment',
            timestamp: `${selectedDate}T${a.appointment_time}`
        }))
    ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    const selectedDayData = monthlyData[selectedDate] || { consumed: 0, burned: 0, deficit: 0 };
    const isWeightLoss = selectedDayData.deficit > 0;

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Lịch sử Hoạt động</p>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                        Lịch Hoạt Động & Dinh Dưỡng
                    </h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Theo dõi nhật ký nạp và tiêu hao năng lượng mỗi ngày.</p>
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
                                const isToday = dayObj.dateStr === getLocalDateString(today);

                                return (
                                    <div 
                                        key={i} 
                                        onClick={() => setSelectedDate(dayObj.dateStr)}
                                        className={`h-28 sm:h-32 p-2 sm:p-2.5 rounded-2xl border transition-all cursor-pointer relative flex flex-col overflow-hidden group
                                            ${isSelected ? 'bg-white border-transparent ring-2 ring-slate-900 shadow-md' : 
                                              isToday ? 'bg-slate-50 border-slate-300' : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50'}`}
                                    >
                                        <div className={`text-xs font-bold w-7 h-7 flex shrink-0 items-center justify-center rounded-full transition-colors ${isSelected ? 'bg-slate-900 text-white' : 'text-slate-700 group-hover:bg-slate-200'}`}>
                                            {dayObj.date.getDate()}
                                        </div>

                                        {hasData ? (
                                            <div className="flex-1 mt-2 space-y-1 overflow-y-auto custom-scrollbar pr-1">
                                                {data.consumed > 0 && (
                                                    <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-bold px-1.5 py-1 rounded bg-amber-50 text-amber-600">
                                                        <Utensils className="w-3 h-3 shrink-0" />
                                                        <span className="truncate ml-1">{data.consumed}</span>
                                                    </div>
                                                )}
                                                {data.burned > 0 && (
                                                    <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-bold px-1.5 py-1 rounded bg-emerald-50 text-emerald-600">
                                                        <Activity className="w-3 h-3 shrink-0" />
                                                        <span className="truncate ml-1">{data.burned}</span>
                                                    </div>
                                                )}
                                                {data.appointments && data.appointments.length > 0 && (
                                                    <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-bold px-1.5 py-1 rounded bg-blue-50 text-blue-600">
                                                        <CalendarIcon className="w-3 h-3 shrink-0" />
                                                        <span className="truncate ml-1">{data.appointments.length}</span>
                                                    </div>
                                                )}
                                            </div>
                                        ) : null}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    
                    {}
                    <div className="bg-slate-900 rounded-3xl p-6 shadow-sm text-white relative overflow-hidden">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-1">
                                    Ngày {new Date(selectedDate).toLocaleDateString('vi-VN')}
                                </h3>
                                <h2 className="text-2xl font-black tracking-tight text-white">Thâm Hụt Năng Lượng</h2>
                            </div>
                            <div className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 ${isWeightLoss ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                {isWeightLoss ? <ArrowDown className="w-3.5 h-3.5"/> : <ArrowUp className="w-3.5 h-3.5"/>}
                                {Math.abs(selectedDayData.deficit)} kcal
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-2">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 group hover:bg-white/10 transition-colors">
                                <Flame className="w-5 h-5 text-amber-400 mb-2" />
                                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Nạp vào</div>
                                <div className="text-xl font-black text-white">{selectedDayData.consumed}</div>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 group hover:bg-white/10 transition-colors">
                                <Activity className="w-5 h-5 text-emerald-400 mb-2" />
                                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Tiêu hao</div>
                                <div className="text-xl font-black text-white">{selectedDayData.burned}</div>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 group hover:bg-white/10 transition-colors">
                                <Info className="w-5 h-5 text-blue-400 mb-2" />
                                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">TDEE / Nền</div>
                                <div className="text-xl font-black text-white">{targetCalories}</div>
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold mt-4 uppercase tracking-widest">
                            Thâm hụt = (TDEE + Tiêu hao) - Nạp vào
                        </p>
                    </div>

                    {}
                    <div className="bg-white p-0 rounded-3xl shadow-sm border border-slate-200 flex-1 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/80">
                            <h3 className="font-bold text-[10px] text-slate-500 uppercase tracking-widest">
                                Chi tiết hoạt động
                            </h3>
                        </div>

                        {isLoadingDay ? (
                            <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-900"></div></div>
                        ) : timelineEvents.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-slate-400 text-sm font-medium">Chưa có dữ liệu trong ngày này.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {timelineEvents.map((event) => {
                                    const isMeal = event.type === 'meal';
                                    const isAppt = event.type === 'appointment';

                                    return (
                                        <div key={event.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50/50 transition-colors">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <h4 className={`font-bold text-sm tracking-tight ${isAppt ? 'text-blue-700' : 'text-slate-800'}`}>{event.title}</h4>
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-md">
                                                        {event.time}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] font-medium text-slate-500">{event.desc}</p>
                                            </div>
                                            <div className="mt-3 sm:mt-0 flex-shrink-0">
                                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border ${isMeal ? 'border-amber-200 text-amber-600 bg-amber-50' : isAppt ? 'border-blue-200 text-blue-600 bg-blue-50' : 'border-emerald-200 text-emerald-600 bg-emerald-50'}`}>
                                                    {isMeal ? 'NẠP VÀO' : isAppt ? 'LỊCH HẸN' : 'TIÊU HAO'}
                                                </span>
                                            </div>
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