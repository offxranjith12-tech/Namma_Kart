import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Plus, Trash2, Edit3, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { addressesAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

export const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    addressLine: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560103',
    isDefault: false,
  });

  const { showToast } = useToast();

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await addressesAPI.getAll();
      if (res.success) {
        setAddresses(res.data);
      }
    } catch (err) {
      console.error('Failed to load addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ addressLine: '', city: 'Bengaluru', state: 'Karnataka', pincode: '560103', isDefault: false });
    setShowModal(true);
  };

  const handleOpenEdit = (addr) => {
    setEditingId(addr.id);
    setFormData({
      addressLine: addr.addressLine,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      isDefault: addr.isDefault,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await addressesAPI.update(editingId, formData);
        showToast('Address updated successfully');
      } else {
        await addressesAPI.create(formData);
        showToast('Address added successfully');
      }
      setShowModal(false);
      fetchAddresses();
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await addressesAPI.delete(id);
      showToast('Address deleted');
      fetchAddresses();
    } catch (err) {
      showToast(err.message || 'Could not delete address', 'error');
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem 4rem', maxWidth: '750px' }}>
      <Link to="/profile" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem', color: 'var(--color-text-muted)' }}>
        <ArrowLeft size={16} /> Back to Profile
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <h1 style={{ fontWeight: 800, fontSize: '1.85rem' }}>Saved Addresses</h1>
        <button type="button" onClick={handleOpenAdd} className="btn btn-primary btn-sm">
          <Plus size={16} /> Add Address
        </button>
      </div>

      {showModal && (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', border: '2px solid var(--color-primary)' }}>
          <h3 style={{ fontWeight: 800, marginBottom: '1rem' }}>
            {editingId ? 'Edit Address' : 'Add New Address'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Address Line / Flat / Street</label>
              <input
                type="text"
                className="form-control"
                value={formData.addressLine}
                onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">State</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Pincode</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  required
                />
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.75rem 0 1.25rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 700 }}>
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                style={{ accentColor: 'var(--color-primary)' }}
              />
              Set as Default Address
            </label>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn btn-primary btn-sm">
                Save Address
              </button>
              <button type="button" onClick={() => setShowModal(false)} className="btn btn-soft btn-sm">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>Loading addresses...</div>
      ) : addresses.length === 0 ? (
        <div className="card-soft" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>You don't have any saved addresses yet.</p>
          <button type="button" onClick={handleOpenAdd} className="btn btn-primary btn-sm">
            Add Your First Address
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="card"
              style={{
                padding: '1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <MapPin size={18} color="var(--color-primary)" />
                  <strong style={{ fontSize: '1rem' }}>{addr.city}, {addr.pincode}</strong>
                  {addr.isDefault && <span className="badge badge-primary">Default</span>}
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
                  {addr.addressLine}, {addr.state}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(addr)}
                  className="btn btn-soft btn-sm"
                  title="Edit Address"
                >
                  <Edit3 size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(addr.id)}
                  className="btn btn-soft btn-sm"
                  style={{ color: 'var(--color-primary)' }}
                  title="Delete Address"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
