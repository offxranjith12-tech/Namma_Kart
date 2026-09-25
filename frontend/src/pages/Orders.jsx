import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ChevronRight, Clock, Truck, CheckCircle2, AlertCircle } from 'lucide-react';
import { ordersAPI } from '../services/api';

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await ordersAPI.getUserOrders();
        if (res.success) {
          setOrders(res.data);
        }
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DELIVERED':
        return <span className="badge badge-primary">Delivered</span>;
      case 'OUT_FOR_DELIVERY':
        return <span className="badge badge-soft">Out for Delivery</span>;
      case 'PREPARING':
        return <span className="badge badge-soft">Preparing</span>;
      case 'CONFIRMED':
        return <span className="badge badge-soft">Confirmed</span>;
      case 'PLACED':
        return <span className="badge">Placed</span>;
      case 'CANCELLED':
        return <span className="badge" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-primary-30)' }}>Cancelled</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem 4rem', maxWidth: '850px' }}>
      <h1 style={{ fontWeight: 800, fontSize: '1.85rem', marginBottom: '1.5rem' }}>My Orders</h1>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>Loading your orders...</div>
      ) : orders.length === 0 ? (
        <div className="card-soft" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
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
            <ShoppingBag size={28} />
          </div>
          <h3 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>No Orders Placed Yet</h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            When you place orders, you can track their live delivery progress here.
          </p>
          <Link to="/products" className="btn btn-primary">
            Explore Groceries
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="card"
              style={{
                padding: '1.25rem',
                textDecoration: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 900, fontSize: '1.05rem', color: 'var(--color-text-main)' }}>
                    Order #NK{order.id}
                  </span>
                  {getStatusBadge(order.status)}
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>

                <div style={{ fontSize: '0.88rem', color: 'var(--color-text-main)' }}>
                  <strong>{order.items?.length || 0} items</strong> &bull; Total: <strong style={{ color: 'var(--color-primary)' }}>₹{order.totalAmount}</strong>
                  {order.deliveryPersonName && (
                    <span style={{ marginLeft: '0.75rem', color: 'var(--color-text-muted)' }}>
                      &bull; Delivery Agent: {order.deliveryPersonName}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.9rem' }}>
                <span>Track Order</span>
                <ChevronRight size={18} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
