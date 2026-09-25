import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ChevronRight, Clock, Truck, CheckCircle2, AlertCircle, Download } from 'lucide-react';
import { ordersAPI } from '../services/api';
import { downloadReceipt } from '../utils/receiptGenerator';

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => (
            <div key={order.id} className="card" style={{ padding: '0' }}>
              {/* Card Header: Order ID & Status */}
              <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--color-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--color-text-main)' }}>
                      Order #NK{order.id}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-primary)', marginBottom: '0.2rem' }}>
                    ₹{order.totalAmount}
                  </div>
                  <span className="badge badge-soft" style={{ fontSize: '0.75rem' }}>
                    {order.paymentMethod} &bull; {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Card Body: Items & Driver */}
              <div style={{ padding: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                  
                  {/* Items List */}
                  <div>
                    <h4 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--color-text-main)' }}>Items ({order.items?.length || 0})</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {order.items?.map(item => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                          <span style={{ color: 'var(--color-text)' }}>{item.quantity}x {item.productName}</span>
                          <span style={{ fontWeight: 600 }}>₹{item.subtotal}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div>
                    <h4 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--color-text-main)' }}>Delivery Info</h4>
                    {order.deliveryPersonName ? (
                      <div className="card-soft" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', border: '1px solid var(--color-primary-20)' }}>
                        <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Truck size={18} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{order.deliveryPersonName}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.1rem' }}>
                            {order.deliveryPersonPhone ? `📞 ${order.deliveryPersonPhone}` : 'Delivery Agent Assigned'}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="card-soft" style={{ padding: '1rem', color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>
                        <Clock size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
                        Partner will be assigned soon.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer: Actions */}
              <div style={{ padding: '1rem 1.25rem', backgroundColor: 'var(--color-surface)', borderTop: '1px solid var(--color-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  Slot: <strong>{order.slotName}</strong> ({order.slotTime})
                </span>
                
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {order.status === 'DELIVERED' && (
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-primary)', borderColor: 'var(--color-primary-30)' }}
                      onClick={() => downloadReceipt(order)}
                    >
                      <Download size={14} /> Receipt
                    </button>
                  )}
                  <Link to={`/orders/${order.id}`} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>Track Order</span>
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
