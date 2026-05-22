import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';

import ExerciseStatsCard from './components/ExerciseStatsCard';
import ExerciseList from './components/ExerciseList';
import DailySchedule from '../Meals/components/DailySchedule'; 
import ExerciseSearchModal from '../../components/exercises/ExerciseSearchModal';
import ExerciseBuilderModal from '../../components/exercises/ExerciseBuilderModal';

export default function Exercises() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

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
        <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
            
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
            <div className="pb-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 shrink-0">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Nhật Ký Tập Luyện</h1>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Theo dõi năng lượng tiêu hao chuẩn y khoa.</p>
                </div>
                <div className="flex gap-3 mt-4 sm:mt-0">
                    <button 
                        onClick={() => handleOpenBuilder(null)} 
                        className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-widest text-slate-700 bg-white border-2 border-slate-200 rounded-xl hover:border-slate-300 transition-colors shadow-sm active:scale-95"
                    >
                        Tạo môn mới
                    </button>
                    <button 
                        onClick={() => setIsSearchOpen(true)} 
                        className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-widest text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                    >
                        Thêm bài tập
                    </button>
                </div>
            </div>

            {/* Unified Panel */}
            <div className="flex-1 bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col lg:flex-row min-h-[75vh]">
                
                {/* Left Panel: Schedule & Stats */}
                <div className="w-full md:w-1/3 bg-slate-50/50 p-6 md:p-8 border-r border-slate-100 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
                    <DailySchedule selectedDate={selectedDate} onSelectDate={setSelectedDate} />
                    <div className="mt-8">
                        <ExerciseStatsCard burnedCalories={burnedCalories} dailyGoal={DAILY_BURN_GOAL} />
                    </div>
                </div>

                {/* Right Panel: Exercise List */}
                <div className="w-full lg:w-2/3 p-6 md:p-8 flex flex-col bg-white relative overflow-hidden">
                    <div className="mb-8 pb-4 border-b border-slate-100 flex justify-between items-end shrink-0">
                        <h2 className="font-black text-slate-900 text-xl tracking-tight">
                            Hoạt động ngày {new Date(selectedDate).toLocaleDateString('vi-VN')}
                        </h2>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        <ExerciseList exercises={exercises} onRemoveExercise={handleRemoveExercise} />
                    </div>
                </div>

            </div>
        </div>
    );
}