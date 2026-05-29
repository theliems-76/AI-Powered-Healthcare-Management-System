import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';

import MealBudgetCard from './components/MealBudgetCard';
import MealList from './components/MealList';
import DailySchedule from './components/DailySchedule';
import FoodSearchModal from '../../components/meals/FoodSearchModal';
import RecipeBuilderModal from '../../components/meals/RecipeBuilderModal';

import { getLocalDateString } from '../../utils/dateUtils';

export default function Meals() {
    const [selectedDate, setSelectedDate] = useState(getLocalDateString());
    const [dailyGoal, setDailyGoal] = useState({ calories: 2000, carbs: 250, protein: 100 });
    const [consumed, setConsumed] = useState({ calories: 0, carbs: 0, protein: 0 });
    const [medicalAdvice, setMedicalAdvice] = useState("");
    const [meals, setMeals] = useState([]);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRecipeOpen, setIsRecipeOpen] = useState(false); 
    const [editingDish, setEditingDish] = useState(null);

    const handleOpenRecipeBuilder = (dish = null) => {
        setEditingDish(dish);
        setIsRecipeOpen(true);
    };

    const handleEditDish = (dish) => {
        setEditingDish(dish);
        setIsModalOpen(false);
        setIsRecipeOpen(true);
    };

    useEffect(() => {
        const fetchDailyGoal = async () => {
            try {
                const response = await api.get('/meals/daily-goal');
                if (response.data?.data) {
                    setDailyGoal(response.data.data);
                    setMedicalAdvice(response.data.advice);
                }
            } catch (error) {
                console.log("Sử dụng định mức Calo mặc định.");
            }
        };
        fetchDailyGoal();
    }, []);

    useEffect(() => {
        const fetchMealsByDate = async () => {
            try {
                const response = await api.get(`/meals/schedule?date=${selectedDate}`);
                const fetchedMeals = response.data.data || [];
                
                const formattedMeals = fetchedMeals.map(m => ({
                    id: m.id,
                    time: m.meal_time,
                    name: m.Dish ? m.Dish.name : 'Món ăn tự chọn',
                    weight: m.weight_grams || 100,
                    calories: parseFloat(m.total_calories_calculated) || 0,
                    carbs: parseFloat(m.total_carbs_calculated) || 0,
                    protein: parseFloat(m.total_protein_calculated) || 0
                }));

                setMeals(formattedMeals);

                const totals = formattedMeals.reduce((acc, curr) => ({
                    calories: acc.calories + curr.calories,
                    carbs: acc.carbs + curr.carbs,
                    protein: acc.protein + curr.protein
                }), { calories: 0, carbs: 0, protein: 0 });

                setConsumed(totals);
            } catch (error) {
                console.error("Lỗi lấy thực đơn ngày:", error);
            }
        };
        fetchMealsByDate();
    }, [selectedDate]);

    const handleAddMeal = async (selectedDish, weight = 100) => {
        try {
            const analyzeRes = await api.get(`/meals/analyze/${selectedDish.id}`);
            const nutrition = analyzeRes.data.total_nutrition;
            
            let validTime = selectedDish.category;
            if (validTime === 'Trưa/Tối') validTime = 'Trưa';
            if (!['Sáng', 'Trưa', 'Tối', 'Phụ'].includes(validTime)) validTime = 'Phụ';

            const ratio = weight / 100;
            const mealData = {
                dish_id: selectedDish.id,
                meal_time: validTime,
                date: selectedDate,
                weight_grams: weight,
                total_calories_calculated: parseFloat(nutrition.total_calories) * ratio,
                total_carbs_calculated: parseFloat(nutrition.total_carbs) * ratio,
                total_protein_calculated: parseFloat(nutrition.total_protein) * ratio
            };

            const response = await api.post('/meals/schedule', mealData);
            
            if (response.data.status === 'success') {
                toast.success('Đã ghi vào nhật ký!');
                
                const newMeal = { 
                    id: response.data.data.id, 
                    time: validTime, 
                    name: selectedDish.name, 
                    ...mealData,
                    weight: mealData.weight_grams,
                    calories: mealData.total_calories_calculated,
                    carbs: mealData.total_carbs_calculated,
                    protein: mealData.total_protein_calculated
                };

                setMeals(prev => [...prev, newMeal]);
                setConsumed(prev => ({
                    calories: prev.calories + newMeal.calories,
                    carbs: prev.carbs + newMeal.carbs,
                    protein: prev.protein + newMeal.protein
                }));
            }
        } catch (error) {
            toast.error("Lỗi khi thêm món ăn!");
        }
    };

    const handleRemoveMeal = async (mealId) => {
        const mealToRemove = meals.find(m => m.id === mealId);
        if (!mealToRemove) return;

        try {
            await api.delete(`/meals/schedule/${mealId}`);
            
            setConsumed(prev => ({
                calories: Math.max(0, prev.calories - mealToRemove.calories),
                carbs: Math.max(0, prev.carbs - mealToRemove.carbs),
                protein: Math.max(0, prev.protein - mealToRemove.protein)
            }));
            setMeals(prev => prev.filter(m => m.id !== mealId));
            toast.success("Đã xóa món ăn khỏi nhật ký!");
        } catch (error) {
            toast.error("Lỗi khi xóa bữa ăn!");
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
            
            {}
            <FoodSearchModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onAddMeal={handleAddMeal} 
                onEditDish={handleEditDish}
                dailyGoal={dailyGoal}
                consumed={consumed}
            />
            
            <RecipeBuilderModal 
                isOpen={isRecipeOpen} 
                initialData={editingDish}
                onClose={() => {
                    setIsRecipeOpen(false);
                    setEditingDish(null);
                }} 
                onBack={() => {
                    setIsRecipeOpen(false);
                    setEditingDish(null);
                    setIsModalOpen(true);
                }}
                onDishCreated={() => {
                    setIsRecipeOpen(false);
                    setEditingDish(null);
                    setIsModalOpen(true); 
                }}
            />

            {}
            <div className="pb-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 shrink-0">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Quản Lý Dinh Dưỡng</h1>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Theo dõi năng lượng và xây dựng thực đơn cá nhân.</p>
                </div>
                <div className="flex gap-3 mt-4 sm:mt-0">
                    <button 
                        onClick={() => handleOpenRecipeBuilder()} 
                        className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-widest text-slate-700 bg-white border-2 border-slate-200 rounded-xl hover:border-slate-300 transition-colors shadow-sm active:scale-95"
                    >
                        Tạo món ăn
                    </button>
                    <button 
                        onClick={() => setIsModalOpen(true)} 
                        className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-widest text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                    >
                        Thêm vào nhật ký
                    </button>
                </div>
            </div>

            {}
            <div className="flex-1 bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col lg:flex-row min-h-[75vh]">
                
                <div className="w-full lg:w-1/3 bg-slate-50/50 p-6 md:p-8 border-r border-slate-100 flex flex-col gap-8 shrink-0">
                    <div>
                        <h3 className="font-bold text-[10px] text-slate-500 uppercase tracking-widest mb-4">Lịch trình</h3>
                        <DailySchedule selectedDate={selectedDate} onSelectDate={setSelectedDate} />
                    </div>
                    
                    <MealBudgetCard 
                        dailyGoal={dailyGoal} 
                        consumed={consumed} 
                        medicalAdvice={medicalAdvice} 
                    />
                </div>

                <div className="w-full lg:w-2/3 p-6 md:p-8 flex flex-col bg-white relative overflow-hidden">
                    <div className="mb-8 pb-4 border-b border-slate-100 flex justify-between items-end shrink-0">
                        <h2 className="font-black text-slate-900 text-xl tracking-tight">
                            Nhật ký ngày {new Date(selectedDate).toLocaleDateString('vi-VN')}
                        </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        <MealList meals={meals} onRemoveMeal={handleRemoveMeal} />
                    </div>
                </div>
            </div>
        </div>
    );
}