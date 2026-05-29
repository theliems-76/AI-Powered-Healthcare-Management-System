import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { analyzeHealthRisk } from '../../services/aiService';
import { AuthContext } from '../../context/AuthContext';
import AssessmentForm from './AssessmentForm';
import AIResults from './AIResults';

export default function Assessment() {
    const { user } = useContext(AuthContext);
    
    const [formData, setFormData] = useState(() => {
        const savedData = sessionStorage.getItem('assessment_formData');
        return savedData ? JSON.parse(savedData) : {
            HighBP: 1, HighChol: 1, CholCheck: 1, BMI: 32.5, Smoker: 1, Stroke: 0,
            HeartDiseaseorAttack: 0, PhysActivity: 0, Fruits: 0, Veggies: 1,
            HvyAlcoholConsump: 0, AnyHealthcare: 1, NoDocbcCost: 0, GenHlth: 4,
            MentHlth: 15, PhysHlth: 20, DiffWalk: 1, Sex: 1, Age: 9, Education: 4, Income: 5
        };
    });

    const [result, setResult] = useState(() => {
        const savedResult = sessionStorage.getItem('assessment_result');
        return savedResult ? JSON.parse(savedResult) : null;
    });

    const [isLoading, setIsLoading] = useState(false);

    React.useEffect(() => {
        sessionStorage.setItem('assessment_formData', JSON.stringify(formData));
    }, [formData]);

    React.useEffect(() => {
        if (result) {
            sessionStorage.setItem('assessment_result', JSON.stringify(result));
        }
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
        
        const sanitizedData = Object.keys(formData).reduce((acc, key) => {
            acc[key] = formData[key] === "" ? 0 : formData[key];
            return acc;
        }, {});

        setIsLoading(true);
        try {
            const response = await analyzeHealthRisk(sanitizedData);
            if (response.status === 'success') {
                setResult(response.data);
                toast.success('Phân tích thành công!');
            } else {
                throw new Error("Dữ liệu trả về không hợp lệ");
            }
        } catch (error) {
            console.error(error);
            toast.error('Lỗi kết nối AI hoặc Node.js!');
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

            <AssessmentForm 
                formData={formData} 
                handleChange={handleChange} 
                handleSubmit={handleSubmit} 
                isLoading={isLoading} 
            />
            
            <AIResults result={result} userRole={user?.role} />
        </div>
    );
}