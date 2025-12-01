import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('student');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const result = await login({
                email,
                password,
                userType
            });

            if (result.success) {
                const user = result.user;
                // Redirect based on user type
                if (user.type === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/student');
                }
            } else {
                setError(result.message || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAutoFill = (type) => {
        if (type === 'admin') {
            setEmail('admin');
            setUserType('admin');
            setPassword('admin123');
        } else {
            setEmail('student@college.edu');
            setUserType('student');
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Login As
                        </label>
                        <select 
                            value={userType}
                            onChange={(e) => setUserType(e.target.value)}
                            className="w-full px-4 py-3 text-lg rounded-lg border outline-none focus:ring-2 bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-gray-900 dark:text-white mb-4"
                        >
                            <option value="student">Student</option>
                            <option value="admin">Admin</option>
                        </select>
                        
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            {userType === 'admin' ? 'Username' : 'Email'}
                        </label>
                        <input
                            type={userType === 'admin' ? 'text' : 'email'}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 text-lg rounded-lg border outline-none focus:ring-2 bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400"
                            placeholder={userType === 'admin' ? 'Enter username' : 'Enter email address'}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 text-lg rounded-lg border outline-none focus:ring-2 bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400"
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
