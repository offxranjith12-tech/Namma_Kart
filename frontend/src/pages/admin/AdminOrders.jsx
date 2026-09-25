import React, { useState, useEffect } from 'react';
import { ShoppingBag, Truck, Check, Filter, ChevronRight, UserCheck, Download } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { AdminSidebar } from '../../components/AdminSidebar';
import { useToast } from '../../context/ToastContext';
import { downloadReceipt } from '../../utils/receiptGenerator';

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [assigningDpId, setAssigningDpId] = useState('');
  const [updating, setUpdating] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    fetchOrders();
    fetchDeliveryPersons();
    
    // Poll for new orders every 10 seconds for live updates
    const interval = setInterval(() => {
      fetchOrders(true);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [statusFilter]);

  const fetchOrders = async (silent = false) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      if (!silent) setLoading(true);
      const res = await adminAPI.getOrders(statusFilter || null);
      if (res.success) {
        setOrders(res.data);
      }
    } catch (err) {
      if (!err.message?.includes('Unauthorized')) {
        console.error('Failed to load orders:', err);
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const fetchDeliveryPersons = async () => {
    try {
      const res = await adminAPI.getDeliveryPersons();
      if (res.success) {
        setDeliveryPersons(res.data.filter((dp) => dp.active));
      }
    } catch (err) {
      console.error('Failed to load delivery personnel:', err);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setUpdating(true);
      const res = await adminAPI.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        showToast(`Order #NK${orderId} updated to ${newStatus}`);
        fetchOrders();
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(res.data);
        }
      }
    } catch (err) {
      showToast(err.message || 'Status update failed', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleAssignDelivery = async (orderId) => {
    if (!assigningDpId) {
      showToast('Please select a delivery person', 'error');
      return;
    }

    try {
      setUpdating(true);
      const res = await adminAPI.assignDeliveryPerson(orderId, assigningDpId);
      if (res.success) {
        showToast(`Delivery person assigned to Order #NK${orderId}!`);
        fetchOrders();
        setSelectedOrder(res.data);
      }
    } catch (err) {
      showToast(err.message || 'Delivery assignment failed', 'error');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <AdminSidebar />

      <main className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: '1.85rem' }}>Orders Management</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
              Confirm orders, monitor preparation, and assign delivery fleet
            </p>
          </div>

          {/* Status Filter Chips */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['', 'PLACED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                type="button"
                className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-soft'}`}
                onClick={() => setStatusFilter(st)}
              >
                {st || 'All Orders'}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="card" style={{ padding: '1.5rem' }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading orders...</div>
          ) : orders.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No orders found for this status.</div>
          ) : (
            <div className="custom-table-wrap">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer Details</th>
                    <th>Slot & Address</th>
                    <th>Items & Bill</th>
                    <th>Status</th>
                    <th>Assigned Delivery Partner</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <strong>#NK{order.id}</strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 800 }}>{order.customerName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{order.customerPhone || order.customerEmail}</div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{order.slotName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', maxWidth: '200px' }}>
                          {order.addressLine}, {order.city}
                        </div>
                      </td>

                      <td>
                        <strong style={{ color: 'var(--color-primary)', fontSize: '1rem' }}>₹{order.totalAmount}</strong>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                          {order.items?.length || 0} items &bull; {order.paymentMethod} ({order.paymentStatus})
                        </div>
                      </td>

                      <td>
                        <span className="badge badge-soft">{order.status}</span>
                      </td>

                      <td>
                        {order.deliveryPersonName ? (
                          <div>
                            <strong style={{ color: 'var(--color-primary)', fontSize: '0.9rem' }}>{order.deliveryPersonName}</strong>
                            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{order.deliveryPersonVehicle}</div>
                          </div>
                        ) : (
                          <span className="badge" style={{ backgroundColor: 'var(--color-surface)' }}>Unassigned</span>
                        )}
                      </td>

                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => {
                              setSelectedOrder(order);
                              setAssigningDpId(order.deliveryPersonId || '');
                            }}
                          >
                            Manage
                          </button>
                          {order.status === 'DELIVERED' && (
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              style={{ padding: '0.3rem 0.5rem', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                              onClick={() => downloadReceipt(order)}
                              title="Download Tax Receipt PDF"
                            >
                              <Download size={13} /> Receipt
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Order Management Modal */}
        {selectedOrder && (
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
            <div className="card" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1.5px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                <h3 style={{ fontWeight: 800 }}>Manage Order #NK{selectedOrder.id}</h3>
                <button type="button" onClick={() => setSelectedOrder(null)} className="btn btn-soft btn-sm" style={{ fontSize: '1.2rem', padding: '0.2rem 0.6rem' }}>
                  &times;
                </button>
              </div>

              {/* Status Updater */}
              <div className="card-soft" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
                <h4 style={{ fontWeight: 800, marginBottom: '0.75rem' }}>Update Order Lifecycle Status</h4>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      className={`btn btn-sm ${selectedOrder.status === st ? 'btn-primary' : 'btn-soft'}`}
                      disabled={updating || selectedOrder.status === 'DELIVERED' || selectedOrder.status === 'CANCELLED'}
                      onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delivery Assignment */}
              <div className="card-soft" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
                <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Assign / Reassign Delivery Partner</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                  Select an active delivery fleet agent to dispatch this grocery delivery.
                </p>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select
                    className="form-control"
                    value={assigningDpId}
                    onChange={(e) => setAssigningDpId(e.target.value)}
                  >
                    <option value="">-- Choose Active Delivery Partner --</option>
                    {deliveryPersons.map((dp) => (
                      <option key={dp.id} value={dp.id}>
                        {dp.name} ({dp.vehicleType} - {dp.vehicleNumber}) - {dp.phone}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    disabled={updating || !assigningDpId}
                    onClick={() => handleAssignDelivery(selectedOrder.id)}
                  >
                    <UserCheck size={16} /> Assign
                  </button>
                </div>
              </div>

              {/* Order Items Breakdown */}
              <div>
                <h4 style={{ fontWeight: 800, marginBottom: '0.75rem' }}>Ordered Items</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                      <span>{item.productName} &times; {item.quantity}</span>
                      <strong>₹{item.subtotal}</strong>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 900 }}>
                  <span>Total Amount:</span>
                  <span style={{ color: 'var(--color-primary)' }}>₹{selectedOrder.totalAmount}</span>
                </div>

                {selectedOrder.status === 'DELIVERED' && (
                  <div style={{ marginTop: '1.25rem', textAlign: 'right' }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', width: '100%', justifyContent: 'center' }}
                      onClick={() => downloadReceipt(selectedOrder)}
                    >
                      <Download size={16} /> Download Tax Receipt PDF
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
