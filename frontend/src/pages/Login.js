import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../components/AuthContext';

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
    <div className="login-container">
      <div className="login-card">
        <h2>Hostel Management</h2>
        
        <div className="user-type-toggle">
          <button 
            type="button"
            className={`user-type-btn ${formData.userType === 'student' ? 'active' : ''}`}
            onClick={() => setFormData({...formData, userType: 'student', email: '', password: ''})}
          >
            Student
          </button>
          <button 
            type="button"
            className={`user-type-btn ${formData.userType === 'admin' ? 'active' : ''}`}
            onClick={() => setFormData({...formData, userType: 'admin', email: '', password: ''})}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              {formData.userType === 'admin' ? 'Username' : 'Email'}
            </label>
            <input
              type={formData.userType === 'admin' ? 'text' : 'email'}
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder={formData.userType === 'admin' ? 'Enter username' : 'Enter email address'}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
            />
          </div>

          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={fillDemoCredentials}
            style={{width: '100%', marginTop: '10px', background: '#6c757d'}}
          >
            Fill Demo Credentials
          </button>

          {error && <div className="error-message">{error}</div>}
        </form>

        <div style={{marginTop: '20px', fontSize: '14px', color: '#6c757d', textAlign: 'center'}}>
          <p><strong>Demo Credentials:</strong></p>
          <p>Admin: admin / admin123</p>
          <p>Student: rajesh@email.com / student123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;