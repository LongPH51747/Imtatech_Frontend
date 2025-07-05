import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { apiLogin } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadAuthDataFromStorage = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('userToken');
                const storedUser = await AsyncStorage.getItem('userData');

                if (storedUser && storedToken) {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu xác thực từ Storage:", error);
            } finally {
                setIsLoading(false)
            }
        };
        loadAuthDataFromStorage();
    }, []);

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const response = await apiLogin(email, password);
            const { user: userData, token: userToken } = response.data;
            setUser(userData);
            setToken(userToken);

            await AsyncStorage.setItem('userData', JSON.stringify(userData));
            await AsyncStorage.setItem('userToken', userToken);
        } catch (error) {

            console.error("Lỗi đăng nhập trong AuthContext:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        setUser(null);
        setToken(null);

        await AsyncStorage.removeItem('userData');
        await AsyncStorage.removeItem('userToken');
        setIsLoading(false);
    };

    const value = {
        user,
        token,
        isLoading,
        isAuthenticated: !!token,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>

            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
}