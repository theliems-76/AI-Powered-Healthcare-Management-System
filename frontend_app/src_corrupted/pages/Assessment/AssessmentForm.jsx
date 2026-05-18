import React from 'react';
import { Activity, HeartPulse, History, Loader2 } from 'lucide-react';
import Tooltip from '../../components/ui/Tooltip'; 

export default function AssessmentForm({ formData, handleChange, handleSubmit, isLoading, readOnly = false }) {
    return (
        <section>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold tracking-tight text-slate-800 mb-1 ">
                        {readOnly ? "Hồ sơ khám bệnh chi tiết" : "Khảo Sát Lâm Sàng (21 Chỉ Số)"}
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">
                        {readOnly ? "Thông tin ghi nhận từ phiên khám trước. Không thể chỉnh sửa." : "Hệ thống dùng Chi-Square để tự động trích xuất 15 đặc trưng cốt lõi nhất."}
                    </p>
                </div>
                {!readOnly && (
                    <button 
                        onClick={handleSubmit} disabled={isLoading}
                        className={`flex items-center px-6 py-2.5 rounded-xl font-bold shadow-sm transition-all active:scale-95 text-sm ${
                            isLoading ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                    >
                        {isLoading ? <Loader2 className="animate-spin mr-2 w-4 h-4" /> : <Activity className="mr-2 w-4 h-4 text-emerald-400" />}
                        {isLoading ? 'Đang phân tích...' : 'Phân Tích AI & Sinh Thực Đơn'}
                    </button>
                )}
            </div>

            <div className={`bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden ${readOnly ? 'opacity-80 pointer-events-none' : ''}`}>
                <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
                
                {/* Cột 1: Sinh trắc học */}
                <div className="p-8 flex flex-col">
                    <div className="flex items-center space-x-3 mb-6">
                        <HeartPulse className="text-slate-900 w-5 h-5" />
                        <h3 className="font-bold text-base text-slate-900 uppercase tracking-wide">1. Sinh trắc học</h3>
                    </div>
                    <div className="space-y-3 flex-1">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Độ tuổi</label>
                                <select disabled={readOnly} name="Age" value={formData.Age} onChange={handleChange} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium text-slate-700">
                                    <option value={1}>18 - 24 tuổi</option>
                                    <option value={2}>25 - 29 tuổi</option>
                                    <option value={3}>30 - 34 tuổi</option>
                                    <option value={4}>35 - 39 tuổi</option>
                                    <option value={5}>40 - 44 tuổi</option>
                                    <option value={6}>45 - 49 tuổi</option>
                                    <option value={7}>50 - 54 tuổi</option>
                                    <option value={8}>55 - 59 tuổi</option>
                                    <option value={9}>60 - 64 tuổi</option>
                                    <option value={10}>65 - 69 tuổi</option>
                                    <option value={11}>70 - 74 tuổi</option>
                                    <option value={12}>75 - 79 tuổi</option>
                                    <option value={13}>Trên 80 tuổi</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Giới tính</label>
                                <select disabled={readOnly} name="Sex" value={formData.Sex} onChange={handleChange} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium text-slate-700">
                                    <option value={1}>Nam</option><option value={0}>Nữ</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Chiều cao (cm)</label>
                                <input disabled={readOnly} type="number" name="height_cm" value={formData.height_cm || ""} onChange={handleChange} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="VD: 170" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Cân nặng (kg)</label>
                                <input disabled={readOnly} type="number" name="weight_kg" value={formData.weight_kg || ""} onChange={handleChange} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="VD: 65" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between bg-blue-50/50 p-2.5 rounded-xl border border-blue-100">
                            <Tooltip text="Dưới 18.5: Gầy | 18.5-24.9: Bình thường | >= 25: Béo phì">
                                <label className="text-[10px] font-bold text-blue-700 uppercase cursor-help flex items-center">
                                    Chỉ số BMI (AI tính)
                                </label>
                            </Tooltip>
                            <span className="font-black text-blue-700 text-lg">
                                {formData.BMI > 0 ? formData.BMI : "--"}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Huyết áp cao</label>
                                <select disabled={readOnly} name="HighBP" value={formData.HighBP} onChange={handleChange} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm font-medium text-slate-700"><option value={0}>Không</option><option value={1}>Có</option></select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Cholesterol cao</label>
                                <select disabled={readOnly} name="HighChol" value={formData.HighChol} onChange={handleChange} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm font-medium text-slate-700"><option value={0}>Không</option><option value={1}>Có</option></select>
                            </div>
                        </div>
                        <div className="space-y-1 mt-auto pt-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Đã đo Cholesterol 5 năm qua?</label>
                            <select disabled={readOnly} name="CholCheck" value={formData.CholCheck} onChange={handleChange} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm text-blue-700 font-semibold"><option value={1}>Đã kiểm tra</option><option value={0}>Chưa kiểm tra</option></select>
                        </div>
                    </div>
                </div>

                {/* Cột 2: Lối sống */}
                <div className="p-8 flex flex-col">
                    <div className="flex items-center space-x-3 mb-6">
                        <Activity className="text-slate-900 w-5 h-5" />
                        <h3 className="font-bold text-base text-slate-900 uppercase tracking-wide">2. Lối sống & Thói quen</h3>
                    </div>
                    <div className="space-y-2 flex-1">
                        {[
                            { name: 'Smoker', label: 'Hút thuốc lá (>= 100 điếu/đời)' },
                            { name: 'PhysActivity', label: 'Tập thể dục trong 30 ngày qua' },
                            { name: 'Fruits', label: 'Ăn trái cây ít nhất 1 lần/ngày' },
                            { name: 'Veggies', label: 'Ăn rau xanh ít nhất 1 lần/ngày' },
                            { name: 'HvyAlcoholConsump', label: 'Lạm dụng rượu bia nặng' }
                        ].map((item) => (
                            <div key={item.name} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                <p className="font-semibold text-xs text-slate-700 w-2/3">{item.label}</p>
                                <select disabled={readOnly} name={item.name} value={formData[item.name]} onChange={handleChange} className="text-xs bg-white border border-slate-200 rounded-md py-1 px-2 outline-none font-bold text-emerald-700">
                                    <option value={0}>Không</option><option value={1}>Có</option>
                                </select>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cột 3: Y tế */}
                <div className="p-8 flex flex-col">
                    <div className="flex items-center space-x-3 mb-6">
                        <History className="text-slate-900 w-5 h-5" />
                        <h3 className="font-bold text-base text-slate-900 uppercase tracking-wide">3. Bệnh sử & Y tế</h3>
                    </div>
                    <div className="space-y-3 flex-1">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-rose-50 p-2 rounded-lg border border-rose-100">
                                <label className="text-[10px] font-bold text-rose-700 uppercase block mb-1">Bệnh Tim mạch</label>
                                <select disabled={readOnly} name="HeartDiseaseorAttack" value={formData.HeartDiseaseorAttack} onChange={handleChange} className="w-full bg-white border-none rounded text-xs font-bold text-rose-700 p-1"><option value={0}>Không</option><option value={1}>Có</option></select>
                            </div>
                            <div className="bg-rose-50 p-2 rounded-lg border border-rose-100">
                                <label className="text-[10px] font-bold text-rose-700 uppercase block mb-1">Tiền sử Đột quỵ</label>
                                <select disabled={readOnly} name="Stroke" value={formData.Stroke} onChange={handleChange} className="w-full bg-white border-none rounded text-xs font-bold text-rose-700 p-1"><option value={0}>Không</option><option value={1}>Có</option></select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Sức khỏe chung</label>
                                <select disabled={readOnly} name="GenHlth" value={formData.GenHlth} onChange={handleChange} className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-sm font-medium text-slate-700 outline-none">
                                    <option value={1}>1 - Rất xuất sắc</option>
                                    <option value={2}>2 - Rất tốt</option>
                                    <option value={3}>3 - Tốt</option>
                                    <option value={4}>4 - Bình thường</option>
                                    <option value={5}>5 - Yếu / Kém</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Khó đi lại/Leo thang</label>
                                <select disabled={readOnly} name="DiffWalk" value={formData.DiffWalk} onChange={handleChange} className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-sm font-medium text-slate-700 outline-none"><option value={0}>Không</option><option value={1}>Có</option></select>
                            </div>
                        </div>
                        
                        <div className="flex gap-2">
                            <div className="flex-1 space-y-1">
                                <Tooltip text="Số ngày thấy bất ổn tâm lý trong 30 ngày qua">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase cursor-help">Ngày ốm (Tâm lý)</label>
                                </Tooltip>
                                <input disabled={readOnly} type="number" min="0" max="30" name="MentHlth" value={formData.MentHlth === 0 ? "" : formData.MentHlth} onChange={handleChange} className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-sm text-center" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <Tooltip text="Số ngày ốm yếu thể chất trong 30 ngày qua">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase cursor-help">Ngày ốm (Thể chất)</label>
                                </Tooltip>
                                <input disabled={readOnly} type="number" min="0" max="30" name="PhysHlth" value={formData.PhysHlth === 0 ? "" : formData.PhysHlth} onChange={handleChange} className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-sm text-center" />
                            </div>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 mt-2">
                            <div className="grid grid-cols-2 gap-x-3 gap-y-3">
                                <div>
                                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Bảo hiểm Y tế</label>
                                    <select disabled={readOnly} name="AnyHealthcare" value={formData.AnyHealthcare} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded text-xs font-semibold text-blue-700 p-1"><option value={1}>Có BH</option><option value={0}>Không BH</option></select>
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Bỏ khám vì tiền (1 năm)</label>
                                    <select disabled={readOnly} name="NoDocbcCost" value={formData.NoDocbcCost} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded text-xs font-semibold text-rose-600 p-1"><option value={0}>Không</option><option value={1}>Có</option></select>
                                </div>
                                <div className="col-span-2 grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Học vấn</label>
                                        <select disabled={readOnly} name="Education" value={formData.Education} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded text-[11px] font-medium text-slate-700 py-1 px-1 outline-none">
                                            <option value={1}>Chưa đi học</option>
                                            <option value={2}>Tiểu học</option>
                                            <option value={3}>THCS (Cấp 2)</option>
                                            <option value={4}>THPT (Cấp 3)</option>
                                            <option value={5}>Cao đẳng/Nghề</option>
                                            <option value={6}>Đại học trở lên</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Thu nhập (Tháng)</label>
                                        <select disabled={readOnly} name="Income" value={formData.Income} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded text-[11px] font-medium text-slate-700 py-1 px-1 outline-none">
                                            <option value={1}>Dưới 5 triệu (Khó khăn)</option>
                                            <option value={2}>5 - 8 triệu</option>
                                            <option value={3}>8 - 12 triệu</option>
                                            <option value={4}>12 - 15 triệu</option>
                                            <option value={5}>15 - 20 triệu (Trung bình)</option>
                                            <option value={6}>20 - 30 triệu</option>
                                            <option value={7}>30 - 50 triệu (Khá)</option>
                                            <option value={8}>Trên 50 triệu (Cao)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
