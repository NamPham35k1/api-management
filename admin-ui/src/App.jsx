import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Channels from './pages/Channels';
import Users from './pages/Users';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Các route yêu cầu login */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="channels" element={<Channels />} />
          <Route path="users" element={<Users />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
