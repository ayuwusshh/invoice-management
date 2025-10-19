import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Effect to verify token and load user data
    useEffect(() => {
        const verifyToken = async () => {
            // If no token, we are done.
            if (!token) { 
                setUser(null);
                setLoading(false);
                return;
            }

            // Token exists, try to verify it
            try {
                const res = await api.get('/auth/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(res.data);
            } catch (error) {
                // Token expired or invalid - MUST LOGOUT
                console.error('Token verification failed, logging out:', error.response?.data?.message);
                logout();
            }
            setLoading(false);
        };
        verifyToken();
    }, [token]);

    const login = (jwtToken, userData) => {
        localStorage.setItem('token', jwtToken);
        setToken(jwtToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setLoading(false);
    };

    return (
        <AuthContext.Provider value={{ token, user, loading, login, logout, isLoggedIn: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};
