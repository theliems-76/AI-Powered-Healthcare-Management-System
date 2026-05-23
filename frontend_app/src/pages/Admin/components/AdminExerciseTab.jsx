import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import AdminPagination from './AdminPagination';
import { Loader2, Search, Dumbbell, UploadCloud, Plus, Edit, Trash2 } from 'lucide-react';

import JSONImportModal from './JSONImportModal';
import SingleExerciseModal from './SingleExerciseModal';

export default function AdminExerciseTab() {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [pagination, setPagination] = useState(null);
    const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
    const [isSingleModalOpen, setIsSingleModalOpen] = useState(false);
    const [editingExercise, setEditingExercise] = useState(null);

    const fetchData = useCallback(async (page = 1, searchQuery = search) => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/exercises?page=${page}&limit=20&search=${searchQuery}`);
            setExercises(res.data.data);
            setPagination(res.data.pagination);
        } catch (error) {
            toast.error("Lỗi lấy danh sách bài tập!");
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
            const res = await api.post('/admin/exercises/bulk', { data: parsedData });
            toast.success(res.data.message);
            fetchData(1, search);
            setIsJsonModalOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.error || "Lỗi import! Vui lòng kiểm tra lại cấu trúc JSON.");
        }
    };

    const handleEdit = (exercise) => {
        setEditingExercise(exercise);
        setIsSingleModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa bài tập này?")) return;
        try {
            await api.delete(`/admin/exercises/${id}`);
            toast.success("Đã xóa bài tập!");
            fetchData(pagination?.page || 1, search);
        } catch (error) {
            toast.error("Lỗi xóa bài tập!");
        }
    };

    return (
        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
            <JSONImportModal 
                isOpen={isJsonModalOpen}
                onClose={() => setIsJsonModalOpen(false)}
                onSubmit={handleImportSubmit}
                title="Nhập dữ liệu Bài tập (JSON)"
                instructions='Copy yêu cầu sau (Prompt) và dán vào AI: "Trả cho tôi mảng JSON gồm 20 bài tập thể dục, cấu trúc: [{ \"name\": \"Chạy bộ\", \"category\": \"Cardio\", \"met_value\": 8.3 }]"'
                exampleJSON={`[\n  { "name": "Bơi lội", "category": "Cardio", "met_value": 6.0 }\n]`}
            />
            
            <SingleExerciseModal 
                isOpen={isSingleModalOpen}
                onClose={() => {
                    setIsSingleModalOpen(false);
                    setEditingExercise(null);
                }}
                onSuccess={() => fetchData(1, search)}
                initialData={editingExercise}
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-blue-400 to-indigo-500 shadow-sm"></div>
                    <h2 className="text-base font-bold text-slate-900 uppercase tracking-widest flex items-center gap-3">
                        Kho Bài Tập Hệ Thống
                        {loading && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
                    </h2>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="TÌM KIẾM BÀI TẬP..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-sm"
                        />
                    </form>
                    <button 
                        onClick={() => setIsJsonModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-3 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all active:scale-95 w-full sm:w-auto justify-center"
                    >
                        <UploadCloud className="w-4 h-4" />
                        Nhập JSON
                    </button>
                    <button 
                        onClick={() => setIsSingleModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-slate-900/10 active:scale-95 w-full sm:w-auto justify-center"
                    >
                        <Plus className="w-4 h-4" />
                        Thêm mới
                    </button>
                </div>
            </div>
            
            <div className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden transition-all hover:shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                <th className="p-5">Tên bài tập</th>
                                <th className="p-5">Phân loại</th>
                                <th className="p-5">MET (Tiêu hao)</th>
                                <th className="p-5 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {exercises.length === 0 && !loading ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-slate-500">Không có dữ liệu.</td>
                                </tr>
                            ) : (
                                exercises.map(ex => (
                                    <tr key={ex.id} className="hover:bg-slate-50/50 transition-colors group border-b border-slate-50 last:border-0">
                                        <td className="p-5 font-bold text-sm text-slate-900">{ex.name}</td>
                                        <td className="p-5">
                                            <span className="px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-600 rounded-xl text-[10px] font-bold uppercase tracking-widest">{ex.category || 'Khác'}</span>
                                        </td>
                                        <td className="p-5 text-sm font-bold text-blue-500">{ex.met_value}</td>
                                        <td className="p-5 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(ex)} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"><Edit className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(ex.id)} className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"><Trash2 className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {pagination && (
                    <div className="px-4 border-t border-slate-200">
                        <AdminPagination pagination={{...pagination, limit: 20}} onPageChange={(p) => fetchData(p, search)} />
                    </div>
                )}
            </div>
        </div>
    );
}
