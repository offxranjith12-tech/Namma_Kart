import React, { useState, useEffect } from 'react';
import { User, Phone, Bike, ShieldCheck, Check, LogOut } from 'lucide-react';
import { deliveryAPI } from '../../services/api';
import { DeliveryNav } from '../../components/DeliveryNav';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const DeliveryProfile = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await deliveryAPI.getProfile();
      if (res.success) {
        setProfile(res.data);
        setPhone(res.data.phone || '');
        setVehicleType(res.data.vehicleType || '');
        setVehicleNumber(res.data.vehicleNumber || '');
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await deliveryAPI.updateProfile({
        phone,
        vehicleType,
        vehicleNumber,
      });
      if (res.success) {
        setProfile(res.data);
        showToast('Delivery partner profile updated successfully!');
      }
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <DeliveryNav />

      <main className="container" style={{ padding: '2rem 1rem 4rem', maxWidth: '650px' }}>
        <h1 style={{ fontWeight: 800, fontSize: '1.85rem', marginBottom: '1.5rem' }}>Delivery Partner Profile</h1>

        {/* Stats card */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="card-soft" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>LIFETIME DELIVERIES</span>
            <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--color-primary)' }}>
              {profile?.assignedOrdersCount || 0}
            </div>
          </div>

          <div className="card-soft" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>COMPLETED TRIPS</span>
            <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--color-primary)' }}>
              {profile?.completedOrdersCount || 0}
            </div>
          </div>
        </div>

        {/* Profile Card */}
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
              {profile?.name?.charAt(0).toUpperCase() || 'D'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontWeight: 800 }}>{profile?.name}</h3>
                <span className="badge badge-primary">Active Partner</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{profile?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Phone Number (For Customer Contact)</label>
              <input
                type="tel"
                className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Vehicle Type</label>
                <input
                  type="text"
                  className="form-control"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  placeholder="e.g. Electric Scooter"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Vehicle Registration No.</label>
                <input
                  type="text"
                  className="form-control"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  placeholder="e.g. KA-04-EV-1024"
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                <Check size={16} /> {saving ? 'Saving...' : 'Update Details'}
              </button>

              <button type="button" onClick={logout} className="btn btn-soft" style={{ color: 'var(--color-primary)' }}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
