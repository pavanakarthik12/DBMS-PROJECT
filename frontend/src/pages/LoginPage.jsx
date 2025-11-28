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
        <div className="min-h-screen bg-primary-dark flex items-center justify-center px-4">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-2">Hostel Management</h1>
                    <p className="text-gray-400">Sign in to your account</p>
                </div>

                <div className="bg-surface-dark p-8 rounded-lg border border-gray-700">
                    <div className="flex space-x-4 mb-6">
                        <button
                            type="button"
                            onClick={() => setUserType('student')}
                            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${userType === 'student'
                                    ? 'bg-accent-blue text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                        >
                            Student
                        </button>
                        <button
                            type="button"
                            onClick={() => setUserType('admin')}
                            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${userType === 'admin'
                                    ? 'bg-accent-blue text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                        >
                            Admin
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-200 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                {userType === 'admin' ? 'Username' : 'Email'}
                            </label>
                            <input
                                type={userType === 'admin' ? 'text' : 'email'}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent-blue"
                                placeholder={userType === 'admin' ? 'Enter username' : 'Enter email'}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent-blue"
                                placeholder="Enter password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-accent-blue hover:bg-blue-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>

                        <button
                            type="button"
                            onClick={fillDemo}
                            className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                        >
                            Fill Demo Credentials
                        </button>
                    </form>

                    <div className="mt-6 p-4 bg-gray-800 rounded-lg text-sm text-gray-400">
                        <p className="font-medium text-white mb-2">Demo Credentials:</p>
                        <div className="space-y-1">
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
