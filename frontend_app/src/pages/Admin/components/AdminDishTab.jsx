import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import AdminPagination from './AdminPagination';
import { MdSearch, MdAdd, MdEdit, MdDelete, MdCloudUpload } from 'react-icons/md';

import JSONImportModal from './JSONImportModal';
import RecipeBuilderModal from '../../../components/meals/RecipeBuilderModal';
import ConfirmModal from '../../../components/common/ConfirmModal';

export default function AdminDishTab() {
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [pagination, setPagination] = useState(null);
    const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
    const [isSingleModalOpen, setIsSingleModalOpen] = useState(false);
    const [editingDish, setEditingDish] = useState(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    const fetchData = useCallback(async (page = 1, searchQuery = search) => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/dishes?page=${page}&limit=20&search=${searchQuery}`);
            setDishes(res.data.data);
            setPagination(res.data.pagination);
        } catch (error) {
            toast.error("Lỗi lấy danh sách món ăn!");
        } finally {
            setLoading(false);
        }
    }, [search]);

    useEffect(() => {
        fetchData(1, search);
    }, [fetchData]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchData(1, search);
    };

    const handleImportSubmit = async (jsonString) => {
        try {
            const parsedData = JSON.parse(jsonString);
            const res = await api.post('/admin/dishes/bulk', { data: parsedData });
            toast.success(res.data.message);
            fetchData(1, search);
            setIsJsonModalOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.error || "Lỗi import! Vui lòng kiểm tra lại cấu trúc JSON.");
        }
    };

    const handleEdit = (dish) => {
        setEditingDish(dish);
        setIsSingleModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/admin/dishes/${id}`);
            toast.success("Đã xóa món ăn!");
            fetchData(pagination?.page || 1, search);
        } catch (error) {
            toast.error("Lỗi xóa món ăn!");
        }
    };

    return (
        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
            <JSONImportModal 
                isOpen={isJsonModalOpen}
                onClose={() => setIsJsonModalOpen(false)}
                onSubmit={handleImportSubmit}
                title="Nhập dữ liệu Món ăn (JSON)"
                instructions='Copy yêu cầu sau (Prompt) và dán vào AI: "Trả cho tôi mảng JSON gồm 20 món ăn. Mỗi món bắt buộc phải có danh sách nguyên liệu (ingredients), bao gồm khối lượng (weight) và các chỉ số dinh dưỡng / 100g. Cấu trúc: [{ \"name\": \"Cơm sườn\", \"category\": \"Món chính\", \"ingredients\": [{ \"name\": \"Cơm trắng\", \"weight\": 200, \"calories_per_100g\": 130, \"carbs_per_100g\": 28, \"protein_per_100g\": 2.7, \"fat_per_100g\": 0.3 }] }]"'
                exampleJSON={`[\n  {\n    "name": "Cơm sườn",\n    "category": "Trưa",\n    "ingredients": [\n      { "name": "Cơm trắng", "weight": 200, "calories_per_100g": 130, "carbs_per_100g": 28, "protein_per_100g": 2.7, "fat_per_100g": 0.3 },\n      { "name": "Sườn non", "weight": 100, "calories_per_100g": 277, "carbs_per_100g": 0, "protein_per_100g": 14, "fat_per_100g": 23 }\n    ]\n  }\n]`}
            />

            <RecipeBuilderModal 
                isOpen={isSingleModalOpen}
                onClose={() => {
                    setIsSingleModalOpen(false);
                    setEditingDish(null);
                }}
                onDishCreated={() => fetchData(1, search)}
                initialData={editingDish}
                isAdmin={true}
            />

            <ConfirmModal 
                isOpen={!!deleteConfirmId}
                onClose={() => setDeleteConfirmId(null)}
                onConfirm={() => handleDelete(deleteConfirmId)}
                title="Xóa món ăn"
                message="Bạn có chắc chắn muốn xóa món ăn hệ thống này? Thao tác này không thể hoàn tác."
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500 shadow-[0_4px_12px_rgba(0,24,72,0.04)]"></div>
                    <h2 className="text-base font-bold text-slate-900 uppercase tracking-widest flex items-center gap-3">
                        Kho Món Ăn Hệ Thống
                        {loading && <div className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full w-4 h-4  text-outline"></div>}
                    </h2>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
                        <MdSearch className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
                        <input
                            type="text"
                            placeholder="TÌM KIẾM MÓN ĂN..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all shadow-[0_4px_12px_rgba(0,24,72,0.04)]"
                        />
                    </form>
                    <button 
                        onClick={() => setIsJsonModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-3 bg-surface-container border border-outline-variant hover:bg-surface-container-high text-on-surface-variant text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all active:scale-95 w-full sm:w-auto justify-center"
                    >
                        <MdCloudUpload className="w-4 h-4" />
                        Nhập JSON
                    </button>
                    <button 
                        onClick={() => setIsSingleModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-slate-900/10 active:scale-95 w-full sm:w-auto justify-center"
                    >
                        <MdAdd className="w-4 h-4" />
                        Thêm mới
                    </button>
                </div>
            </div>
            
            <div className="bg-surface-container-lowest border border-slate-100 rounded-[2rem] shadow-[0_4px_12px_rgba(0,24,72,0.04)] overflow-hidden transition-all hover:shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 text-outline text-[10px] font-bold uppercase tracking-widest">
                                <th className="p-5">Tên Món ăn</th>
                                <th className="p-5">Phân loại</th>
                                <th className="p-5 text-center">Calories/100g</th>
                                <th className="p-5 text-center">Carbs/100g</th>
                                <th className="p-5 text-center">Protein/100g</th>
                                <th className="p-5 text-center">Fat/100g</th>
                                <th className="p-5 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {dishes.length === 0 && !loading ? (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-on-surface-variant">Không có dữ liệu.</td>
                                </tr>
                            ) : (
                                dishes.map(dish => (
                                    <tr key={dish.id} className="hover:bg-slate-50/50 transition-colors group border-b border-slate-50 last:border-0">
                                        <td className="p-5 font-bold text-sm text-slate-900">{dish.name}</td>
                                        <td className="p-5">
                                            <span className="inline-block whitespace-nowrap px-3 py-1.5 bg-surface-container-low border border-outline-variant text-on-surface-variant rounded-xl text-[10px] font-bold uppercase tracking-widest">{dish.category || 'Khác'}</span>
                                        </td>
                                        <td className="p-5 text-sm font-bold text-amber-500 text-center">{dish.calories_per_100g}</td>
                                        <td className="p-5 text-sm font-bold text-outline text-center">{dish.carbs_per_100g}g</td>
                                        <td className="p-5 text-sm font-bold text-emerald-500 text-center">{dish.protein_per_100g}g</td>
                                        <td className="p-5 text-sm font-bold text-rose-500 text-center">{dish.fat_per_100g}g</td>
                                        <td className="p-5 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(dish)} className="p-2 text-outline hover:text-slate-900 hover:bg-surface-container-high rounded-xl transition-colors"><MdEdit className="w-4 h-4" /></button>
                                            <button onClick={() => setDeleteConfirmId(dish.id)} className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"><MdDelete className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {pagination && (
                    <div className="px-4 border-t border-outline-variant">
                        <AdminPagination 
                            pagination={pagination} 
                            onPageChange={fetchData} 
                            itemName="món ăn"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
