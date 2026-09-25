import React, { useState, useEffect } from 'react';
import { Clock, Plus, Edit3, Trash2 } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { AdminSidebar } from '../../components/AdminSidebar';
import { useToast } from '../../context/ToastContext';

export const AdminDeliverySlots = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [formData, setFormData] = useState({
    slotName: '',
    startTime: '06:00 AM',
    endTime: '09:00 AM',
    maximumOrders: 50,
    available: true,
    active: true,
  });

  const { showToast } = useToast();

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getDeliverySlots();
      if (res.success) setSlots(res.data);
    } catch (err) {
      console.error('Failed to load slots:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingSlot(null);
    setFormData({ slotName: '', startTime: '06:00 AM', endTime: '09:00 AM', maximumOrders: 50, available: true, active: true });
    setShowModal(true);
  };

  const handleOpenEdit = (slot) => {
    setEditingSlot(slot);
    setFormData({
      slotName: slot.slotName,
      startTime: slot.startTime,
      endTime: slot.endTime,
      maximumOrders: slot.maximumOrders || 50,
      available: slot.available,
      active: slot.active,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSlot) {
        await adminAPI.updateDeliverySlot(editingSlot.id, formData);
        showToast('Slot updated successfully');
      } else {
        await adminAPI.createDeliverySlot(formData);
        showToast('Slot created successfully');
      }
      setShowModal(false);
      fetchSlots();
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this slot?')) return;
    try {
      await adminAPI.deleteDeliverySlot(id);
      showToast('Delivery slot deactivated');
      fetchSlots();
    } catch (err) {
      showToast(err.message || 'Failed to delete slot', 'error');
    }
  };

  return (
    <div className="dashboard-layout">
      <AdminSidebar />

      <main className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: '1.85rem' }}>Delivery Slots Management</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
              Define operational time windows and capacity caps for customer checkout
            </p>
          </div>

          <button type="button" onClick={handleOpenAdd} className="btn btn-primary btn-sm">
            <Plus size={16} /> Add Slot
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
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '1rem',
            }}
          >
            <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '2rem' }}>
              <h3 style={{ fontWeight: 800, marginBottom: '1.25rem' }}>
                {editingSlot ? 'Edit Delivery Slot' : 'Create Delivery Slot'}
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Slot Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Early Morning Express"
                    value={formData.slotName}
                    onChange={(e) => setFormData({ ...formData, slotName: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Start Time</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="06:00 AM"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Time</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="09:00 AM"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Order Capacity Cap</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.maximumOrders}
                    onChange={(e) => setFormData({ ...formData, maximumOrders: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
                  <button type="submit" className="btn btn-primary btn-sm">
                    {editingSlot ? 'Save Changes' : 'Create Slot'}
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
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading slots...</div>
          ) : (
            <div className="custom-table-wrap">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Slot Name</th>
                    <th>Time Window</th>
                    <th>Max Capacity</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {slots.map((s) => (
                    <tr key={s.id}>
                      <td><strong style={{ fontSize: '0.95rem' }}>{s.slotName}</strong></td>
                      <td>{s.startTime} - {s.endTime}</td>
                      <td>{s.maximumOrders} orders</td>
                      <td>
                        <span className={`badge ${s.active ? 'badge-primary' : 'badge-soft'}`}>
                          {s.active ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button type="button" onClick={() => handleOpenEdit(s)} className="btn btn-soft btn-sm" title="Edit">
                            <Edit3 size={14} />
                          </button>
                          <button type="button" onClick={() => handleDelete(s.id)} className="btn btn-soft btn-sm" style={{ color: 'var(--color-primary)' }} title="Deactivate">
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
