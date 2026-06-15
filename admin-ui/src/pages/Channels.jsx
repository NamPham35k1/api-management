import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Trash2, Edit, ChevronLeft, ChevronRight } from 'lucide-react';
import Modal from '../components/Modal';

const Channels = () => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Phân trang
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState(null);

  const fetchChannels = async () => {
    setLoading(true);
    try {
      const skip = (page - 1) * limit;
      const res = await api.get(`/channels?limit=${limit}&skip=${skip}`);
      setChannels(res.data.channels || []);
      setTotal(res.data.total || 0);
    } catch (error) {
      console.error("Lỗi lấy danh sách kênh:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, [page]);

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa kênh này?')) {
      try {
        await api.delete(`/channels/${id}`);
        fetchChannels(); // Tải lại danh sách
      } catch (error) {
        alert('Lỗi khi xóa kênh: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleEditClick = (channel) => {
    setEditingChannel(channel);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/channels/${editingChannel._id}`, editingChannel);
      setIsEditModalOpen(false);
      fetchChannels();
    } catch (error) {
      alert('Lỗi khi sửa kênh: ' + (error.response?.data?.message || error.message));
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem' }}>Quản lý Kênh (Channels)</h1>
        {/* Nút Thêm Mới đã bị ẩn theo yêu cầu */}
      </div>

      <div className="glass-panel" style={{ padding: '20px' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>Đang tải danh sách...</div>
        ) : (
          <>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Logo</th>
                    <th>Mã Kênh</th>
                    <th>Tên Kênh</th>
                    <th>Danh Mục</th>
                    <th>Quốc Gia</th>
                    <th style={{ textAlign: 'right' }}>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {channels.length > 0 ? channels.map((channel) => (
                    <tr key={channel._id}>
                      <td>
                        {channel.logo ? (
                          <img src={channel.logo} alt={channel.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', background: '#333' }} />
                        ) : (
                          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--bg-surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>N/A</div>
                        )}
                      </td>
                      <td style={{ fontWeight: 600 }}>{channel.channelId}</td>
                      <td>{channel.name}</td>
                      <td><span className="badge primary">{channel.category || 'N/A'}</span></td>
                      <td>{channel.country || 'N/A'}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button onClick={() => handleEditClick(channel)} className="btn-outline" style={{ padding: '6px 12px', marginRight: '8px', borderColor: 'var(--primary)', color: 'var(--primary)' }}>
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(channel._id)} className="btn-outline" style={{ padding: '6px 12px', borderColor: 'var(--danger)', color: 'var(--danger)' }}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>Chưa có kênh nào trong hệ thống</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Phân trang */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Tổng cộng: <strong style={{ color: 'white' }}>{total}</strong> kênh
              </div>
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button 
                  className="btn-outline" 
                  style={{ padding: '8px' }} 
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  <ChevronLeft size={18} />
                </button>
                
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Trang <strong style={{ color: 'white' }}>{page}</strong> / {totalPages}
                </span>

                <button 
                  className="btn-outline" 
                  style={{ padding: '8px' }} 
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal Sửa Kênh */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        title="Chỉnh sửa thông tin Kênh"
      >
        {editingChannel && (
          <form onSubmit={handleEditSubmit}>
            <div className="input-group">
              <label>Tên Kênh</label>
              <input 
                type="text" 
                className="input-field" 
                value={editingChannel.name}
                onChange={e => setEditingChannel({...editingChannel, name: e.target.value})}
                required 
              />
            </div>
            <div className="input-group">
              <label>Danh mục (Category)</label>
              <input 
                type="text" 
                className="input-field" 
                value={editingChannel.category || ''}
                onChange={e => setEditingChannel({...editingChannel, category: e.target.value})}
              />
            </div>
            <div className="input-group">
              <label>Quốc gia</label>
              <input 
                type="text" 
                className="input-field" 
                value={editingChannel.country || ''}
                onChange={e => setEditingChannel({...editingChannel, country: e.target.value})}
              />
            </div>
            <div className="input-group" style={{ marginBottom: '20px' }}>
              <label>Link Logo (URL)</label>
              <input 
                type="text" 
                className="input-field" 
                value={editingChannel.logo || ''}
                onChange={e => setEditingChannel({...editingChannel, logo: e.target.value})}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn-outline">Hủy</button>
              <button type="submit" className="btn-primary">Lưu thay đổi</button>
            </div>
          </form>
        )}
      </Modal>

    </div>
  );
};

export default Channels;
