import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (token) {
                try {
                    const response = await api.get('/users/profile');
                    if (response.data && response.data.data) {
                        setUser(response.data.data);
                    }
                } catch (error) {
                    console.error("Lỗi xác thực Token:", error);
                    localStorage.removeItem('token');
                    sessionStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };

        loadUser();
    }, []);

    const login = async (token, role, rememberMe) => {
        if (rememberMe) {
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
        } else {
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('role', role);
        }

        try {
            const response = await api.get('/users/profile');
            if (response.data && response.data.data) {
                setUser(response.data.data);
            }
        } catch (error) {
            console.error("Lỗi tải Profile sau login:", error);
            setUser({ token, role });
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('role');
        setUser(null);
    };

    const updateUser = (updatedData) => {
        setUser(prev => ({ ...prev, ...updatedData }));
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};