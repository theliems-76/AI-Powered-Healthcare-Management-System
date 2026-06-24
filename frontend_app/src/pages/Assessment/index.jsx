import React, { useState, useContext, Suspense, lazy } from 'react';
import { toast } from 'react-toastify';
import { analyzeHealthRisk } from '../../services/aiService';
import { AuthContext } from '../../context/AuthContext';
import AssessmentForm from './AssessmentForm';
import AIThinkingSteps from './AIThinkingSteps';
import api from '../../services/api';

const AIResults = lazy(() => import('./AIResults'));

export default function Assessment() {
    const { user } = useContext(AuthContext);
    
    const [formData, setFormData] = useState(() => {
        const savedData = sessionStorage.getItem('assessment_formData');
        return savedData ? JSON.parse(savedData) : {
            HighBP: 1, HighChol: 1, CholCheck: 1, BMI: "", Smoker: 1, Stroke: 0,
            HeartDiseaseorAttack: 0, PhysActivity: 0, Fruits: 0, Veggies: 1,
            HvyAlcoholConsump: 0, AnyHealthcare: 1, NoDocbcCost: 0, GenHlth: 4,
            MentHlth: 15, PhysHlth: 20, DiffWalk: 1, Sex: 1, Age: 9, Education: 4, Income: 5
        };
    });

    const [result, setResult] = useState(() => {
        const savedResult = sessionStorage.getItem('assessment_result');
        return savedResult ? JSON.parse(savedResult) : null;
    });

    const [hw, setHw] = useState(() => {
        const savedHw = sessionStorage.getItem('assessment_hw');
        return savedHw ? JSON.parse(savedHw) : { h: '', w: '' };
    });

    const [isLoading, setIsLoading] = useState(false);

    React.useEffect(() => {
        sessionStorage.setItem('assessment_formData', JSON.stringify(formData));
    }, [formData]);

    React.useEffect(() => {
        sessionStorage.setItem('assessment_hw', JSON.stringify(hw));
    }, [hw]);

    React.useEffect(() => {
        if (result) {
            sessionStorage.setItem('assessment_result', JSON.stringify(result));
        }
    }, [result]);

    React.useEffect(() => {
        let interval;
        if (result && result.ai_nutrition_plan === 'PROCESSING') {
            interval = setInterval(async () => {
                try {
                    const response = await api.get(`/records/${result.id}`);
                    if (response.data && response.data.data && response.data.data.ai_nutrition_plan !== 'PROCESSING') {
                        setResult(response.data.data);
                        clearInterval(interval);
                        toast.success("Bác sĩ AI đã thiết kế xong phác đồ Dinh dưỡng & Tập luyện!", { icon: "🩺" });
                    }
                } catch (error) {
                    console.error("Lỗi cập nhật phác đồ:", error);
                }
            }, 3000); // Polling mỗi 3 giây
        }
        return () => clearInterval(interval);
    }, [result]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: value === "" ? "" : parseFloat(value) 
        }));
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        
        if (!formData.BMI) {
            toast.error('Vui lòng nhập đầy đủ Chiều cao và Cân nặng!');
            return;
        }

        const sanitizedData = Object.keys(formData).reduce((acc, key) => {
            acc[key] = formData[key] === "" ? 0 : formData[key];
            return acc;
        }, {});

        const payload = {
            ...sanitizedData,
            weight_kg: hw?.w || null,
            height_cm: hw?.h || null
        };

        setIsLoading(true);
        try {
            const response = await analyzeHealthRisk(payload);
            if (response.status === 'success') {
                setResult(response.data);
                toast.success('Phân tích thành công!');
            } else {
                throw new Error("Dữ liệu trả về không hợp lệ");
            }
        } catch (error) {
            console.error(error);
            toast.error('Hệ thống AI đang bận hoặc quá tải, vui lòng thử lại sau ít phút!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-12 animate-in fade-in duration-500">
            <div className="space-y-2">
                <h1 className="text-3xl font-black text-slate-800">Khám sức khỏe AI</h1>
                <p className="text-slate-500">Nhập các chỉ số dưới đây để nhận đánh giá rủi ro từ chuyên gia AI.</p>
            </div>

            {isLoading ? (
                <AIThinkingSteps />
            ) : (
                <>
                    <AssessmentForm 
                        formData={formData} 
                        handleChange={handleChange} 
                        handleSubmit={handleSubmit} 
                        isLoading={isLoading} 
                        hw={hw}
                        setHw={setHw}
                    />
                    <Suspense fallback={<div className="animate-pulse bg-slate-100 h-64 rounded-3xl w-full"></div>}>
                        {result && <AIResults result={result} userRole={user?.role} />}
                    </Suspense>
                </>
            )}
        </div>
    );
}