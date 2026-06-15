import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { UserCircle, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import Modal from '../components/Modal';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Phân trang
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const skip = (page - 1) * limit;
      const res = await api.get(`/auth/users?limit=${limit}&skip=${skip}`);
      setUsers(res.data.users || []);
      setTotal(res.data.total || 0);
    } catch (error) {
      console.error("Lỗi lấy danh sách user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleDelete = async (id) => {
    if (window.confirm('Cảnh báo: Bạn có chắc chắn muốn xóa vĩnh viễn người dùng này?')) {
      try {
        await api.delete(`/auth/users/${id}`);
        fetchUsers();
      } catch (error) {
        alert('Lỗi khi xóa: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/auth/users/${editingUser.id}`, {
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role
      });
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (error) {
      alert('Lỗi khi sửa user: ' + (error.response?.data?.message || error.message));
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '30px' }}>Quản lý Người Dùng</h1>

      <div className="glass-panel" style={{ padding: '20px' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>Đang tải danh sách...</div>
        ) : (
          <>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Avatar</th>
                    <th>ID Người Dùng</th>
                    <th>Tên</th>
                    <th>Email</th>
                    <th>Quyền</th>
                    <th>Ngày Đăng Ký</th>
                    <th style={{ textAlign: 'right' }}>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                          <UserCircle size={24} />
                        </div>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{user.id}</td>
                      <td style={{ fontWeight: 500 }}>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge ${user.role === 'admin' ? 'success' : 'primary'}`}>
                          {user.role === 'admin' ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button onClick={() => handleEditClick(user)} className="btn-outline" style={{ padding: '6px 12px', marginRight: '8px', borderColor: 'var(--primary)', color: 'var(--primary)' }}>
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(user.id)} className="btn-outline" style={{ padding: '6px 12px', borderColor: 'var(--danger)', color: 'var(--danger)' }}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>Chưa có người dùng nào</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Phân trang */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Tổng cộng: <strong style={{ color: 'white' }}>{total}</strong> tài khoản
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

      {/* Modal Sửa User */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        title="Chỉnh sửa Người dùng"
      >
        {editingUser && (
          <form onSubmit={handleEditSubmit}>
            <div className="input-group">
              <label>Tên người dùng</label>
              <input 
                type="text" 
                className="input-field" 
                value={editingUser.name}
                onChange={e => setEditingUser({...editingUser, name: e.target.value})}
                required 
              />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input 
                type="email" 
                className="input-field" 
                value={editingUser.email}
                onChange={e => setEditingUser({...editingUser, email: e.target.value})}
                required
              />
            </div>
            <div className="input-group" style={{ marginBottom: '20px' }}>
              <label>Quyền hạn (Role)</label>
              <select 
                className="input-field" 
                value={editingUser.role}
                onChange={e => setEditingUser({...editingUser, role: e.target.value})}
                style={{ appearance: 'none', background: 'rgba(0,0,0,0.2)', color: 'white' }}
              >
                <option value="user" style={{ color: 'black' }}>Người dùng thường (User)</option>
                <option value="admin" style={{ color: 'black' }}>Quản trị viên (Admin)</option>
              </select>
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

export default Users;
