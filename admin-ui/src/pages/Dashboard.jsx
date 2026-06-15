import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Activity, Tv, Users as UsersIcon, Star } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    channels: 0,
    trending: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Tạm thời gọi các API để đếm số lượng. 
        // Nếu Backend chưa có API count tổng quát, ta dùng độ dài mảng trả về (ở môi trường đồ án).
        const [usersRes, channelsRes, trendingRes] = await Promise.all([
          api.get('/auth/users'), // Lấy danh sách users
          api.get('/channels'),   // Lấy danh sách channels
          api.get('/interactions/trending') // Lấy trending channels
        ]);

        setStats({
          users: usersRes.data.users?.length || 0,
          channels: channelsRes.data.channels?.length || 0,
          trending: trendingRes.data.trending || []
        });
      } catch (error) {
        console.error("Lỗi lấy thống kê:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>Đang tải dữ liệu...</div>;

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '30px' }}>Tổng quan Hệ thống</h1>
      
      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ padding: '16px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: 'var(--radius-md)', color: 'var(--primary)' }}>
            <UsersIcon size={32} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>Tổng Người Dùng</p>
            <h2 style={{ fontSize: '1.8rem' }}>{stats.users}</h2>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ padding: '16px', background: 'rgba(236, 72, 153, 0.1)', borderRadius: 'var(--radius-md)', color: 'var(--secondary)' }}>
            <Tv size={32} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>Tổng Số Kênh</p>
            <h2 style={{ fontSize: '1.8rem' }}>{stats.channels}</h2>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-md)', color: 'var(--success)' }}>
            <Activity size={32} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>Hệ thống API</p>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--success)' }}>Online</h2>
          </div>
        </div>
      </div>

      {/* Trending Channels */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Star color="var(--warning)" size={20} />
          Kênh Đang Thịnh Hành (Trending)
        </h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Mã Kênh</th>
                <th>Tổng Điểm Tương Tác</th>
                <th>Lượt Clicks</th>
                <th>Lượt Thích (Tim)</th>
              </tr>
            </thead>
            <tbody>
              {stats.trending.length > 0 ? stats.trending.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{item._id}</td>
                  <td><span className="badge success">{item.totalScore} Điểm</span></td>
                  <td>{item.totalClicks}</td>
                  <td>{item.favoriteCount}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '30px' }}>Chưa có dữ liệu tương tác</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
