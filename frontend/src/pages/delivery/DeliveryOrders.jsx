import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Truck, Phone, MapPin, ChevronRight, Clock, CheckCircle2 } from 'lucide-react';
import { deliveryAPI } from '../../services/api';
import { DeliveryNav } from '../../components/DeliveryNav';
import { useToast } from '../../context/ToastContext';

export const DeliveryOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await deliveryAPI.getOrders();
      if (res.success) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error('Failed to load assigned deliveries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, targetStatus) => {
    try {
      setActionLoading(true);
      const res = await deliveryAPI.updateStatus(orderId, targetStatus);
      if (res.success) {
        showToast(
          targetStatus === 'OUT_FOR_DELIVERY'
            ? 'Order status: OUT FOR DELIVERY'
            : 'Order DELIVERED successfully! 🌟'
        );
        fetchOrders();
      }
    } catch (err) {
      showToast(err.message || 'Update failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      <DeliveryNav />

      <main className="container" style={{ padding: '2rem 1rem 4rem', maxWidth: '850px' }}>
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{ fontWeight: 800, fontSize: '1.85rem' }}>Assigned Deliveries</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
            List of active grocery orders assigned for your route
          </p>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading assigned deliveries...</div>
        ) : orders.length === 0 ? (
          <div className="card-soft" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-text-muted)' }}>You have no deliveries assigned at this time.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {orders.map((order) => {
              const isOut = order.status === 'OUT_FOR_DELIVERY';
              const isDelivered = order.status === 'DELIVERED';

              return (
                <div key={order.id} className="card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <strong style={{ fontSize: '1.15rem' }}>Order #NK{order.id}</strong>
                        <span className={`badge ${isDelivered ? 'badge-primary' : isOut ? 'badge-primary' : 'badge-soft'}`}>
                          {order.status}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                        Slot: {order.slotName} ({order.slotTime})
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <strong style={{ fontSize: '1.15rem', color: 'var(--color-primary)' }}>₹{order.totalAmount}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        {order.paymentMethod} ({order.paymentStatus})
                      </div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="card-soft" style={{ padding: '1rem', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <strong style={{ fontSize: '0.95rem' }}>{order.customerName}</strong>
                      {order.customerPhone && (
                        <a href={`tel:${order.customerPhone}`} className="btn btn-outline btn-sm" style={{ padding: '0.2rem 0.6rem', fontSize: '0.8rem' }}>
                          <Phone size={13} /> {order.customerPhone}
                        </a>
                      )}
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-main)', lineHeight: '1.4' }}>
                      {order.addressLine}, {order.city} - {order.pincode}
                    </p>
                    {order.notes && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-primary)', marginTop: '0.35rem' }}>
                        Customer note: "{order.notes}"
                      </p>
                    )}
                  </div>

                  {/* Action row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <Link to={`/delivery/orders/${order.id}`} className="btn btn-soft btn-sm">
                      View Order Details <ChevronRight size={14} />
                    </Link>

                    {!isDelivered && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {!isOut ? (
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            disabled={actionLoading}
                            onClick={() => handleUpdateStatus(order.id, 'OUT_FOR_DELIVERY')}
                          >
                            Mark Out for Delivery
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            disabled={actionLoading}
                            onClick={() => handleUpdateStatus(order.id, 'DELIVERED')}
                          >
                            <CheckCircle2 size={14} /> Mark Delivered
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
