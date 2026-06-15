import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  const token = localStorage.getItem('admin_token');

  // Đơn giản hóa: Nếu không có token thì bắt login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
