import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Phone, MapPin, Clock, ShoppingBag, CheckCircle2, Truck, AlertCircle } from 'lucide-react';
import { deliveryAPI } from '../../services/api';
import { DeliveryNav } from '../../components/DeliveryNav';
import { useToast } from '../../context/ToastContext';

export const DeliveryOrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await deliveryAPI.getOrderById(id);
      if (res.success) {
        setOrder(res.data);
      }
    } catch (err) {
      console.error('Failed to load delivery order:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    try {
      setActionLoading(true);
      const res = await deliveryAPI.acceptDelivery(order.id);
      if (res.success) {
        showToast('Delivery accepted! Order acknowledged for pickup.');
        fetchOrder();
      }
    } catch (err) {
      showToast(err.message || 'Action failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async (targetStatus) => {
    try {
      setActionLoading(true);
      const res = await deliveryAPI.updateStatus(order.id, targetStatus);
      if (res.success) {
        showToast(
          targetStatus === 'OUT_FOR_DELIVERY'
            ? 'Order status: OUT FOR DELIVERY 🛵'
            : 'Order DELIVERED successfully! 🌟'
        );
        fetchOrder();
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
          Loading delivery details...
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div>
        <DeliveryNav />
        <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
          <h2>Order Not Found</h2>
          <Link to="/delivery/orders" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Deliveries</Link>
        </div>
      </div>
    );
  }

  const isDelivered = order.status === 'DELIVERED';
  const isOut = order.status === 'OUT_FOR_DELIVERY';

  return (
    <div>
      <DeliveryNav />

      <main className="container" style={{ padding: '2rem 1rem 4rem', maxWidth: '750px' }}>
        <Link to="/delivery/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem', color: 'var(--color-text-muted)' }}>
          <ArrowLeft size={16} /> Back to Assigned Deliveries
        </Link>

        {/* Top Status Header */}
        <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Assigned Order</span>
              <h2 style={{ fontWeight: 900 }}>#NK{order.id}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
                <Clock size={15} color="var(--color-primary)" />
                <span style={{ fontSize: '0.88rem' }}><strong>{order.slotName}</strong> ({order.slotTime})</span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className={`badge ${isDelivered ? 'badge-primary' : isOut ? 'badge-primary' : 'badge-soft'}`} style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>
                {order.status}
              </span>
              <div style={{ marginTop: '0.5rem', fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-primary)' }}>
                ₹{order.totalAmount}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                {order.paymentMethod} ({order.paymentStatus})
              </div>
            </div>
          </div>
        </div>

        {/* Customer & Location Card */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h4 style={{ fontWeight: 800, marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
            Customer Delivery Contact
          </h4>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontWeight: 800 }}>{order.customerName}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{order.customerEmail}</p>
            </div>

            {order.customerPhone && (
              <a
                href={`tel:${order.customerPhone}`}
                className="btn btn-primary"
                style={{ padding: '0.6rem 1.1rem' }}
              >
                <Phone size={16} /> Call {order.customerPhone}
              </a>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', padding: '1rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}>
            <MapPin size={20} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ fontSize: '0.95rem' }}>Delivery Address</strong>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', marginTop: '0.2rem', lineHeight: '1.4' }}>
                {order.addressLine}, {order.city}, {order.state} - {order.pincode}
              </p>
            </div>
          </div>

          {order.notes && (
            <div style={{ marginTop: '1rem', padding: '0.85rem', backgroundColor: 'var(--color-primary-10)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-primary-20)' }}>
              <strong style={{ fontSize: '0.85rem', color: 'var(--color-primary)' }}>Customer Delivery Notes:</strong>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-main)', marginTop: '0.2rem' }}>
                "{order.notes}"
              </p>
            </div>
          )}
        </div>

        {/* Items to Deliver */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <h4 style={{ fontWeight: 800, marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
            Grocery Items to Deliver ({order.items?.length || 0})
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {order.items?.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.92rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ width: '1.75rem', height: '1.75rem', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-primary-15)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                    {item.quantity}
                  </span>
                  <div>
                    <strong>{item.productName}</strong>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{item.productUnit}</div>
                  </div>
                </div>
                <span>₹{item.subtotal}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sticky Action Footer */}
        {!isDelivered ? (
          <div className="card" style={{ padding: '1.25rem', backgroundColor: '#FFFFFF', border: '2px solid var(--color-primary)', display: 'flex', gap: '1rem' }}>
            {!isOut ? (
              <button
                type="button"
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
                disabled={actionLoading}
                onClick={() => handleUpdateStatus('OUT_FOR_DELIVERY')}
              >
                <Truck size={20} /> Mark Order Out for Delivery
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
                disabled={actionLoading}
                onClick={() => handleUpdateStatus('DELIVERED')}
              >
                <CheckCircle2 size={20} /> Confirm Delivery Completed
              </button>
            )}
          </div>
        ) : (
          <div className="card-soft" style={{ padding: '1.25rem', textAlign: 'center', color: 'var(--color-primary)', fontWeight: 800 }}>
            ✓ This order has been successfully delivered and completed!
          </div>
        )}
      </main>
    </div>
  );
};
