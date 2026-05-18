import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { analyzeHealthRisk } from '../../services/aiService';
import { AuthContext } from '../../context/AuthContext';
import AssessmentForm from './AssessmentForm';
import AIResults from './AiResults';

export default function Assessment() {
    const { user } = useContext(AuthContext);
    
    const [formData, setFormData] = useState(() => {
        const savedData = sessionStorage.getItem('assessment_formData');
        return savedData ? JSON.parse(savedData) : {
            height_cm: 170, weight_kg: 65, // Thêm chiều cao, cân nặng mặc định
            HighBP: 1, HighChol: 1, CholCheck: 1, BMI: 22.5, Smoker: 1, Stroke: 0,
            HeartDiseaseorAttack: 0, PhysActivity: 0, Fruits: 0, Veggies: 1,
            HvyAlcoholConsump: 0, AnyHealthcare: 1, NoDocbcCost: 0, GenHlth: 4,
            MentHlth: 15, PhysHlth: 20, DiffWalk: 1, Sex: 1, Age: 9, Education: 4, Income: 5
        };
    });

    // Lấy chiều cao, cân nặng từ hồ sơ khi mới vào trang (nếu là bệnh nhân)
    React.useEffect(() => {
        const fetchProfileData = async () => {
            if (user && user.role === 'PATIENT') {
                try {
                    const res = await api.get('/users/profile');
                    if (res.data && res.data.data && res.data.data.Profile) {
                        const { height_cm, weight_kg } = res.data.data.Profile;
                        if (height_cm && weight_kg) {
                            setFormData(prev => {
                                const newFormData = { ...prev, height_cm, weight_kg };
                                // Tự động tính lại BMI
                                const heightInMeters = height_cm / 100;
                                newFormData.BMI = parseFloat((weight_kg / (heightInMeters * heightInMeters)).toFixed(1));
                                return newFormData;
                            });
                        }
                    }
                } catch (error) {
                    console.error("Lỗi lấy hồ sơ:", error);
                }
            }
        };
        fetchProfileData();
    }, [user]);

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
        const parsedValue = value === "" ? "" : parseFloat(value);
        
        setFormData(prev => {
            const updated = { ...prev, [name]: parsedValue };
            
            // Tự động tính BMI nếu thay đổi chiều cao hoặc cân nặng
            if (name === 'height_cm' || name === 'weight_kg') {
                const height = name === 'height_cm' ? parsedValue : prev.height_cm;
                const weight = name === 'weight_kg' ? parsedValue : prev.weight_kg;
                
                if (height > 0 && weight > 0) {
                    const heightInMeters = height / 100;
                    updated.BMI = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
                }
            }
            return updated;
        });
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        
        const sanitizedData = Object.keys(formData).reduce((acc, key) => {
            acc[key] = formData[key] === "" ? 0 : formData[key];
            return acc;
        }, {});

        setIsLoading(true);
        try {
            // Cập nhật lại chiều cao, cân nặng vào Profile nếu là bệnh nhân
            if (user && user.role === 'PATIENT' && formData.height_cm && formData.weight_kg) {
                await api.put('/users/profile', {
                    height_cm: formData.height_cm,
                    weight_kg: formData.weight_kg
                }).catch(err => console.error("Lỗi đồng bộ hồ sơ:", err));
            }

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
