import React, { useState, useMemo } from 'react';
import { Database, Utensils, Dumbbell, Search, Plus } from 'lucide-react';

import FoodsTable from './components/Foodstable';
import ExercisesTable from './components/ExercisesTable';

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState('foods');
    const [searchTerm, setSearchTerm] = useState('');

    const [foods] = useState([
        { id: 1, name: 'Phở bò chín', calories: 430, carbs: 55, protein: 22, category: 'Sáng' },
        { id: 2, name: 'Cơm trắng', calories: 130, carbs: 28, protein: 2.7, category: 'Trưa/Tối' },
        { id: 3, name: 'Trứng gà luộc', calories: 77, carbs: 0.6, protein: 6.3, category: 'Sáng/Phụ' },
    ]);

    const [exercises] = useState([
        { id: 1, name: 'Đi bộ chậm (3 km/h)', met: 2.8, category: 'Cardio nhẹ' },
        { id: 2, name: 'Chạy bộ chậm (8 km/h)', met: 8.3, category: 'Cardio' },
        { id: 3, name: 'Yoga Hatha', met: 2.5, category: 'Kéo giãn' },
    ]);

    const filteredFoods = useMemo(() => 
        foods.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [foods, searchTerm]);

    const filteredExercises = useMemo(() => 
        exercises.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [exercises, searchTerm]);

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
            
            {}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight font-[Manrope] flex items-center gap-3">
                        <Database className="text-blue-600 w-8 h-8" /> Quản Trị Dữ Liệu Lõi
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Cấu hình từ điển Dinh dưỡng và Thể thao cho toàn hệ thống.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-sm transition-all shadow-lg shadow-blue-600/30 active:scale-95">
                    <Plus className="w-5 h-5" /> {activeTab === 'foods' ? 'Thêm Món Ăn Mới' : 'Thêm Môn Tập Mới'}
                </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                
                {}
                <div className="flex border-b border-slate-100 px-6 pt-4 gap-6 bg-slate-50/50">
                    <button 
                        onClick={() => { setActiveTab('foods'); setSearchTerm(''); }}
                        className={`flex items-center gap-2 pb-4 px-2 font-bold text-sm transition-all border-b-2 ${activeTab === 'foods' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        <Utensils className="w-4 h-4" /> Từ điển Món Ăn
                    </button>
                    <button 
                        onClick={() => { setActiveTab('exercises'); setSearchTerm(''); }}
                        className={`flex items-center gap-2 pb-4 px-2 font-bold text-sm transition-all border-b-2 ${activeTab === 'exercises' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        <Dumbbell className="w-4 h-4" /> Từ điển Thể Thao (MET)
                    </button>
                </div>

                {}
                <div className="p-6 border-b border-slate-100">
                    <div className="relative w-full md:w-96">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder={`Tìm kiếm ${activeTab === 'foods' ? 'món ăn' : 'môn thể thao'}...`} 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                </div>

                {}
                {activeTab === 'foods' ? (
                    <FoodsTable data={filteredFoods} />
                ) : (
                    <ExercisesTable data={filteredExercises} />
                )}

            </div>
        </div>
    );
}