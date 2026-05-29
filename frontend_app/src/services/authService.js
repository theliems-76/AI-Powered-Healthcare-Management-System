import api from './api';

export const loginAPI = async (email, password) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    } catch (error) {
        if (error.response?.data?.requiresVerification) {
            throw error.response.data; // Throw the whole object
        }
        throw error.response?.data?.error || "Lỗi kết nối đến máy chủ!";
    }
};

export const resendVerificationAPI = async (email) => {
    try {
        const response = await api.post('/auth/resend-verification', { email });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || "Lỗi khi gửi lại email xác thực!";
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