import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/api';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('student');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await login(email, password, userType);
            if (response.data.success) {
                loginUser(response.data.user);
                navigate(userType === 'admin' ? '/admin' : '/student');
            } else {
                setError(response.data.message || 'Login failed');
            }
        } catch (err) {
            setError('Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    const fillDemo = () => {
        if (userType === 'admin') {
            setEmail('admin');
            setPassword('admin123');
        } else {
            setEmail('rajesh@email.com');
            setPassword('student123');
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#191919] flex items-center justify-center px-4">
            <div className="max-w-md w-full space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">Hostel Management</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Sign in to your account</p>
                </div>

                <div className="bg-white dark:bg-[#0F0F0F] p-6 border border-gray-200 dark:border-gray-800 rounded">
                    <div className="flex space-x-2 mb-6">
                        <button
                            type="button"
                            onClick={() => setUserType('student')}
                            className={`flex-1 py-2 px-4 rounded text-sm font-medium transition-colors ${userType === 'student'
                                ? 'bg-accent text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                        >
                            Student
                        </button>
                        <button
                            type="button"
                            onClick={() => setUserType('admin')}
                            className={`flex-1 py-2 px-4 rounded text-sm font-medium transition-colors ${userType === 'admin'
                                ? 'bg-accent text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                        >
                            Admin
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                {userType === 'admin' ? 'Username' : 'Email'}
                            </label>
                            <input
                                type={userType === 'admin' ? 'text' : 'email'}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-accent"
                                placeholder={userType === 'admin' ? 'Enter username' : 'Enter email'}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-accent"
                                placeholder="Enter password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>

                        <button
                            type="button"
                            onClick={fillDemo}
                            className="w-full py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-sm font-medium rounded transition-colors"
                        >
                            Fill Demo Credentials
                        </button>
                    </form>

                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded text-xs text-gray-600 dark:text-gray-400">
                        <p className="font-medium text-gray-900 dark:text-white mb-1.5">Demo Credentials:</p>
                        <div className="space-y-0.5">
                            <p>Admin: admin / admin123</p>
                            <p>Student: rajesh@email.com / student123</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
