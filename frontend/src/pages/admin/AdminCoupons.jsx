import React, { useState, useEffect } from 'react';
import { TicketPercent, Plus, Edit3, Trash2 } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { AdminSidebar } from '../../components/AdminSidebar';
import { useToast } from '../../context/ToastContext';

export const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: '20',
    minimumOrderAmount: '299',
    maximumDiscount: '100',
    active: true,
  });

  const { showToast } = useToast();

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getCoupons();
      if (res.success) setCoupons(res.data);
    } catch (err) {
      console.error('Failed to load coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingCoupon(null);
    setFormData({ code: '', discountType: 'PERCENTAGE', discountValue: '20', minimumOrderAmount: '299', maximumDiscount: '100', active: true });
    setShowModal(true);
  };

  const handleOpenEdit = (c) => {
    setEditingCoupon(c);
    setFormData({
      code: c.code,
      discountType: c.discountType,
      discountValue: c.discountValue,
      minimumOrderAmount: c.minimumOrderAmount || '0',
      maximumDiscount: c.maximumDiscount || '',
      active: c.active,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        code: formData.code.toUpperCase().trim(),
        discountValue: Number(formData.discountValue),
        minimumOrderAmount: Number(formData.minimumOrderAmount || 0),
        maximumDiscount: formData.maximumDiscount ? Number(formData.maximumDiscount) : null,
      };

      if (editingCoupon) {
        await adminAPI.updateCoupon(editingCoupon.id, payload);
        showToast('Coupon updated successfully');
      } else {
        await adminAPI.createCoupon(payload);
        showToast('Coupon created successfully');
      }
      setShowModal(false);
      fetchCoupons();
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this coupon?')) return;
    try {
      await adminAPI.deleteCoupon(id);
      showToast('Coupon deactivated');
      fetchCoupons();
    } catch (err) {
      showToast(err.message || 'Failed to delete coupon', 'error');
    }
  };

  return (
    <div className="dashboard-layout">
      <AdminSidebar />

      <main className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: '1.85rem' }}>Coupons & Promotions</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
              Create promo discount codes, minimum order criteria, and discount caps
            </p>
          </div>

          <button type="button" onClick={handleOpenAdd} className="btn btn-primary btn-sm">
            <Plus size={16} /> Create Coupon
          </button>
        </div>

        {/* Modal */}
        {showModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'var(--color-primary-30)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '1rem',
            }}
          >
            <div className="card" style={{ maxWidth: '460px', width: '100%', padding: '2rem' }}>
              <h3 style={{ fontWeight: 800, marginBottom: '1.25rem' }}>
                {editingCoupon ? 'Edit Coupon' : 'Create Promo Coupon'}
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Coupon Code (Uppercase)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. NAMMA100"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    required
                    style={{ textTransform: 'uppercase' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Type</label>
                    <select
                      className="form-control"
                      value={formData.discountType}
                      onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    >
                      <option value="PERCENTAGE">Percentage (%)</option>
                      <option value="FLAT">Flat Amount (₹)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Discount Value</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Min Order (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.minimumOrderAmount}
                      onChange={(e) => setFormData({ ...formData, minimumOrderAmount: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Max Cap (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Optional"
                      value={formData.maximumDiscount}
                      onChange={(e) => setFormData({ ...formData, maximumDiscount: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
                  <button type="submit" className="btn btn-primary btn-sm">
                    {editingCoupon ? 'Save Changes' : 'Create Coupon'}
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-soft btn-sm">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="card" style={{ padding: '1.5rem' }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading coupons...</div>
          ) : (
            <div className="custom-table-wrap">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Type & Value</th>
                    <th>Min Order</th>
                    <th>Max Discount Cap</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c) => (
                    <tr key={c.id}>
                      <td><strong style={{ fontSize: '1rem', color: 'var(--color-primary)' }}>{c.code}</strong></td>
                      <td>{c.discountType === 'PERCENTAGE' ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT`}</td>
                      <td>₹{c.minimumOrderAmount || 0}</td>
                      <td>{c.maximumDiscount ? `₹${c.maximumDiscount}` : 'No Cap'}</td>
                      <td>
                        <span className={`badge ${c.active ? 'badge-primary' : 'badge-soft'}`}>
                          {c.active ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button type="button" onClick={() => handleOpenEdit(c)} className="btn btn-soft btn-sm" title="Edit">
                            <Edit3 size={14} />
                          </button>
                          <button type="button" onClick={() => handleDelete(c.id)} className="btn btn-soft btn-sm" style={{ color: 'var(--color-primary)' }} title="Deactivate">
                            <Trash2 size={14} />
                          </button>
                        </div>
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
