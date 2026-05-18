import api from './api';

export const loginAPI = async (email, password) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || "Lỗi kết nối đến máy chủ!";
    }
};
export const registerAPI = async (email, password, full_name, phone) => {
    try {
        const response = await api.post('/auth/register', { 
            email, 
            password, 
            full_name, 
            phone,
            role: 'PATIENT' 
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || "Lỗi kết nối đến máy chủ!";
    }
};