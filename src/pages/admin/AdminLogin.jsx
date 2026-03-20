import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import api from '../../utils/api';
import './Admin.css';

export default function AdminLogin({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/admin/login', form);
      localStorage.setItem('sprouts-admin-token', res.data.token);
      onLogin();
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <motion.div className="admin-login-card card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <div className="admin-login-icon">
          <img src="https://ik.imagekit.io/Lourdu/Sprouts/logo.jpeg?updatedAt=1773849138906" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <h2>Admin Login</h2>
        <p>Sign in to manage your website content</p>
        {error && <div className="admin-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label><FiUser size={14} /> Username</label>
            <input type="text" value={form.username} onChange={e => setForm(prev => ({ ...prev, username: e.target.value }))} required placeholder="Enter username" />
          </div>
          <div className="input-group">
            <label><FiLock size={14} /> Password</label>
            <div className="password-input-wrap">
              <input 
                type={showPassword ? "text" : "password"} 
                value={form.password} 
                onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))} 
                required 
                placeholder="Enter password" 
              />
              <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
