import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Truck, Clock, CheckCircle2, Phone, MapPin, ChevronRight, Package, AlertCircle } from 'lucide-react';
import { deliveryAPI } from '../../services/api';
import { DeliveryNav } from '../../components/DeliveryNav';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const DeliveryDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await deliveryAPI.getDashboard();
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load delivery dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptDelivery = async (orderId) => {
    try {
      setActionLoading(true);
      const res = await deliveryAPI.acceptDelivery(orderId);
      if (res.success) {
        showToast('Delivery accepted successfully! 🚀');
        fetchDashboard();
      }
    } catch (err) {
      showToast(err.message || 'Could not accept delivery', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, targetStatus) => {
    try {
      setActionLoading(true);
      const res = await deliveryAPI.updateStatus(orderId, targetStatus);
      if (res.success) {
        showToast(
          targetStatus === 'OUT_FOR_DELIVERY'
            ? 'Order marked as Out for Delivery 🛵'
            : 'Order marked as Delivered! 🎉'
        );
        fetchDashboard();
      }
    } catch (err) {
      showToast(err.message || 'Status update failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <DeliveryNav />
        <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
          Loading delivery partner hub...
        </div>
      </div>
    );
  }

  const activeOrders = data?.assignedOrders?.filter((o) => o.status !== 'DELIVERED') || [];

  return (
    <div>
      <DeliveryNav />

      <main className="container" style={{ padding: '2rem 1rem 4rem' }}>
        {/* Header Greeting */}
        <div style={{ marginBottom: '2rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
            ON-DUTY DELIVERY PARTNER
          </span>
          <h1 style={{ fontWeight: 800, fontSize: '2rem' }}>
            {getGreeting()}, {user?.name || data?.deliveryPerson?.name}
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Vehicle: <strong>{data?.deliveryPerson?.vehicleType}</strong> ({data?.deliveryPerson?.vehicleNumber})
          </p>
        </div>

        {/* 4 Summary KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          {/* Today's Deliveries */}
          <div className="stat-card">
            <div>
              <span className="stat-label">Today's Deliveries</span>
              <div className="stat-value">{data?.todayTotalDeliveries || 0}</div>
            </div>
            <div className="stat-icon-wrap"><Truck size={22} /></div>
          </div>

          {/* Pending */}
          <div className="stat-card">
            <div>
              <span className="stat-label">Pending Pickup</span>
              <div className="stat-value">{data?.pendingDeliveries || 0}</div>
            </div>
            <div className="stat-icon-wrap"><Clock size={22} /></div>
          </div>

          {/* Out for Delivery */}
          <div className="stat-card">
            <div>
              <span className="stat-label">Out for Delivery</span>
              <div className="stat-value">{data?.outForDeliveryCount || 0}</div>
            </div>
            <div className="stat-icon-wrap"><Package size={22} /></div>
          </div>

          {/* Completed */}
          <div className="stat-card">
            <div>
              <span className="stat-label">Completed Today</span>
              <div className="stat-value">{data?.completedDeliveries || 0}</div>
            </div>
            <div className="stat-icon-wrap"><CheckCircle2 size={22} /></div>
          </div>
        </div>

        {/* Active Assigned Deliveries */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontWeight: 800, fontSize: '1.45rem' }}>
              Active Assigned Deliveries ({activeOrders.length})
            </h2>
            <Link to="/delivery/history" className="btn btn-outline btn-sm">
              View History
            </Link>
          </div>

          {activeOrders.length === 0 ? (
            <div className="card-soft" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
              <div
                style={{
                  width: '3.5rem',
                  height: '3.5rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-primary-15)',
                  color: 'var(--color-primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <CheckCircle2 size={28} />
              </div>
              <h3 style={{ fontWeight: 800, marginBottom: '0.35rem' }}>No deliveries assigned right now</h3>
              <p style={{ color: 'var(--color-text-muted)' }}>
                You're all caught up! New orders dispatched by Admin will appear here instantly.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {activeOrders.map((order) => {
                const isOut = order.status === 'OUT_FOR_DELIVERY';

                return (
                  <div key={order.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      {/* Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                          <strong style={{ fontSize: '1.15rem' }}>Order #NK{order.id}</strong>
                          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{order.slotName}</div>
                        </div>
                        <span className={`badge ${isOut ? 'badge-primary' : 'badge-soft'}`}>
                          {order.status}
                        </span>
                      </div>

                      {/* Customer & Address Details */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <strong style={{ fontSize: '1rem' }}>{order.customerName}</strong>
                          {order.customerPhone && (
                            <a
                              href={`tel:${order.customerPhone}`}
                              className="btn btn-outline btn-sm"
                              style={{ padding: '0.25rem 0.6rem', fontSize: '0.78rem' }}
                            >
                              <Phone size={13} /> Call {order.customerPhone}
                            </a>
                          )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>
                          <MapPin size={16} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{order.addressLine}, {order.city} - {order.pincode}</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                          <span><strong>{order.items?.length || 0} items</strong></span>
                          <span>Collect: <strong style={{ color: 'var(--color-primary)' }}>₹{order.totalAmount}</strong> ({order.paymentMethod})</span>
                        </div>

                        {order.notes && (
                          <p style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontStyle: 'italic' }}>
                            Note: "{order.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                      <Link to={`/delivery/orders/${order.id}`} className="btn btn-soft btn-sm" style={{ flex: 1 }}>
                        Details & Items
                      </Link>

                      {!isOut ? (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          style={{ flex: 1.2 }}
                          disabled={actionLoading}
                          onClick={() => handleUpdateStatus(order.id, 'OUT_FOR_DELIVERY')}
                        >
                          Out for Delivery
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          style={{ flex: 1.2 }}
                          disabled={actionLoading}
                          onClick={() => handleUpdateStatus(order.id, 'DELIVERED')}
                        >
                          Mark Delivered
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
