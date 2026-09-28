import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { login } from '../services/auth';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginSuccess } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const data = await login(username, password);
      const role = await loginSuccess(data.access_token);
      if (role === 'student') {
        navigate('/student/dashboard');
      } else if (role === 'teacher') {
        navigate('/teacher/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid username or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <img src="/logo.jpg" alt="SIIT Logo" className="login-logo" />
          <h1 className="login-title">South India Institute of Technology</h1>
          <p className="login-subtitle">Student Information Portal</p>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <div className="form-group"><span className="error-message" style={{textAlign: 'center', display: 'block'}}>{error}</span></div>}
          <div className="form-group">
            <label className="form-label">Username / Register Number</label>
            <input 
              type="text" 
              className="form-control" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn" style={{width: '100%', marginTop: '16px'}} disabled={isSubmitting}>
            {isSubmitting ? 'Authenticating...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
