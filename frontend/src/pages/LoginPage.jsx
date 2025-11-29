import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/api';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('student');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { loginUser } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Backend now expects 'username' for both admin and student
            const response = await login({
                username,
                password,
                userType
            });
            if (response.data.success) {
                loginUser(response.data.user);
                navigate(response.data.user.type === 'admin' ? '/admin' : '/student');
            } else {
                setError(response.data.message || 'Login failed');
            }
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAutoFill = (type) => {
        if (type === 'admin') {
            setUserType('admin');
            setUsername('admin');
            setPassword('admin123');
        } else {
            setUserType('student');
            setUsername('student');
            setPassword('student123');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0F0F0F] px-4">
            <div className="max-w-md w-full bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded-xl p-8 shadow-sm">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                        Hostel<span className="text-accent">OS</span>
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Sign in to your account</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* User Type Toggle */}
                    <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg mb-6">
                        <button
                            type="button"
                            onClick={() => setUserType('student')}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${userType === 'student'
                                ? 'bg-white dark:bg-[#0F0F0F] text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                }`}
                        >
                            Student
                        </button>
                        <button
                            type="button"
                            onClick={() => setUserType('admin')}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${userType === 'admin'
                                ? 'bg-white dark:bg-[#0F0F0F] text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                }`}
                        >
                            Admin
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2.5 bg-accent hover:bg-accent-hover text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => handleAutoFill('student')}
                            className="py-2 px-4 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            Auto Fill Student
                        </button>
                        <button
                            type="button"
                            onClick={() => handleAutoFill('admin')}
                            className="py-2 px-4 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            Auto Fill Admin
                        </button>
                    </div>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
                    <p className="text-xs text-gray-400">
                        Use the buttons above to auto-fill demo credentials
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
