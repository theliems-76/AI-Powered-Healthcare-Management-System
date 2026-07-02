import React, { useState } from 'react';
import { Activity, HeartPulse, History, Loader2, CheckCircle2, ChevronRight, ChevronLeft, Send } from 'lucide-react';
import Tooltip from '../../components/ui/Tooltip'; 
import Button from '../../components/ui/Button';

export default function AssessmentForm({ formData, handleChange, handleSubmit, isLoading, hw, setHw, readOnly = false }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [isButtonLocked, setIsButtonLocked] = useState(false);
    const totalSteps = 4;
    const stepLabels = [
        "Sinh trắc học",
        "Sinh hiệu & Bệnh sử",
        "Lối sống & Sức khỏe",
        "Kinh tế & Xã hội"
    ];

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

    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
            if (currentStep + 1 === totalSteps) {
                // Lock the submit button for 500ms to prevent accidental double-clicks
                setIsButtonLocked(true);
                setTimeout(() => setIsButtonLocked(false), 500);
            }
        }
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const renderReadOnlyView = () => {
        // ... I will implement the read-only linear view below
    };

    if (readOnly) {
        const ageMap = {
            1: '18 - 24 tuổi', 2: '25 - 29 tuổi', 3: '30 - 34 tuổi', 4: '35 - 39 tuổi',
            5: '40 - 44 tuổi', 6: '45 - 49 tuổi', 7: '50 - 54 tuổi', 8: '55 - 59 tuổi',
            9: '60 - 64 tuổi', 10: '65 - 69 tuổi', 11: '70 - 74 tuổi', 12: '75 - 79 tuổi', 13: 'Trên 80 tuổi'
        };
        const eduMap = {
            1: 'Chưa đi học', 2: 'Tiểu học', 3: 'THCS (Cấp 2)',
            4: 'THPT (Cấp 3)', 5: 'Cao đẳng / Trung cấp', 6: 'Đại học trở lên'
        };
        const incMap = {
            1: 'Dưới 5tr', 2: '5 - 8tr', 3: '8 - 12tr', 4: '12 - 15tr',
            5: '15 - 20tr', 6: '20 - 30tr', 7: '30 - 50tr', 8: 'Trên 50tr'
        };
        const genHlthMap = {
            1: 'Xuất sắc', 2: 'Rất tốt', 3: 'Tốt', 4: 'Bình thường', 5: 'Yếu / Kém'
        };

        return (
            <section className="bg-surface border border-outline-variant rounded-xl overflow-hidden p-6 opacity-90 pointer-events-none">
                <div className="mb-6 border-b border-outline-variant pb-4">
                    <h2 className="text-2xl font-semibold tracking-tight text-on-surface mb-1">
                        Hồ sơ khám bệnh chi tiết
                    </h2>
                    <p className="text-xs text-secondary font-medium uppercase tracking-wider">
                        Ghi nhận từ phiên khám trước. Không thể chỉnh sửa.
                    </p>
                </div>
                {/* Simplified layout for readOnly to avoid wizard buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                     <div className="space-y-4">
                        <h3 className="font-bold text-sm text-on-surface uppercase tracking-wide border-b border-outline-variant pb-2">Sinh trắc học</h3>
                        <div className="space-y-2">
                            <div><span className="text-xs text-secondary uppercase">Độ tuổi:</span> <span className="font-bold text-sm text-on-surface ml-1">{ageMap[formData.Age] || formData.Age}</span></div>
                            <div><span className="text-xs text-secondary uppercase">Giới tính:</span> <span className="font-bold text-sm text-on-surface ml-1">{formData.Sex === 1 ? 'Nam' : 'Nữ'}</span></div>
                            <div><span className="text-xs text-secondary uppercase">BMI:</span> <span className="font-bold text-sm text-on-surface ml-1">{formData.BMI}</span></div>
                        </div>
                     </div>
                     <div className="space-y-4">
                        <h3 className="font-bold text-sm text-on-surface uppercase tracking-wide border-b border-outline-variant pb-2">Bệnh sử</h3>
                        <div className="space-y-2">
                            <div><span className="text-xs text-secondary uppercase">Huyết áp cao:</span> <span className="font-bold text-sm text-on-surface ml-1">{formData.HighBP ? 'Có' : 'Không'}</span></div>
                            <div><span className="text-xs text-secondary uppercase">Cholesterol cao:</span> <span className="font-bold text-sm text-on-surface ml-1">{formData.HighChol ? 'Có' : 'Không'}</span></div>
                            <div><span className="text-xs text-secondary uppercase">Tim mạch:</span> <span className="font-bold text-sm text-on-surface ml-1">{formData.HeartDiseaseorAttack ? 'Có' : 'Không'}</span></div>
                            <div><span className="text-xs text-secondary uppercase">Đột quỵ:</span> <span className="font-bold text-sm text-on-surface ml-1">{formData.Stroke ? 'Có' : 'Không'}</span></div>
                        </div>
                     </div>
                     <div className="space-y-4">
                        <h3 className="font-bold text-sm text-on-surface uppercase tracking-wide border-b border-outline-variant pb-2">Lối sống</h3>
                        <div className="space-y-2">
                            <div><span className="text-xs text-secondary uppercase">Hút thuốc:</span> <span className="font-bold text-sm text-on-surface ml-1">{formData.Smoker ? 'Có' : 'Không'}</span></div>
                            <div><span className="text-xs text-secondary uppercase">Thể dục:</span> <span className="font-bold text-sm text-on-surface ml-1">{formData.PhysActivity ? 'Có' : 'Không'}</span></div>
                            <div><span className="text-xs text-secondary uppercase">Rượu bia:</span> <span className="font-bold text-sm text-on-surface ml-1">{formData.HvyAlcoholConsump ? 'Có' : 'Không'}</span></div>
                            <div><span className="text-xs text-secondary uppercase">Sức khỏe chung:</span> <span className="font-bold text-sm text-on-surface ml-1">{genHlthMap[formData.GenHlth] || formData.GenHlth}</span></div>
                        </div>
                     </div>
                     <div className="space-y-4">
                        <h3 className="font-bold text-sm text-on-surface uppercase tracking-wide border-b border-outline-variant pb-2">Kinh tế XH</h3>
                        <div className="space-y-2">
                            <div><span className="text-xs text-secondary uppercase">Học vấn:</span> <span className="font-bold text-sm text-on-surface ml-1">{eduMap[formData.Education] || formData.Education}</span></div>
                            <div><span className="text-xs text-secondary uppercase">Thu nhập:</span> <span className="font-bold text-sm text-on-surface ml-1">{incMap[formData.Income] || formData.Income}</span></div>
                            <div><span className="text-xs text-secondary uppercase">Bảo hiểm Y tế:</span> <span className="font-bold text-sm text-on-surface ml-1">{formData.AnyHealthcare ? 'Có' : 'Không'}</span></div>
                        </div>
                     </div>
                </div>
            </section>
        );
    }

    const percentComplete = ((currentStep) / totalSteps) * 100;

    return (
        <section className="w-full max-w-3xl mx-auto flex flex-col items-center">
            {/* Header */}
            <div className="w-full mb-6">
                <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">Khảo Sát Lâm Sàng</h1>
                <p className="font-body-md text-secondary">Hệ thống Trích xuất 21 đặc trưng cốt lõi để Phân tích Nguy cơ Đái tháo đường Type 2.</p>
            </div>

            {/* Progress Tracker */}
            <div className="w-full bg-surface border border-outline-variant rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="font-label-bold text-primary uppercase">Bước {currentStep} / {totalSteps}: {stepLabels[currentStep - 1]}</span>
                    <span className="font-mono-data text-secondary">{Math.round(percentComplete)}% Hoàn thành</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full transition-all duration-500 ease-in-out" style={{ width: `${percentComplete}%` }}></div>
                </div>
            </div>

            {/* Form Container */}
            <form onSubmit={(e) => {
                e.preventDefault();
                if (currentStep < totalSteps) {
                    nextStep();
                } else {
                    handleSubmit(e);
                }
            }} className="w-full bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                
                <div className="p-8 space-y-6 min-h-[400px]">
                    {/* Step 1: Sinh trắc học */}
                    {currentStep === 1 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
                            <h3 className="font-headline-md text-headline-md text-on-surface border-b border-outline-variant pb-2">Sinh trắc học cơ bản</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="font-label-bold text-on-surface uppercase">Độ tuổi *</label>
                                    <select name="Age" value={formData.Age} onChange={handleChange} className="w-full border border-outline-variant bg-surface-container-low rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors">
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
                                <div className="flex flex-col gap-2">
                                    <label className="font-label-bold text-on-surface uppercase">Giới tính *</label>
                                    <select name="Sex" value={formData.Sex} onChange={handleChange} className="w-full border border-outline-variant bg-surface-container-low rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors">
                                        <option value={1}>Nam</option>
                                        <option value={0}>Nữ</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-label-bold text-on-surface uppercase">Chiều cao (cm) *</label>
                                    <input type="number" min="50" max="250" name="h" value={hw.h} onChange={handleHWChange} placeholder="170" className="w-full border border-outline-variant bg-surface-container-low rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors" required />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-label-bold text-on-surface uppercase">Cân nặng (kg) *</label>
                                    <input type="number" min="10" max="300" name="w" value={hw.w} onChange={handleHWChange} placeholder="65" className="w-full border border-outline-variant bg-surface-container-low rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors" required />
                                </div>
                                <div className="flex flex-col gap-2 md:col-span-2">
                                    <Tooltip text="BMI tự động tính = Cân nặng / (Chiều cao)²">
                                        <label className="font-label-bold text-on-surface uppercase cursor-help border-b border-dashed border-outline inline-block w-max">Chỉ số BMI tự động</label>
                                    </Tooltip>
                                    <input disabled type="text" value={formData.BMI || "--"} className="w-full border border-outline-variant bg-surface-variant rounded-lg p-3 font-bold text-center outline-none" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Sinh hiệu & Bệnh sử */}
                    {currentStep === 2 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
                            <h3 className="font-headline-md text-headline-md text-on-surface border-b border-outline-variant pb-2">Sinh hiệu & Bệnh sử</h3>
                            
                            <div className="bg-surface-container-low p-4 rounded-lg border-l-4 border-error mb-4">
                                <p className="text-body-sm text-on-surface-variant italic">Lưu ý: Khai báo trung thực các chỉ số sinh lý đóng vai trò quyết định trong việc dự báo nguy cơ tim mạch và tiểu đường.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="font-label-bold text-on-surface uppercase">Huyết áp cao *</label>
                                    <select name="HighBP" value={formData.HighBP} onChange={handleChange} className="w-full border border-outline-variant bg-surface-container-lowest rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none">
                                        <option value={0}>Không</option><option value={1}>Có</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-label-bold text-on-surface uppercase">Cholesterol cao *</label>
                                    <select name="HighChol" value={formData.HighChol} onChange={handleChange} className="w-full border border-outline-variant bg-surface-container-lowest rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none">
                                        <option value={0}>Không</option><option value={1}>Có</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-label-bold text-on-surface uppercase">Đã kiểm tra Cholesterol (5 năm) *</label>
                                    <select name="CholCheck" value={formData.CholCheck} onChange={handleChange} className="w-full border border-outline-variant bg-surface-container-lowest rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none">
                                        <option value={1}>Đã kiểm tra</option><option value={0}>Chưa kiểm tra</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-label-bold text-on-surface uppercase">Bệnh Tim mạch / Mạch vành *</label>
                                    <select name="HeartDiseaseorAttack" value={formData.HeartDiseaseorAttack} onChange={handleChange} className="w-full border border-outline-variant bg-surface-container-lowest rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none">
                                        <option value={0}>Không</option><option value={1}>Có</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2 md:col-span-2">
                                    <label className="font-label-bold text-on-surface uppercase">Tiền sử Đột quỵ *</label>
                                    <select name="Stroke" value={formData.Stroke} onChange={handleChange} className="w-full border border-outline-variant bg-surface-container-lowest rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none">
                                        <option value={0}>Không</option><option value={1}>Có</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Lối sống & Sức khỏe */}
                    {currentStep === 3 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
                            <h3 className="font-headline-md text-headline-md text-on-surface border-b border-outline-variant pb-2">Lối sống & Sức khỏe Chủ quan</h3>
                            
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-2 bg-surface-container-low p-4 border border-outline-variant rounded-lg">
                                        <Tooltip text="Tiêu thụ >= 100 điếu thuốc trong suốt cuộc đời">
                                            <label className="font-label-bold text-on-surface uppercase cursor-help border-b border-dashed border-outline w-max">Hút thuốc lá *</label>
                                        </Tooltip>
                                        <select name="Smoker" value={formData.Smoker} onChange={handleChange} className="w-full border border-outline-variant rounded p-2 outline-none"><option value={0}>Không</option><option value={1}>Có</option></select>
                                    </div>
                                    <div className="flex flex-col gap-2 bg-surface-container-low p-4 border border-outline-variant rounded-lg">
                                        <Tooltip text="Tiêu thụ > 14 ly/tuần đối với nam, hoặc > 7 ly/tuần đối với nữ">
                                            <label className="font-label-bold text-on-surface uppercase cursor-help border-b border-dashed border-outline w-max">Lạm dụng Rượu bia *</label>
                                        </Tooltip>
                                        <select name="HvyAlcoholConsump" value={formData.HvyAlcoholConsump} onChange={handleChange} className="w-full border border-outline-variant rounded p-2 outline-none"><option value={0}>Không</option><option value={1}>Có</option></select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="font-label-bold text-on-surface uppercase">Tập thể dục (30 ngày qua) *</label>
                                        <select name="PhysActivity" value={formData.PhysActivity} onChange={handleChange} className="w-full border border-outline-variant bg-surface-container-lowest rounded-lg p-3 outline-none"><option value={0}>Không</option><option value={1}>Có</option></select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="font-label-bold text-on-surface uppercase">Khó khăn khi leo cầu thang *</label>
                                        <select name="DiffWalk" value={formData.DiffWalk} onChange={handleChange} className="w-full border border-outline-variant bg-surface-container-lowest rounded-lg p-3 outline-none"><option value={0}>Không</option><option value={1}>Có</option></select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-outline-variant pt-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="font-label-bold text-on-surface uppercase text-[10px]">Sức khỏe chung</label>
                                        <select name="GenHlth" value={formData.GenHlth} onChange={handleChange} className="w-full border border-outline-variant bg-surface-container-lowest rounded p-2 outline-none text-sm">
                                            <option value={1}>1 - Xuất sắc</option><option value={2}>2 - Rất tốt</option>
                                            <option value={3}>3 - Tốt</option><option value={4}>4 - Bình thường</option>
                                            <option value={5}>5 - Yếu / Kém</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="font-label-bold text-on-surface uppercase text-[10px]">Ốm Thể chất (ngày)</label>
                                        <input type="number" min="0" max="30" name="PhysHlth" value={formData.PhysHlth} onChange={handleChange} className="w-full border border-outline-variant bg-surface-container-lowest rounded p-2 outline-none text-sm" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="font-label-bold text-on-surface uppercase text-[10px]">Ốm Tâm lý (ngày)</label>
                                        <input type="number" min="0" max="30" name="MentHlth" value={formData.MentHlth} onChange={handleChange} className="w-full border border-outline-variant bg-surface-container-lowest rounded p-2 outline-none text-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Kinh tế & Xã hội */}
                    {currentStep === 4 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
                            <h3 className="font-headline-md text-headline-md text-on-surface border-b border-outline-variant pb-2">Kinh tế & Y tế Xã hội</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="font-label-bold text-on-surface uppercase">Bảo hiểm Y tế *</label>
                                    <select name="AnyHealthcare" value={formData.AnyHealthcare} onChange={handleChange} className="w-full border border-outline-variant bg-surface-container-lowest rounded-lg p-3 outline-none">
                                        <option value={1}>Có BH</option><option value={0}>Không BH</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-label-bold text-on-surface uppercase">Bỏ khám vì chi phí (12 tháng) *</label>
                                    <select name="NoDocbcCost" value={formData.NoDocbcCost} onChange={handleChange} className="w-full border border-outline-variant bg-surface-container-lowest rounded-lg p-3 outline-none">
                                        <option value={0}>Không</option><option value={1}>Có</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2 md:col-span-2">
                                    <label className="font-label-bold text-on-surface uppercase">Trình độ Học vấn *</label>
                                    <select name="Education" value={formData.Education} onChange={handleChange} className="w-full border border-outline-variant bg-surface-container-lowest rounded-lg p-3 outline-none">
                                        <option value={1}>Chưa đi học</option>
                                        <option value={2}>Tiểu học</option>
                                        <option value={3}>THCS (Cấp 2)</option>
                                        <option value={4}>THPT (Cấp 3)</option>
                                        <option value={5}>Cao đẳng / Trung cấp</option>
                                        <option value={6}>Đại học trở lên</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2 md:col-span-2">
                                    <label className="font-label-bold text-on-surface uppercase">Mức thu nhập hàng tháng *</label>
                                    <select name="Income" value={formData.Income} onChange={handleChange} className="w-full border border-outline-variant bg-surface-container-lowest rounded-lg p-3 outline-none">
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
                    )}
                </div>

                {/* Footer Controls */}
                <div className="bg-surface-container-lowest border-t border-outline-variant p-4 md:p-6 flex justify-between items-center">
                    <button 
                        type="button" 
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-label-bold transition-all ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'border border-outline-variant text-on-surface hover:bg-surface-container-high'}`}
                    >
                        <ChevronLeft className="w-4 h-4" /> Quay lại
                    </button>
                    
                    {currentStep < totalSteps ? (
                        <button 
                            type="button"
                            onClick={nextStep}
                            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg font-label-bold hover:opacity-90 transition-all shadow-sm"
                        >
                            Tiếp tục <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button 
                            type="submit"
                            disabled={isLoading || isButtonLocked}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-label-bold transition-all shadow-sm ${isLoading || isButtonLocked ? 'bg-outline-variant text-on-surface-variant cursor-not-allowed' : 'bg-primary-container text-on-primary-container hover:opacity-90'}`}
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            Gửi Phân Tích Y Khoa
                        </button>
                    )}
                </div>
            </form>
            
            {/* Supp. info */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="p-4 bg-surface border border-outline-variant rounded-xl flex items-start gap-4">
                    <div className="p-2 bg-surface-container-low rounded-lg text-primary"><CheckCircle2 className="w-5 h-5" /></div>
                    <div>
                        <h4 className="font-label-bold text-on-surface">HIPAA COMPLIANT</h4>
                        <p className="text-[11px] text-secondary mt-1">Dữ liệu được mã hóa đầu cuối và tuân thủ chuẩn y tế.</p>
                    </div>
                </div>
                <div className="p-4 bg-surface border border-outline-variant rounded-xl flex items-start gap-4">
                    <div className="p-2 bg-surface-container-low rounded-lg text-primary"><Activity className="w-5 h-5" /></div>
                    <div>
                        <h4 className="font-label-bold text-on-surface">AI REAL-TIME ANALYSIS</h4>
                        <p className="text-[11px] text-secondary mt-1">Phân tích XGBoost 21 đặc trưng y khoa tự động.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}