import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, ShoppingBag, LogOut, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authAPI } from '../services/api';
import { Addresses } from './Addresses';

export const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await authAPI.updateMe({ name, phone });
      if (res.success) {
        updateUser(res.data);
        showToast('Profile updated successfully!');
      }
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem 4rem', maxWidth: '650px' }}>
      <h1 style={{ fontWeight: 800, fontSize: '1.85rem', marginBottom: '1.5rem' }}>My Profile</h1>

      {/* Quick Navigation Cards - Only for Customers */}
      {user?.role === 'CUSTOMER' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '2rem' }}>
          <Link to="/orders" className="card" style={{ padding: '1.25rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-primary-15)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={18} />
            </div>
            <div>
              <h4 style={{ fontWeight: 800, color: 'var(--color-text-main)' }}>My Orders</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>View & track orders</p>
            </div>
          </Link>

        </div>
      )}

      {/* Profile Form */}
      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-primary)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              fontWeight: 800,
            }}
          >
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h3 style={{ fontWeight: 800 }}>{user?.name}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address (Read-only)</label>
            <input
              type="email"
              className="form-control"
              value={user?.email || ''}
              disabled
              style={{ opacity: 0.7 }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9880011223"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Check size={16} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>

            <button type="button" onClick={logout} className="btn btn-soft" style={{ color: 'var(--color-primary)' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </form>
      </div>

      {/* Embedded Addresses Section */}
      {user?.role === 'CUSTOMER' && (
        <Addresses embedded={true} />
      )}
    </div>
  );
};
