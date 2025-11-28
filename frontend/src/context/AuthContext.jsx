import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('AuthProvider: Checking localStorage for user');
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                const parsed = JSON.parse(savedUser);
                console.log('AuthProvider: Found saved user:', parsed);
                // Validate user object has required fields
                if (parsed && parsed.type && (parsed.id || parsed.username)) {
                    setUser(parsed);
                } else {
                    console.log('AuthProvider: Invalid user data, clearing');
                    localStorage.removeItem('user');
                }
            } catch (error) {
                console.error('AuthProvider: Error parsing user data', error);
                localStorage.removeItem('user');
            }
        } else {
            console.log('AuthProvider: No saved user found');
        }
        setLoading(false);
    }, []);

    const loginUser = (userData) => {
        console.log('AuthProvider: Logging in user:', userData);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        console.log('AuthProvider: Logging out');
        setUser(null);
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
