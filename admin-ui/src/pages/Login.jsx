import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Dùng API login có sẵn của Backend
      const res = await api.post('/auth/login', { email, password });
      
      if (res.data.accessToken) {
        localStorage.setItem('admin_token', res.data.accessToken);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at top right, #1e1b4b, var(--bg-base))'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        padding: '40px',
        width: '100%',
        maxWidth: '420px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '8px' }}>API Admin</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Đăng nhập để quản lý hệ thống</p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            color: 'var(--danger)',
            padding: '12px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '20px',
            fontSize: '0.9rem',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email Admin</label>
            <input 
              type="email" 
              className="input-field" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required 
            />
          </div>

          <div className="input-group" style={{ marginBottom: '30px' }}>
            <label>Mật khẩu</label>
            <input 
              type="password" 
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required 
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : (
              <>
                <LogIn size={20} /> Đăng nhập hệ thống
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
