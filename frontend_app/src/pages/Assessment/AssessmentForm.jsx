import React, { useState } from 'react';
import { Activity, HeartPulse, History, Loader2 } from 'lucide-react';
import Tooltip from '../../components/ui/Tooltip'; 
import Button from '../../components/ui/Button';

export default function AssessmentForm({ formData, handleChange, handleSubmit, isLoading, hw, setHw, readOnly = false }) {

    const handleHWChange = (e) => {
        const { name, value } = e.target;
        const next = { ...hw, [name]: value };
        setHw(next);
        
        if (next.h && next.w) {
            const heightM = parseFloat(next.h) / 100;
            const weightKg = parseFloat(next.w);
            if (heightM > 0) {
                const bmi = (weightKg / (heightM * heightM)).toFixed(1);
                handleChange({ target: { name: 'BMI', value: parseFloat(bmi) } });
            }
        } else {
            handleChange({ target: { name: 'BMI', value: "" } });
        }
    };

    return (
        <section>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-outline-variant pb-4">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-on-surface mb-1">
                        {readOnly ? "Hồ sơ khám bệnh chi tiết" : "Khảo Sát Lâm Sàng (Type 2 Diabetes)"}
                    </h2>
                    <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">
                        {readOnly ? "Ghi nhận từ phiên khám trước. Không thể chỉnh sửa." : "Trích xuất 21 đặc trưng cốt lõi (Chi-Square)"}
                    </p>
                </div>
                {!readOnly && (
                    <Button onClick={handleSubmit} isLoading={isLoading}>
                        {isLoading ? 'Đang phân tích...' : 'Phân Tích AI'}
                    </Button>
                )}
            </div>

            <div className={`bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm overflow-hidden ${readOnly ? 'opacity-80 pointer-events-none' : ''}`}>
                <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-outline-variant">
                
                {/* Cột 1: Sinh trắc học */}
                <div className="p-6 md:p-8 flex flex-col bg-surface-container-lowest transition-colors">
                    <div className="mb-6 border-l-2 border-primary pl-3">
                        <p className="text-xs font-semibold text-outline uppercase tracking-wider mb-0.5">01.</p>
                        <h3 className="font-bold text-sm text-on-surface uppercase tracking-wide">Sinh trắc học</h3>
                    </div>
                    <div className="space-y-5 flex-1">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Độ tuổi</label>
                                <select disabled={readOnly} name="Age" value={formData.Age} onChange={handleChange} className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm font-medium text-on-surface transition-colors">
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
                                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Giới tính</label>
                                <select disabled={readOnly} name="Sex" value={formData.Sex} onChange={handleChange} className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm font-medium text-on-surface transition-colors">
                                    <option value={1}>Nam</option><option value={0}>Nữ</option>
                                </select>
                            </div>
                        </div>
                        {readOnly ? (
                            <div className="space-y-1.5">
                                <Tooltip text="Dưới 18.5: Gầy | 18.5-24.9: Bình thường | >= 25: Béo phì">
                                    <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider cursor-help border-b border-dashed border-outline">Chỉ số BMI (kg/m²)</label>
                                </Tooltip>
                                <input disabled type="number" value={formData.BMI} className="w-full p-2.5 bg-surface-container border border-transparent rounded outline-none text-base font-bold text-on-surface" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Cao (cm)</label>
                                    <input type="number" min="50" max="250" name="h" value={hw.h} onChange={handleHWChange} placeholder="170" className="w-full p-2.5 bg-surface-container-lowest border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm font-medium transition-colors" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Nặng (kg)</label>
                                    <input type="number" min="10" max="300" name="w" value={hw.w} onChange={handleHWChange} placeholder="65" className="w-full p-2.5 bg-surface-container-lowest border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm font-medium transition-colors" />
                                </div>
                                <div className="space-y-1.5">
                                    <Tooltip text="BMI tự động tính = Cân nặng / (Chiều cao)²">
                                        <label className="text-xs font-semibold text-on-surface uppercase tracking-wider cursor-help">BMI (kg/m²)</label>
                                    </Tooltip>
                                    <input disabled type="text" value={formData.BMI || "--"} className="w-full p-2.5 bg-surface-container border border-outline-variant rounded outline-none text-sm font-bold text-on-surface text-center" />
                                </div>
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Huyết áp cao</label>
                                <select disabled={readOnly} name="HighBP" value={formData.HighBP} onChange={handleChange} className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm font-medium text-on-surface transition-colors"><option value={0}>Không</option><option value={1}>Có</option></select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Cholesterol cao</label>
                                <select disabled={readOnly} name="HighChol" value={formData.HighChol} onChange={handleChange} className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm font-medium text-on-surface transition-colors"><option value={0}>Không</option><option value={1}>Có</option></select>
                            </div>
                        </div>
                        <div className="space-y-1.5 mt-auto pt-4 border-t border-outline-variant">
                            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Kiểm tra Cholesterol (5 năm)</label>
                            <select disabled={readOnly} name="CholCheck" value={formData.CholCheck} onChange={handleChange} className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm font-medium text-on-surface transition-colors"><option value={1}>Đã kiểm tra</option><option value={0}>Chưa kiểm tra</option></select>
                        </div>
                    </div>
                </div>

                {/* Cột 2: Lối sống */}
                <div className="p-6 md:p-8 flex flex-col bg-surface-container-lowest transition-colors">
                    <div className="mb-6 border-l-2 border-primary pl-3">
                        <p className="text-xs font-semibold text-outline uppercase tracking-wider mb-0.5">02.</p>
                        <h3 className="font-bold text-sm text-on-surface uppercase tracking-wide">Lối sống & Thói quen</h3>
                    </div>
                    <div className="space-y-4 flex-1">
                        {[
                            { name: 'Smoker', label: 'Hút thuốc (>= 100 điếu/đời)', tooltip: 'Tiêu chuẩn CDC: Tiêu thụ >= 100 điếu thuốc trong suốt cuộc đời là ngưỡng để xác định tiền sử hút thuốc mang rủi ro y tế.' },
                            { name: 'PhysActivity', label: 'Tập thể dục 30 ngày qua', tooltip: null },
                            { name: 'Fruits', label: 'Ăn trái cây (>= 1 lần/ngày)', tooltip: null },
                            { name: 'Veggies', label: 'Ăn rau xanh (>= 1 lần/ngày)', tooltip: null },
                            { name: 'HvyAlcoholConsump', label: 'Lạm dụng rượu bia', tooltip: 'Tiêu thụ > 14 ly/tuần đối với nam, hoặc > 7 ly/tuần đối với nữ.' }
                        ].map((item) => (
                            <div key={item.name} className="flex justify-between items-center bg-surface-container-low p-3 rounded border border-outline-variant hover:border-outline transition-colors">
                                {item.tooltip ? (
                                    <Tooltip text={item.tooltip}>
                                        <p className="font-medium text-sm text-on-surface w-2/3 cursor-help border-b border-dashed border-outline inline-block">{item.label}</p>
                                    </Tooltip>
                                ) : (
                                    <p className="font-medium text-sm text-on-surface w-2/3">{item.label}</p>
                                )}
                                <select disabled={readOnly} name={item.name} value={formData[item.name]} onChange={handleChange} className="text-sm bg-surface-container-lowest border border-outline-variant rounded py-1.5 px-3 outline-none font-semibold text-on-surface focus:border-primary">
                                    <option value={0}>Không</option><option value={1}>Có</option>
                                </select>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cột 3: Y tế */}
                <div className="p-6 md:p-8 flex flex-col bg-surface-container-lowest transition-colors">
                    <div className="mb-6 border-l-2 border-primary pl-3">
                        <p className="text-xs font-semibold text-outline uppercase tracking-wider mb-0.5">03.</p>
                        <h3 className="font-bold text-sm text-on-surface uppercase tracking-wide">Bệnh sử & Y tế</h3>
                    </div>
                    <div className="space-y-5 flex-1">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-surface-container-low p-3 rounded border border-outline-variant relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-1">Bệnh Tim mạch</label>
                                <select disabled={readOnly} name="HeartDiseaseorAttack" value={formData.HeartDiseaseorAttack} onChange={handleChange} className="w-full bg-transparent outline-none text-sm font-semibold text-on-surface"><option value={0}>Không</option><option value={1}>Có</option></select>
                            </div>
                            <div className="bg-surface-container-low p-3 rounded border border-outline-variant relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-1">Tiền sử Đột quỵ</label>
                                <select disabled={readOnly} name="Stroke" value={formData.Stroke} onChange={handleChange} className="w-full bg-transparent outline-none text-sm font-semibold text-on-surface"><option value={0}>Không</option><option value={1}>Có</option></select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Sức khỏe chung</label>
                                <select disabled={readOnly} name="GenHlth" value={formData.GenHlth} onChange={handleChange} className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm font-medium text-on-surface transition-colors">
                                    <option value={1}>1 - Xuất sắc</option>
                                    <option value={2}>2 - Rất tốt</option>
                                    <option value={3}>3 - Tốt</option>
                                    <option value={4}>4 - Bình thường</option>
                                    <option value={5}>5 - Yếu / Kém</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <Tooltip text="Khó khăn nghiêm trọng khi đi bộ do sức khỏe dai dẳng. KHÔNG tính chấn thương cấp tính như gãy chân.">
                                    <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider cursor-help border-b border-dashed border-outline">Khó leo thang</label>
                                </Tooltip>
                                <select disabled={readOnly} name="DiffWalk" value={formData.DiffWalk} onChange={handleChange} className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm font-medium text-on-surface transition-colors"><option value={0}>Không</option><option value={1}>Có</option></select>
                            </div>
                        </div>
                        
                        <div className="flex gap-4">
                            <div className="flex-1 space-y-1.5">
                                <Tooltip text="Số ngày tự cảm thấy tâm lý bất ổn trong 30 ngày qua">
                                    <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider cursor-help border-b border-dashed border-outline">Ốm Tâm lý (ngày)</label>
                                </Tooltip>
                                <input disabled={readOnly} type="number" min="0" max="30" name="MentHlth" value={formData.MentHlth} onChange={handleChange} className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm font-medium text-center transition-colors" />
                            </div>
                            <div className="flex-1 space-y-1.5">
                                <Tooltip text="Số ngày tự cảm thấy thể chất ốm yếu trong 30 ngày qua">
                                    <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider cursor-help border-b border-dashed border-outline">Ốm Thể chất (ngày)</label>
                                </Tooltip>
                                <input disabled={readOnly} type="number" min="0" max="30" name="PhysHlth" value={formData.PhysHlth} onChange={handleChange} className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm font-medium text-center transition-colors" />
                            </div>
                        </div>

                        <div className="bg-surface-container p-5 rounded border border-outline-variant mt-4">
                            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-1">Bảo hiểm Y tế</label>
                                    <select disabled={readOnly} name="AnyHealthcare" value={formData.AnyHealthcare} onChange={handleChange} className="w-full bg-surface-container-lowest border border-outline-variant rounded text-sm font-semibold text-on-surface p-2 outline-none"><option value={1}>Có BH</option><option value={0}>Không BH</option></select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider block mb-1">Bỏ khám vì tiền (1 năm)</label>
                                    <select disabled={readOnly} name="NoDocbcCost" value={formData.NoDocbcCost} onChange={handleChange} className="w-full bg-surface-container-lowest border border-outline-variant rounded text-sm font-semibold text-on-surface p-2 outline-none"><option value={0}>Không</option><option value={1}>Có</option></select>
                                </div>
                                <div className="col-span-2 grid grid-cols-2 gap-4">
                                    <div>
                                        <Tooltip text="Chuẩn BRFSS của CDC: Liên quan mật thiết đến nhận thức sức khỏe và nguy cơ tiểu đường.">
                                            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-1 cursor-help border-b border-dashed border-outline inline-block">Học vấn</label>
                                        </Tooltip>
                                        <select disabled={readOnly} name="Education" value={formData.Education} onChange={handleChange} className="w-full bg-surface-container-lowest border border-outline-variant rounded text-xs font-medium text-on-surface p-2 outline-none">
                                            <option value={1}>Chưa đi học</option>
                                            <option value={2}>Tiểu học</option>
                                            <option value={3}>THCS (Cấp 2)</option>
                                            <option value={4}>THPT (Cấp 3)</option>
                                            <option value={5}>Cao đẳng/Nghề</option>
                                            <option value={6}>Đại học trở lên</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-1">Thu nhập / Tháng</label>
                                        <select disabled={readOnly} name="Income" value={formData.Income} onChange={handleChange} className="w-full bg-surface-container-lowest border border-outline-variant rounded text-xs font-medium text-on-surface p-2 outline-none">
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