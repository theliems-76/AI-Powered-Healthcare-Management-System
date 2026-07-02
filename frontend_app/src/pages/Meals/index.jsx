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
        <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
            
            {/* Modals */}
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

            {/* Header */}
            <div className="pb-6 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 shrink-0">
                <div>
                    <h1 className="text-3xl font-semibold text-on-surface tracking-tight uppercase">Quản Lý Dinh Dưỡng</h1>
                    <p className="text-[12px] font-bold text-on-surface-variant uppercase tracking-widest mt-2">Theo dõi năng lượng và xây dựng thực đơn cá nhân.</p>
                </div>
                <div className="flex gap-3 mt-4 sm:mt-0">
                    <button 
                        onClick={() => handleOpenRecipeBuilder()} 
                        className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-widest text-on-surface bg-surface border-2 border-outline-variant rounded-xl hover:bg-surface-container-high transition-colors shadow-sm active:scale-95"
                    >
                        Tạo món ăn
                    </button>
                    <button 
                        onClick={() => setIsModalOpen(true)} 
                        className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-widest text-on-primary bg-primary rounded-xl hover:opacity-90 transition-all shadow-xl shadow-primary/20 active:scale-95"
                    >
                        Thêm vào nhật ký
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
                <div className="col-span-12 lg:col-span-8">
                    <MealBudgetCard 
                        dailyGoal={dailyGoal} 
                        consumed={consumed} 
                    />
                </div>

                {/* AI Insights Card */}
                <div className="col-span-12 lg:col-span-4 bg-primary-container text-on-primary-container rounded-xl p-6 flex flex-col border border-primary relative overflow-hidden shadow-sm">
                    <div className="relative z-10 flex-1">
                        <div className="flex items-center gap-2 mb-4 opacity-90">
                            <h3 className="font-bold text-[12px] uppercase tracking-widest">Góc Chuyên Gia</h3>
                        </div>
                        <p className="text-lg font-semibold leading-tight mb-4">Đánh giá dinh dưỡng lâm sàng</p>
                        <p className="text-sm opacity-90 leading-relaxed">
                            {medicalAdvice || "Đang phân tích dữ liệu lượng ăn để đưa ra lời khuyên phù hợp."}
                        </p>
                    </div>
                </div>

                {/* Nutrition Plan Section */}
                <div className="col-span-12">
                    <div className="bg-surface border border-outline-variant rounded-xl p-6">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-outline-variant">
                            <h3 className="font-semibold text-on-surface text-xl tracking-tight">AI Meal Plan (Nhật Ký)</h3>
                            <span className="bg-surface-container-high px-3 py-1 rounded text-[10px] font-bold text-secondary uppercase tracking-widest">
                                {new Date(selectedDate).toLocaleDateString('vi-VN')}
                            </span>
                        </div>
                        <div className="max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                            <MealList meals={meals} onRemoveMeal={handleRemoveMeal} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}