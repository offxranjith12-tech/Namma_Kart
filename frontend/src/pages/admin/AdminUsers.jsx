import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, Truck, User } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { AdminSidebar } from '../../components/AdminSidebar';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getUsers();
      if (res.success) setUsers(res.data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ROLE_ADMIN':
        return <span className="badge badge-primary"><ShieldCheck size={12} /> Admin</span>;
      case 'ROLE_DELIVERY_PERSON':
        return <span className="badge badge-soft"><Truck size={12} /> Delivery Fleet</span>;
      default:
        return <span className="badge"><User size={12} /> Customer</span>;
    }
  };

  return (
    <div className="dashboard-layout">
      <AdminSidebar />

      <main className="main-content">
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontWeight: 800, fontSize: '1.85rem' }}>User Directory</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
            List of all registered Customers, Delivery Fleet Partners, and Administrators
          </p>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading users...</div>
          ) : (
            <div className="custom-table-wrap">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email Address</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Joined Date</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td><strong style={{ fontSize: '0.95rem' }}>{u.name}</strong></td>
                      <td>{u.email}</td>
                      <td>{u.phone || 'N/A'}</td>
                      <td>{getRoleBadge(u.role)}</td>
                      <td style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                        {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
