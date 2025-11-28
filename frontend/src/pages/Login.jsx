import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'student'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData);
      
      if (response.data.success) {
        login(response.data.user);
        navigate(response.data.user.type === 'admin' ? '/admin' : '/student');
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const demoCredentials = {
    admin: { email: 'admin', password: 'admin123' },
    student: { email: 'rajesh@email.com', password: 'student123' }
  };

  const fillDemoCredentials = () => {
    setFormData({
      ...formData,
      email: demoCredentials[formData.userType].email,
      password: demoCredentials[formData.userType].password
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Hostel Management</h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>
        
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button 
            type="button"
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              formData.userType === 'student' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setFormData({...formData, userType: 'student', email: '', password: ''})}
          >
            Student
          </button>
          <button 
            type="button"
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              formData.userType === 'admin' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setFormData({...formData, userType: 'admin', email: '', password: ''})}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {formData.userType === 'admin' ? 'Username' : 'Email'}
            </label>
            <input
              type={formData.userType === 'admin' ? 'text' : 'email'}
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              placeholder={formData.userType === 'admin' ? 'Enter username' : 'Enter email address'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter password"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </button>

          <button 
            type="button" 
            onClick={fillDemoCredentials}
            className="w-full py-2 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
          >
            Fill Demo Credentials
          </button>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          )}
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 text-center font-medium mb-2">Demo Credentials:</p>
          <div className="text-xs text-gray-500 space-y-1">
            <p><strong>Admin:</strong> admin / admin123</p>
            <p><strong>Student:</strong> rajesh@email.com / student123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;