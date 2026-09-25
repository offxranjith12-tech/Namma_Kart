import React, { useState, useEffect } from 'react';
import { Bike, Plus, Edit3, Power, PowerOff, CheckCircle2 } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { AdminSidebar } from '../../components/AdminSidebar';
import { useToast } from '../../context/ToastContext';

export const AdminDeliveryPersons = () => {
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDp, setEditingDp] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    vehicleType: 'Electric Scooter',
    vehicleNumber: 'KA-04-EV-2026',
    licenseNumber: '',
    active: true,
  });

  const { showToast } = useToast();

  useEffect(() => {
    fetchDeliveryPersons();
  }, []);

  const fetchDeliveryPersons = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getDeliveryPersons();
      if (res.success) {
        setDeliveryPersons(res.data);
      }
    } catch (err) {
      console.error('Failed to load delivery personnel:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingDp(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      vehicleType: 'Electric Scooter',
      vehicleNumber: 'KA-04-EV-2026',
      licenseNumber: '',
      active: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (dp) => {
    setEditingDp(dp);
    setFormData({
      name: dp.name,
      email: dp.email || '',
      phone: dp.phone,
      password: '',
      vehicleType: dp.vehicleType || '',
      vehicleNumber: dp.vehicleNumber || '',
      licenseNumber: dp.licenseNumber || '',
      active: dp.active,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDp) {
        await adminAPI.updateDeliveryPerson(editingDp.id, {
          name: formData.name,
          phone: formData.phone,
          vehicleType: formData.vehicleType,
          vehicleNumber: formData.vehicleNumber,
          licenseNumber: formData.licenseNumber,
          active: formData.active,
        });
        showToast('Delivery partner profile updated');
      } else {
        await adminAPI.createDeliveryPerson(formData);
        showToast('New delivery partner account created successfully');
      }
      setShowModal(false);
      fetchDeliveryPersons();
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleToggleStatus = async (dp) => {
    try {
      if (dp.active) {
        await adminAPI.deactivateDeliveryPerson(dp.id);
        showToast(`${dp.name} deactivated`);
      } else {
        await adminAPI.activateDeliveryPerson(dp.id);
        showToast(`${dp.name} activated for deliveries`);
      }
      fetchDeliveryPersons();
    } catch (err) {
      showToast(err.message || 'Could not update status', 'error');
    }
  };

  return (
    <div className="dashboard-layout">
      <AdminSidebar />

      <main className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: '1.85rem' }}>Delivery Fleet Management</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
              Create delivery personnel accounts, manage active duty status, and monitor fulfillment metrics
            </p>
          </div>

          <button type="button" onClick={handleOpenAdd} className="btn btn-primary btn-sm">
            <Plus size={16} /> Add Delivery Partner
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
            <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '2rem' }}>
              <h3 style={{ fontWeight: 800, marginBottom: '1.25rem' }}>
                {editingDp ? 'Edit Delivery Partner' : 'Create Delivery Partner Account'}
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                {!editingDp && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Email Address (for login)</label>
                      <input
                        type="email"
                        className="form-control"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Temporary Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        minLength={6}
                      />
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">License Number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. KA-123456"
                      value={formData.licenseNumber}
                      onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Vehicle Type</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Electric Scooter"
                      value={formData.vehicleType}
                      onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Vehicle Number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. KA-04-EV-1024"
                      value={formData.vehicleNumber}
                      onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
                  <button type="submit" className="btn btn-primary btn-sm">
                    {editingDp ? 'Save Profile' : 'Create Partner Account'}
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-soft btn-sm">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="card" style={{ padding: '1.5rem' }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading fleet data...</div>
          ) : (
            <div className="custom-table-wrap">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Delivery Partner</th>
                    <th>Phone</th>
                    <th>Vehicle Details</th>
                    <th>Assigned Deliveries</th>
                    <th>Completed</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveryPersons.map((dp) => (
                    <tr key={dp.id}>
                      <td>
                        <strong style={{ fontSize: '0.95rem' }}>{dp.name}</strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{dp.email}</div>
                      </td>

                      <td>{dp.phone}</td>

                      <td>
                        <strong>{dp.vehicleType || 'Vehicle'}</strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>No: {dp.vehicleNumber || 'N/A'} &bull; Lic: {dp.licenseNumber || 'N/A'}</div>
                      </td>

                      <td>
                        <strong style={{ fontSize: '1rem' }}>{dp.assignedOrdersCount || 0}</strong>
                      </td>

                      <td>
                        <strong style={{ color: 'var(--color-primary)' }}>{dp.completedOrdersCount || 0}</strong>
                      </td>

                      <td>
                        <span className={`badge ${dp.active ? 'badge-primary' : 'badge-soft'}`}>
                          {dp.active ? 'Active on Duty' : 'Deactivated'}
                        </span>
                      </td>

                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(dp)}
                            className="btn btn-soft btn-sm"
                            title="Edit Profile"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(dp)}
                            className="btn btn-soft btn-sm"
                            title={dp.active ? 'Deactivate' : 'Activate'}
                            style={{ color: 'var(--color-primary)' }}
                          >
                            {dp.active ? <PowerOff size={14} /> : <Power size={14} />}
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
