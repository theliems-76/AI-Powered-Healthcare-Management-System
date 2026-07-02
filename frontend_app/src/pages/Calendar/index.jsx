import React, { useState, useEffect } from 'react';
import { 
    MdCalendarMonth as CalendarIcon, 
    MdChevronLeft as ChevronLeft, 
    MdChevronRight as ChevronRight, 
    MdLocalFireDepartment as Flame, 
    MdRestaurant as Utensils, 
    MdFitnessCenter as Activity, 
    MdArrowDownward as ArrowDown, 
    MdArrowUpward as ArrowUp, 
    MdInfo as Info 
} from 'react-icons/md';
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
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2 pt-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-on-surface tracking-tight leading-tight">Lịch Trình <br/><span className="text-primary">Dinh Dưỡng</span></h1>
                    <p className="text-sm text-on-surface-variant mt-2 max-w-md">Theo dõi nhật ký nạp và tiêu hao năng lượng mỗi ngày của bạn.</p>
                </div>
            </div>

            {/* Bento Grid Layout 12 Cols */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column - Calendar (8 Cols) */}
                <div className="lg:col-span-8 flex flex-col h-full">
                    <div className="bg-surface-container-lowest p-8 rounded-3xl flex-1 shadow-[0_12px_40px_rgba(0,24,72,0.06)] border-none">
                        {/* Calendar Header */}
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-display font-bold text-2xl text-on-surface">
                                {monthNames[currentDate.getMonth()]}, {currentDate.getFullYear()}
                            </h3>
                            <div className="flex gap-3">
                                <button onClick={prevMonth} className="p-3 bg-surface-container-low hover:bg-surface-container rounded-2xl text-on-surface-variant hover:text-on-surface transition-colors">
                                    <ChevronLeft className="w-6 h-6"/>
                                </button>
                                <button onClick={nextMonth} className="p-3 bg-surface-container-low hover:bg-surface-container rounded-2xl text-on-surface-variant hover:text-on-surface transition-colors">
                                    <ChevronRight className="w-6 h-6"/>
                                </button>
                            </div>
                        </div>
                        
                        {/* Days Header */}
                        <div className="grid grid-cols-7 gap-3 text-center text-xs font-bold text-outline uppercase tracking-wider mb-6">
                            <div>T2</div><div>T3</div><div>T4</div><div>T5</div><div>T6</div><div>T7</div><div>CN</div>
                        </div>
                        
                        {/* Grid */}
                        <div className="grid grid-cols-7 gap-3">
                            {days.map((dayObj, i) => {
                                if (!dayObj) return <div key={i} className="min-h-[110px] bg-transparent"></div>;
                                
                                const isSelected = selectedDate === dayObj.dateStr;
                                const data = monthlyData[dayObj.dateStr];
                                const hasData = !!data;
                                const isToday = dayObj.dateStr === getLocalDateString(today);

                                return (
                                    <div 
                                        key={i} 
                                        onClick={() => setSelectedDate(dayObj.dateStr)}
                                        className={`h-28 sm:h-32 p-3 rounded-2xl transition-all cursor-pointer relative flex flex-col overflow-hidden group
                                            ${isSelected ? 'bg-gradient-to-br from-primary to-primary-container text-white shadow-[0_8px_20px_rgba(37,99,235,0.25)]' : 
                                              isToday ? 'bg-surface-container-high' : 'bg-surface-container-low hover:bg-surface-container'}`}
                                    >
                                        <div className={`text-base font-display font-bold w-8 h-8 flex shrink-0 items-center justify-center rounded-xl transition-colors ${isSelected ? 'text-white' : isToday ? 'text-primary' : 'text-on-surface'}`}>
                                            {dayObj.date.getDate()}
                                        </div>

                                        {hasData ? (
                                            <div className="flex-1 mt-2 space-y-2 overflow-y-auto custom-scrollbar pr-1">
                                                {data.consumed > 0 && (
                                                    <div className={`flex items-center justify-between text-[10px] font-bold px-2 py-1.5 rounded-lg ${isSelected ? 'bg-white/20 text-white' : 'bg-secondary-container text-secondary'}`}>
                                                        <Utensils className="w-3.5 h-3.5 shrink-0" />
                                                        <span className="truncate ml-1">{data.consumed}</span>
                                                    </div>
                                                )}
                                                {data.burned > 0 && (
                                                    <div className={`flex items-center justify-between text-[10px] font-bold px-2 py-1.5 rounded-lg ${isSelected ? 'bg-white/20 text-white' : 'bg-primary-fixed text-on-primary-fixed'}`}>
                                                        <Activity className="w-3.5 h-3.5 shrink-0" />
                                                        <span className="truncate ml-1">{data.burned}</span>
                                                    </div>
                                                )}
                                                {data.appointments && data.appointments.length > 0 && (
                                                    <div className={`flex items-center justify-between text-[10px] font-bold px-2 py-1.5 rounded-lg ${isSelected ? 'bg-white/20 text-white' : 'bg-tertiary-fixed text-on-tertiary-fixed'}`}>
                                                        <CalendarIcon className="w-3.5 h-3.5 shrink-0" />
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

                {/* Right Column - Stats & Timeline (4 Cols) */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                    
                    {/* Deficit Card */}
                    <div className="bg-surface-container-lowest rounded-3xl p-6 lg:p-8 flex flex-col relative overflow-hidden shadow-[0_12px_40px_rgba(0,24,72,0.06)] border-none">
                        <div className="flex justify-between items-start mb-6 z-10">
                            <div>
                                <h3 className="text-outline font-bold text-[10px] uppercase tracking-widest mb-1">
                                    Ngày {new Date(selectedDate).toLocaleDateString('vi-VN')}
                                </h3>
                                <h2 className="text-xl lg:text-2xl font-display font-bold tracking-tight text-on-surface">Cân Bằng Calo</h2>
                            </div>
                            <div className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 ${isWeightLoss ? 'bg-secondary-container text-secondary' : 'bg-error-container text-error'}`}>
                                {isWeightLoss ? <ArrowDown className="w-3.5 h-3.5"/> : <ArrowUp className="w-3.5 h-3.5"/>}
                                {Math.abs(selectedDayData.deficit)} kcal
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-4 z-10">
                            <div className="bg-surface-container-low p-3 rounded-2xl flex flex-col items-center text-center">
                                <Flame className="w-5 h-5 text-secondary mb-1.5" />
                                <div className="text-[9px] text-outline uppercase font-bold tracking-widest mb-1">Nạp vào</div>
                                <div className="text-lg font-display font-bold text-on-surface">{selectedDayData.consumed}</div>
                            </div>
                            <div className="bg-surface-container-low p-3 rounded-2xl flex flex-col items-center text-center">
                                <Activity className="w-5 h-5 text-primary mb-1.5" />
                                <div className="text-[9px] text-outline uppercase font-bold tracking-widest mb-1">Tiêu hao</div>
                                <div className="text-lg font-display font-bold text-on-surface">{selectedDayData.burned}</div>
                            </div>
                            <div className="bg-surface-container-low p-3 rounded-2xl flex flex-col items-center text-center">
                                <Info className="w-5 h-5 text-outline mb-1.5" />
                                <div className="text-[9px] text-outline uppercase font-bold tracking-widest mb-1">TDEE Nền</div>
                                <div className="text-lg font-display font-bold text-on-surface">{targetCalories}</div>
                            </div>
                        </div>

                        <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/30 flex gap-2 items-start z-10">
                            <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <p className="text-[10px] text-on-surface-variant font-medium leading-relaxed">
                                <strong className="text-on-surface">TDEE Nền</strong> là tổng năng lượng tiêu hao cơ bản. 
                                <br/> Thâm hụt = <span className="font-mono bg-surface-container-highest px-1 py-0.5 rounded text-primary">(Nạp) - (TDEE + Tiêu hao)</span>.
                            </p>
                        </div>
                    </div>

                    {/* Timeline Card */}
                    <div className="bg-surface-container-lowest rounded-3xl flex-1 overflow-hidden flex flex-col shadow-[0_12px_40px_rgba(0,24,72,0.06)] border-none">
                        <div className="px-6 py-5 bg-surface-container-low/50">
                            <h3 className="font-bold text-sm text-on-surface uppercase tracking-widest">
                                Hoạt Động Trong Ngày
                            </h3>
                        </div>

                        {isLoadingDay ? (
                            <div className="flex justify-center items-center flex-1 py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-3 border-primary"></div></div>
                        ) : timelineEvents.length === 0 ? (
                            <div className="text-center py-12 flex-1 flex flex-col items-center justify-center">
                                <CalendarIcon className="w-10 h-10 text-outline-variant mb-4 opacity-50" />
                                <p className="text-outline text-sm font-semibold tracking-wide">Chưa có lịch trình</p>
                            </div>
                        ) : (
                            <div className="flex-1 overflow-y-auto p-4 lg:p-6">
                                {timelineEvents.map((event, index) => {
                                    const isMeal = event.type === 'meal';
                                    const isAppt = event.type === 'appointment';
                                    const Icon = isMeal ? Utensils : isAppt ? CalendarIcon : Activity;
                                    
                                    let dotColor = isMeal ? 'bg-secondary-container text-secondary' : isAppt ? 'bg-tertiary-container text-tertiary' : 'bg-primary-container text-primary';

                                    return (
                                        <div key={event.id} className="flex items-stretch gap-3 lg:gap-4 group min-h-[64px]">
                                            {/* Time block */}
                                            <div className="w-[64px] lg:w-[72px] pt-2 flex-shrink-0 text-right">
                                                <span className="text-[10px] lg:text-[11px] font-bold text-on-surface-variant break-words leading-tight block">{event.time}</span>
                                            </div>
                                            
                                            {/* Dot & Line Column */}
                                            <div className="flex flex-col items-center flex-shrink-0 w-8">
                                                <div className={`z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-sm shrink-0 ${dotColor}`}>
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                                {index !== timelineEvents.length - 1 && (
                                                    <div className="w-[2px] flex-1 bg-surface-container-high my-1 rounded-full"></div>
                                                )}
                                            </div>
                                            
                                            {/* Content Block */}
                                            <div className="flex-1 min-w-0 bg-surface-container-low p-4 rounded-2xl group-hover:bg-surface-container transition-colors mb-6">
                                                <h4 className="font-display font-bold text-sm text-on-surface mb-1 truncate">{event.title}</h4>
                                                <p className="text-[11px] font-medium text-on-surface-variant leading-relaxed break-words">{event.desc}</p>
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