import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Tv, LogOut } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  const navItems = [
    { path: '/', icon: <LayoutDashboard size={20} />, label: 'Tổng quan' },
    { path: '/channels', icon: <Tv size={20} />, label: 'Quản lý Kênh' },
    { path: '/users', icon: <Users size={20} />, label: 'Người dùng' },
  ];

  return (
    <div style={{
      width: '280px',
      backgroundColor: 'var(--bg-surface)',
      borderRight: '1px solid var(--border-color)',
      padding: '30px 20px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ marginBottom: '40px', padding: '0 10px' }}>
        <h2 className="text-gradient" style={{ fontSize: '1.5rem' }}>API Admin</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>Management Dashboard</p>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              color: isActive ? 'white' : 'var(--text-secondary)',
              backgroundColor: isActive ? 'var(--primary-glow)' : 'transparent',
              border: `1px solid ${isActive ? 'var(--primary)' : 'transparent'}`,
              transition: 'all 0.2s ease',
              fontWeight: 500
            })}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button 
        onClick={handleLogout}
        className="btn-outline" 
        style={{ width: '100%', justifyContent: 'center', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
      >
        <LogOut size={18} />
        Đăng xuất
      </button>
    </div>
  );
};

export default Sidebar;
