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
        const initAuth = async () => {
            // Check for saved user first
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                try {
                    const parsed = JSON.parse(savedUser);
                    if (parsed && (parsed.role || parsed.type)) {
                        parsed.role = parsed.role || parsed.type;
                        setUser(parsed);
                        setLoading(false);
                        return;
                    }
                } catch (error) {
                    localStorage.removeItem('user');
                }
            }
            
            setLoading(false);
        };
        
        initAuth();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.user) {
                    const userToSave = {
                        ...data.user,
                        role: data.user.type
                    };
                    setUser(userToSave);
                    localStorage.setItem('user', JSON.stringify(userToSave));
                    return { success: true, user: userToSave };
                } else {
                    return { success: false, message: data.message || 'Login failed' };
                }
            } else {
                const errorData = await response.json();
                return { success: false, message: errorData.message || 'Login failed' };
            }
        } catch (error) {
            return { success: false, message: 'Network error. Please try again.' };
        }
    };

    const loginUser = (userData) => {
        const userToSave = {
            ...userData,
            role: userData.role || userData.type
        };
        setUser(userToSave);
        localStorage.setItem('user', JSON.stringify(userToSave));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, loginUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
