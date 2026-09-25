import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { History, CheckCircle2, ChevronRight, Calendar } from 'lucide-react';
import { deliveryAPI } from '../../services/api';
import { DeliverySidebar } from '../../components/DeliverySidebar';

export const DeliveryHistory = () => {
  const [history, setHistory] = useState([]);
  const [period, setPeriod] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [period]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await deliveryAPI.getHistory(period);
      if (res.success) {
        setHistory(res.data);
      }
    } catch (err) {
      console.error('Failed to load delivery history:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <DeliverySidebar />

      <main className="main-content" style={{ padding: '2rem', maxWidth: '850px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: '1.85rem' }}>Delivery History</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
              Record of your successfully completed grocery deliveries
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className={`btn btn-sm ${period === 'today' ? 'btn-primary' : 'btn-soft'}`}
              onClick={() => setPeriod('today')}
            >
              Today
            </button>
            <button
              type="button"
              className={`btn btn-sm ${period === 'week' ? 'btn-primary' : 'btn-soft'}`}
              onClick={() => setPeriod('week')}
            >
              This Week
            </button>
            <button
              type="button"
              className={`btn btn-sm ${period === 'all' ? 'btn-primary' : 'btn-soft'}`}
              onClick={() => setPeriod('all')}
            >
              All Time
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading history...</div>
        ) : history.length === 0 ? (
          <div className="card-soft" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-text-muted)' }}>No completed deliveries found for this period.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {history.map((order) => (
              <div
                key={order.id}
                className="card"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                    <strong style={{ fontSize: '1.05rem' }}>Order #NK{order.id}</strong>
                    <span className="badge badge-primary">Delivered</span>
                  </div>

                  <p style={{ fontSize: '0.88rem', color: 'var(--color-text-main)', marginBottom: '0.25rem' }}>
                    Customer: <strong>{order.customerName}</strong> &bull; {order.city}
                  </p>

                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    Delivered on: {order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Completed'}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <strong style={{ fontSize: '1.15rem', color: 'var(--color-primary)' }}>₹{order.totalAmount}</strong>
                  <div style={{ marginTop: '0.4rem' }}>
                    <Link to={`/delivery/orders/${order.id}`} className="btn btn-soft btn-sm">
                      Details <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
