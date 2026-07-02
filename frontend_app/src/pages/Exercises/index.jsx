import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';

import ExerciseStatsCard from './components/ExerciseStatsCard';
import ExerciseList from './components/ExerciseList';
import DailySchedule from '../Meals/components/DailySchedule'; 
import ExerciseSearchModal from '../../components/exercises/ExerciseSearchModal';
import ExerciseBuilderModal from '../../components/exercises/ExerciseBuilderModal';
import { getLocalDateString } from '../../utils/dateUtils';

export default function Exercises() {
    const [selectedDate, setSelectedDate] = useState(getLocalDateString());

    const [userWeight, setUserWeight] = useState(65);
    const DAILY_BURN_GOAL = 500; 

    const[burnedCalories, setBurnedCalories] = useState(0);
    const [exercises, setExercises] = useState([]);
    
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isBuilderOpen, setIsBuilderOpen] = useState(false);
    const[editingEx, setEditingEx] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/users/profile');
                if (res.data.data?.Profile?.weight_kg) {
                    setUserWeight(res.data.data.Profile.weight_kg);
                }
            } catch (err) {
                console.log("Dùng cân nặng mặc định");
            }
        };
        fetchProfile();
    },[]);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const res = await api.get(`/exercises/schedule?date=${selectedDate}`);
                const fetchedData = res.data.data ||[];
                
                const formattedEx = fetchedData.map(item => ({
                    id: item.id,
                    name: item.Exercise ? item.Exercise.name : 'Bài tập',
                    met: item.Exercise ? item.Exercise.met_value : 0,
                    duration: item.duration_minutes,
                    calories: parseFloat(item.calories_burned)
                }));

                setExercises(formattedEx);
                setBurnedCalories(formattedEx.reduce((sum, item) => sum + item.calories, 0));
            } catch (err) {
                console.error("Lỗi tải bài tập:", err);
            }
        };
        fetchExercises();
    },[selectedDate]);

    const handleOpenBuilder = (ex = null) => {
        setEditingEx(ex);
        setIsBuilderOpen(true);
    };

    const handleEditExercise = (ex) => {
        setEditingEx(ex);
        setIsSearchOpen(false);
        setIsBuilderOpen(true);
    };

    const handleAddExercise = async (exercise, minutes) => {
        const hours = minutes / 60;
        const caloriesBurned = Math.round(exercise.met_value * userWeight * hours);

        try {
            const payload = {
                exercise_id: exercise.id,
                duration_minutes: minutes,
                calories_burned: caloriesBurned,
                date: selectedDate
            };
            
            const response = await api.post('/exercises/schedule', payload);
            
            if (response.data.status === 'success') {
                const newEx = {
                    id: response.data.data.id,
                    name: exercise.name,
                    duration: minutes,
                    calories: caloriesBurned,
                    met: exercise.met_value
                };

                setExercises(prev => [...prev, newEx]);
                setBurnedCalories(prev => prev + caloriesBurned);
                
                toast.success(`Đốt cháy ${caloriesBurned} kcal!`);
                setIsSearchOpen(false);
            }
        } catch (error) {
            toast.error("Lỗi khi thêm bài tập!");
        }
    };

    const handleRemoveExercise = async (logId) => {
        const exToRemove = exercises.find(e => e.id === logId);
        if (!exToRemove) return;

        try {
            await api.delete(`/exercises/schedule/${logId}`);
            
            setBurnedCalories(prev => Math.max(0, prev - exToRemove.calories));
            setExercises(prev => prev.filter(e => e.id !== logId));
            toast.success("Đã xóa hoạt động khỏi nhật ký!");
        } catch (error) {
            toast.error("Lỗi khi xóa bản ghi!");
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
            
            {/* Modals */}
            <ExerciseSearchModal 
                isOpen={isSearchOpen} 
                onClose={() => setIsSearchOpen(false)} 
                onAddExercise={handleAddExercise} 
                onEditExercise={handleEditExercise}
            />
            
            <ExerciseBuilderModal 
                isOpen={isBuilderOpen} 
                initialData={editingEx}
                onClose={() => {
                    setIsBuilderOpen(false);
                    setEditingEx(null);
                }} 
                onBack={() => {
                    setIsBuilderOpen(false);
                    setEditingEx(null);
                    setIsSearchOpen(true);
                }}
                onCreated={() => {
                    setIsBuilderOpen(false);
                    setEditingEx(null);
                    setIsSearchOpen(true);
                }} 
            />

            {/* Header */}
            <div className="pb-6 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 shrink-0">
                <div>
                    <h1 className="text-3xl font-semibold text-on-surface tracking-tight uppercase">Nhật Ký Tập Luyện</h1>
                    <p className="text-[12px] font-bold text-on-surface-variant uppercase tracking-widest mt-2">Theo dõi năng lượng tiêu hao chuẩn y khoa.</p>
                </div>
                <div className="flex gap-3 mt-4 sm:mt-0">
                    <button 
                        onClick={() => handleOpenBuilder(null)} 
                        className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-widest text-on-surface bg-surface border-2 border-outline-variant rounded-xl hover:bg-surface-container-high transition-colors shadow-sm active:scale-95"
                    >
                        Tạo môn mới
                    </button>
                    <button 
                        onClick={() => setIsSearchOpen(true)} 
                        className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-widest text-on-primary bg-primary rounded-xl hover:opacity-90 transition-all shadow-xl shadow-primary/20 active:scale-95"
                    >
                        Thêm bài tập
                    </button>
                </div>
            </div>

            {/* Daily Schedule Row */}
            <div className="bg-surface border border-outline-variant rounded-xl p-4 mb-6">
                <DailySchedule selectedDate={selectedDate} onSelectDate={setSelectedDate} />
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-12 gap-6">
                
                {/* Progress Overview Card */}
                <div className="col-span-12 lg:col-span-6">
                    <ExerciseStatsCard burnedCalories={burnedCalories} dailyGoal={DAILY_BURN_GOAL} />
                </div>

                {/* Dynamic Insights Card (Frontend Calculated) */}
                <div className="col-span-12 lg:col-span-6 bg-surface-container-low text-on-surface rounded-xl p-6 flex flex-col border border-outline-variant relative overflow-hidden shadow-sm">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-outline-variant/50">
                        <span className="material-symbols-outlined text-primary"></span>
                        <h3 className="font-bold text-[12px] uppercase tracking-widest text-primary">Phân tích Vận động</h3>
                    </div>
                    
                    {exercises.length > 0 ? (
                        <div className="space-y-4 flex-1">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-on-surface-variant">Tổng thời gian:</span>
                                <span className="text-sm font-bold">{exercises.reduce((sum, ex) => sum + ex.duration, 0)} phút</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-on-surface-variant">Cường độ cao nhất:</span>
                                <span className="text-sm font-bold text-orange-600">
                                    {exercises.reduce((max, ex) => ex.met > max.met ? ex : max, exercises[0]).name} 
                                    <span className="text-[10px] ml-1 text-secondary font-mono">(MET: {exercises.reduce((max, ex) => ex.met > max.met ? ex : max, exercises[0]).met})</span>
                                </span>
                            </div>
                            <div className="mt-4 p-3 bg-surface border border-outline-variant rounded-lg">
                                <p className="text-xs leading-relaxed font-medium">
                                    {exercises.reduce((sum, ex) => sum + ex.duration, 0) >= 30 
                                        ? "🔥 Tuyệt vời! Bạn đã duy trì vận động trên 30 phút, rất tốt cho hệ tim mạch và độ nhạy insulin."
                                        : "💡 Hãy cố gắng tích lũy đủ 30 phút vận động mỗi ngày để đạt hiệu quả sức khỏe tối ưu nhé."}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-70">
                            <span className="material-symbols-outlined text-4xl mb-2 text-outline-variant">fitness_center</span>
                            <p className="text-xs font-medium">Chưa có dữ liệu để phân tích.<br/>Hãy ghi nhận bài tập đầu tiên của bạn!</p>
                        </div>
                    )}
                </div>

                {/* Exercise Table Section */}
                <div className="col-span-12">
                    <div className="bg-surface border border-outline-variant rounded-xl p-6">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-outline-variant">
                            <h3 className="font-semibold text-on-surface text-xl tracking-tight">Workout Routine (Hoạt Động)</h3>
                            <span className="bg-surface-container-high px-3 py-1 rounded text-[10px] font-bold text-secondary uppercase tracking-widest">
                                {new Date(selectedDate).toLocaleDateString('vi-VN')}
                            </span>
                        </div>
                        <div className="max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                            <ExerciseList exercises={exercises} onRemoveExercise={handleRemoveExercise} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}