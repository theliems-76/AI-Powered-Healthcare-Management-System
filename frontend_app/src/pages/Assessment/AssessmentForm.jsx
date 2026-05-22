import React, { useState } from 'react';
import { Activity, HeartPulse, History, Loader2 } from 'lucide-react';
import Tooltip from '../../components/ui/Tooltip'; 

export default function AssessmentForm({ formData, handleChange, handleSubmit, isLoading, readOnly = false }) {
    const [hw, setHw] = useState({ h: '', w: '' });

    const handleHWChange = (e) => {
        const { name, value } = e.target;
        setHw(prev => {
            const next = { ...prev, [name]: value };
            if (next.h && next.w) {
                const heightM = parseFloat(next.h) / 100;
                const weightKg = parseFloat(next.w);
                if (heightM > 0) {
                    const bmi = (weightKg / (heightM * heightM)).toFixed(1);
                    handleChange({ target: { name: 'BMI', value: parseFloat(bmi) } });
                }
            }
            return next;
        });
    };

    return (
        <section>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-slate-100 pb-4">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-900 mb-1 uppercase">
                        {readOnly ? "Hồ sơ khám bệnh chi tiết" : "Khảo Sát Lâm Sàng"}
                    </h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        {readOnly ? "Ghi nhận từ phiên khám trước. Không thể chỉnh sửa." : "Trích xuất 21 đặc trưng cốt lõi (Chi-Square)"}
                    </p>
                </div>
                {!readOnly && (
                    <button 
                        onClick={handleSubmit} disabled={isLoading}
                        className={`flex items-center px-6 py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-slate-900/10 ${
                            isLoading ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                    >
                        {isLoading ? <Loader2 className="animate-spin mr-2 w-4 h-4" /> : null}
                        {isLoading ? 'Đang phân tích...' : 'Phân Tích AI'}
                    </button>
                )}
            </div>

            <div className={`bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden ${readOnly ? 'opacity-80 pointer-events-none' : ''}`}>
                <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
                
                {/* Cột 1: Sinh trắc học */}
                <div className="p-8 flex flex-col hover:bg-slate-50/50 transition-colors">
                    <div className="mb-6 border-l-2 border-slate-900 pl-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">01.</p>
                        <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">Sinh trắc học</h3>
                    </div>
                    <div className="space-y-4 flex-1">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Độ tuổi</label>
                                <select disabled={readOnly} name="Age" value={formData.Age} onChange={handleChange} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none text-xs font-bold text-slate-900 transition-all">
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
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Giới tính</label>
                                <select disabled={readOnly} name="Sex" value={formData.Sex} onChange={handleChange} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none text-xs font-bold text-slate-900 transition-all">
                                    <option value={1}>Nam</option><option value={0}>Nữ</option>
                                </select>
                            </div>
                        </div>
                        {readOnly ? (
                            <div className="space-y-1.5">
                                <Tooltip text="Dưới 18.5: Gầy | 18.5-24.9: Bình thường | >= 25: Béo phì">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest cursor-help border-b border-dashed border-slate-300">Chỉ số BMI</label>
                                </Tooltip>
                                <input disabled type="number" value={formData.BMI} className="w-full p-3 bg-slate-100 border border-transparent rounded-xl outline-none text-base font-black text-slate-900" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cao (cm)</label>
                                    <input type="number" name="h" value={hw.h} onChange={handleHWChange} placeholder="170" className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none text-xs font-bold transition-all" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nặng (kg)</label>
                                    <input type="number" name="w" value={hw.w} onChange={handleHWChange} placeholder="65" className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none text-xs font-bold transition-all" />
                                </div>
                                <div className="space-y-1.5">
                                    <Tooltip text="BMI tự động tính">
                                        <label className="text-[10px] font-bold text-slate-900 uppercase tracking-widest cursor-help">BMI</label>
                                    </Tooltip>
                                    <input disabled type="text" value={formData.BMI || "--"} className="w-full p-2.5 bg-slate-900 border border-slate-900 rounded-xl outline-none text-sm font-black text-white text-center" />
                                </div>
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Huyết áp cao</label>
                                <select disabled={readOnly} name="HighBP" value={formData.HighBP} onChange={handleChange} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none text-xs font-bold text-slate-900 transition-all"><option value={0}>Không</option><option value={1}>Có</option></select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cholesterol cao</label>
                                <select disabled={readOnly} name="HighChol" value={formData.HighChol} onChange={handleChange} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none text-xs font-bold text-slate-900 transition-all"><option value={0}>Không</option><option value={1}>Có</option></select>
                            </div>
                        </div>
                        <div className="space-y-1.5 mt-auto pt-4">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Kiểm tra Cholesterol (5 năm)</label>
                            <select disabled={readOnly} name="CholCheck" value={formData.CholCheck} onChange={handleChange} className="w-full p-2.5 bg-slate-100 border border-transparent rounded-xl outline-none text-xs font-black text-slate-900"><option value={1}>Đã kiểm tra</option><option value={0}>Chưa kiểm tra</option></select>
                        </div>
                    </div>
                </div>

                {/* Cột 2: Lối sống */}
                <div className="p-8 flex flex-col hover:bg-slate-50/50 transition-colors">
                    <div className="mb-6 border-l-2 border-slate-900 pl-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">02.</p>
                        <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">Lối sống & Thói quen</h3>
                    </div>
                    <div className="space-y-3 flex-1">
                        {[
                            { name: 'Smoker', label: 'Hút thuốc (>= 100 điếu/đời)' },
                            { name: 'PhysActivity', label: 'Tập thể dục 30 ngày qua' },
                            { name: 'Fruits', label: 'Ăn trái cây 1 lần/ngày' },
                            { name: 'Veggies', label: 'Ăn rau xanh 1 lần/ngày' },
                            { name: 'HvyAlcoholConsump', label: 'Lạm dụng rượu bia' }
                        ].map((item) => (
                            <div key={item.name} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
                                <p className="font-bold text-xs text-slate-700 w-2/3">{item.label}</p>
                                <select disabled={readOnly} name={item.name} value={formData[item.name]} onChange={handleChange} className="text-xs bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 outline-none font-black text-slate-900">
                                    <option value={0}>Không</option><option value={1}>Có</option>
                                </select>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cột 3: Y tế */}
                <div className="p-8 flex flex-col hover:bg-slate-50/50 transition-colors">
                    <div className="mb-6 border-l-2 border-slate-900 pl-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">03.</p>
                        <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">Bệnh sử & Y tế</h3>
                    </div>
                    <div className="space-y-4 flex-1">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-slate-900"></div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Bệnh Tim mạch</label>
                                <select disabled={readOnly} name="HeartDiseaseorAttack" value={formData.HeartDiseaseorAttack} onChange={handleChange} className="w-full bg-transparent outline-none text-xs font-black text-slate-900"><option value={0}>Không</option><option value={1}>Có</option></select>
                            </div>
                            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-slate-900"></div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Tiền sử Đột quỵ</label>
                                <select disabled={readOnly} name="Stroke" value={formData.Stroke} onChange={handleChange} className="w-full bg-transparent outline-none text-xs font-black text-slate-900"><option value={0}>Không</option><option value={1}>Có</option></select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sức khỏe chung</label>
                                <select disabled={readOnly} name="GenHlth" value={formData.GenHlth} onChange={handleChange} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none text-xs font-bold text-slate-900 transition-all">
                                    <option value={1}>1 - Xuất sắc</option>
                                    <option value={2}>2 - Rất tốt</option>
                                    <option value={3}>3 - Tốt</option>
                                    <option value={4}>4 - Bình thường</option>
                                    <option value={5}>5 - Yếu / Kém</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Khó leo thang</label>
                                <select disabled={readOnly} name="DiffWalk" value={formData.DiffWalk} onChange={handleChange} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none text-xs font-bold text-slate-900 transition-all"><option value={0}>Không</option><option value={1}>Có</option></select>
                            </div>
                        </div>
                        
                        <div className="flex gap-4">
                            <div className="flex-1 space-y-1.5">
                                <Tooltip text="Số ngày thấy bất ổn tâm lý trong 30 ngày qua">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest cursor-help border-b border-dashed border-slate-300">Ngày ốm (Tâm lý)</label>
                                </Tooltip>
                                <input disabled={readOnly} type="number" min="0" max="30" name="MentHlth" value={formData.MentHlth === 0 ? "" : formData.MentHlth} onChange={handleChange} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none text-xs font-bold text-center transition-all" />
                            </div>
                            <div className="flex-1 space-y-1.5">
                                <Tooltip text="Số ngày ốm yếu thể chất trong 30 ngày qua">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest cursor-help border-b border-dashed border-slate-300">Ngày ốm (Thể chất)</label>
                                </Tooltip>
                                <input disabled={readOnly} type="number" min="0" max="30" name="PhysHlth" value={formData.PhysHlth === 0 ? "" : formData.PhysHlth} onChange={handleChange} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none text-xs font-bold text-center transition-all" />
                            </div>
                        </div>

                        <div className="bg-slate-900 p-4 rounded-2xl shadow-xl mt-4">
                            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                                <div>
                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Bảo hiểm Y tế</label>
                                    <select disabled={readOnly} name="AnyHealthcare" value={formData.AnyHealthcare} onChange={handleChange} className="w-full bg-slate-800 border-none rounded-lg text-xs font-black text-white p-2 outline-none"><option value={1}>Có BH</option><option value={0}>Không BH</option></select>
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Bỏ khám vì tiền (1 năm)</label>
                                    <select disabled={readOnly} name="NoDocbcCost" value={formData.NoDocbcCost} onChange={handleChange} className="w-full bg-slate-800 border-none rounded-lg text-xs font-black text-white p-2 outline-none"><option value={0}>Không</option><option value={1}>Có</option></select>
                                </div>
                                <div className="col-span-2 grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Học vấn</label>
                                        <select disabled={readOnly} name="Education" value={formData.Education} onChange={handleChange} className="w-full bg-slate-800 border-none rounded-lg text-[10px] font-bold text-white p-2 outline-none">
                                            <option value={1}>Chưa đi học</option>
                                            <option value={2}>Tiểu học</option>
                                            <option value={3}>THCS (Cấp 2)</option>
                                            <option value={4}>THPT (Cấp 3)</option>
                                            <option value={5}>Cao đẳng/Nghề</option>
                                            <option value={6}>Đại học trở lên</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Thu nhập (Tháng)</label>
                                        <select disabled={readOnly} name="Income" value={formData.Income} onChange={handleChange} className="w-full bg-slate-800 border-none rounded-lg text-[10px] font-bold text-white p-2 outline-none">
                                            <option value={1}>Dưới 5tr</option>
                                            <option value={2}>5 - 8tr</option>
                                            <option value={3}>8 - 12tr</option>
                                            <option value={4}>12 - 15tr</option>
                                            <option value={5}>15 - 20tr</option>
                                            <option value={6}>20 - 30tr</option>
                                            <option value={7}>30 - 50tr</option>
                                            <option value={8}>Trên 50tr</option>
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