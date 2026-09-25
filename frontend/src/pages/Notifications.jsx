import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Check, ShoppingBag } from 'lucide-react';
import { notificationsAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

export const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationsAPI.getAll();
      if (res.success) {
        setNotifications(res.data);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem 4rem', maxWidth: '700px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.75rem' }}>
        <Bell size={24} color="var(--color-primary)" />
        <h1 style={{ fontWeight: 800, fontSize: '1.85rem' }}>Notifications</h1>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="card-soft" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-muted)' }}>No notifications yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {notifications.map((n) => (
            <div
              key={n.id}
              className="card"
              style={{
                padding: '1.25rem',
                backgroundColor: n.isRead ? 'var(--color-surface)' : 'var(--color-primary-10)',
                borderColor: n.isRead ? 'var(--color-border)' : 'var(--color-primary-30)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div>
                <p style={{ fontWeight: n.isRead ? 600 : 800, fontSize: '0.95rem', color: 'var(--color-text-main)', marginBottom: '0.35rem' }}>
                  {n.message}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  <span>
                    {new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {n.orderId && (
                    <Link to={`/orders/${n.orderId}`} style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                      View Order #NK{n.orderId} &rarr;
                    </Link>
                  )}
                </div>
              </div>

              {!n.isRead && (
                <button
                  type="button"
                  onClick={() => handleMarkAsRead(n.id)}
                  className="btn btn-soft btn-sm"
                  title="Mark as read"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  <Check size={14} /> Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
