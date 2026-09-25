import React, { useState, useEffect } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { AdminSidebar } from '../../components/AdminSidebar';

export const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getReviews();
      if (res.success) {
        setReviews(res.data);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        size={14}
        fill={i < rating ? "var(--color-warning)" : "transparent"}
        color={i < rating ? "var(--color-warning)" : "var(--color-border)"}
      />
    ));
  };

  return (
    <div className="dashboard-layout">
      <AdminSidebar />

      <main className="main-content">
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontWeight: 800, fontSize: '1.85rem' }}>Customer Reviews</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
            Monitor and read customer product feedback
          </p>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              <MessageSquare size={40} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
              <p>No customer reviews have been submitted yet.</p>
            </div>
          ) : (
            <div className="custom-table-wrap">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Product</th>
                    <th>Customer</th>
                    <th>Rating</th>
                    <th>Review Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((rev) => (
                    <tr key={rev.id}>
                      <td style={{ whiteSpace: 'nowrap', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <strong style={{ fontSize: '0.9rem' }}>{rev.productName}</strong>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{rev.userName}</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.1rem' }}>
                          {renderStars(rev.rating)}
                        </div>
                      </td>
                      <td style={{ maxWidth: '300px' }}>
                        <p style={{ margin: 0, fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--color-text)' }}>
                          "{rev.comment}"
                        </p>
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
