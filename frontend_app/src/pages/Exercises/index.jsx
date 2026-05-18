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
                
                toast.success(`Đốt cháy ${caloriesBurned} kcal!`, { icon: "🔥" });
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
            
            {}
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

            {}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 ">Nhật Ký Tập Luyện</h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Theo dõi năng lượng tiêu hao theo chuẩn Y khoa.</p>
                </div>
                <div className="flex gap-3 mt-4 sm:mt-0">
                    <button 
                        onClick={() => handleOpenBuilder(null)} 
                        className="px-5 py-2.5 text-sm font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors shadow-sm active:scale-95"
                    >
                        Tạo môn mới
                    </button>
                    <button 
                        onClick={() => setIsSearchOpen(true)} 
                        className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-md shadow-blue-200 transition-all active:scale-95"
                    >
                        Thêm bài tập
                    </button>
                </div>
            </div>

            {}
            <div className="mb-6">
                <DailySchedule selectedDate={selectedDate} onSelectDate={setSelectedDate} />
            </div>

            {}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <ExerciseStatsCard burnedCalories={burnedCalories} dailyGoal={DAILY_BURN_GOAL} />
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 h-full shadow-sm">
                        <div className="mb-6 flex justify-between items-center">
                            <h2 className="font-semibold text-slate-800 text-lg">
                                Hoạt động ngày {new Date(selectedDate).toLocaleDateString('vi-VN')}
                            </h2>
                        </div>
                        <ExerciseList exercises={exercises} onRemoveExercise={handleRemoveExercise} />
                    </div>
                </div>
            </div>
        </div>
    );
}