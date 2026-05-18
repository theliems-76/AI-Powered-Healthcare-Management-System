import api from './api';

export const analyzeHealthRisk = async (patientData) => {
    try {
        const response = await api.post('/records/analyze', patientData);
        return response.data;
    } catch (error) {
        console.error("Lỗi gọi AI Service:", error);
        throw error;
    }
};