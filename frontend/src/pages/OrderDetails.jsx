import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Truck, ShieldCheck, Star, AlertTriangle } from 'lucide-react';
import { ordersAPI, productsAPI } from '../services/api';
import { OrderTimeline } from '../components/OrderTimeline';
import { useToast } from '../context/ToastContext';

export const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const { showToast } = useToast();

  // Review state
  const [reviewProductId, setReviewProductId] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchOrder();

    // Auto-refresh order status every 10 seconds if not cancelled or delivered
    const interval = setInterval(() => {
      fetchOrder(false); // pass silent=false to avoid loading overlay
    }, 10000);

    return () => clearInterval(interval);
  }, [id]);

  const fetchOrder = async (showLoading = true) => {
    try {
      if (showLoading && !order) setLoading(true);
      const res = await ordersAPI.getById(id);
      if (res.success) {
        setOrder(res.data);
      }
    } catch (err) {
      console.error('Failed to load order details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      setCancelling(true);
      const res = await ordersAPI.cancel(id);
      if (res.success) {
        setOrder(res.data);
        showToast('Order cancelled successfully');
      }
    } catch (err) {
      showToast(err.message || 'Could not cancel order', 'error');
    } finally {
      setCancelling(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewProductId) return;

    try {
      setSubmittingReview(true);
      const res = await productsAPI.addReview(reviewProductId, {
        orderId: order.id,
        rating: Number(rating),
        comment: comment.trim(),
      });
      if (res.success) {
        showToast('Thank you for rating your groceries! ⭐');
        setReviewProductId(null);
        setComment('');
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2>Order Not Found</h2>
        <Link to="/orders" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Orders</Link>
      </div>
    );
  }

  const canCancel = order.status === 'PLACED' || order.status === 'CONFIRMED' || order.status === 'PREPARING';
  const isDelivered = order.status === 'DELIVERED';

  return (
    <div className="container" style={{ padding: '2rem 1rem 4rem', maxWidth: '850px' }}>
      <Link to="/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem', color: 'var(--color-text-muted)' }}>
        <ArrowLeft size={16} /> Back to My Orders
      </Link>

      {/* Header Info */}
      <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Order ID</span>
            <h2 style={{ fontWeight: 900 }}>#NK{order.id}</h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Total Payable</span>
            <h2 style={{ fontWeight: 900, color: 'var(--color-primary)' }}>₹{order.totalAmount}</h2>
            <span className="badge badge-soft" style={{ marginTop: '0.25rem' }}>
              {order.paymentMethod} &bull; {order.paymentStatus}
            </span>
          </div>
        </div>

        {/* Dynamic Tracking Stepper */}
        <div style={{ marginTop: '1.5rem' }}>
          <OrderTimeline status={order.status} />
        </div>
      </div>

      {/* Assigned Delivery Partner Details */}
      {order.deliveryPersonName && (
        <div className="card-soft" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1.5px solid var(--color-primary-20)' }}>
          <div
            style={{
              width: '3rem',
              height: '3rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-text-inverse)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Truck size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h4 style={{ fontWeight: 800 }}>{order.deliveryPersonName}</h4>
              <span className="badge badge-primary">Assigned Partner</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
              Vehicle: {order.deliveryPersonVehicle || 'Electric Delivery Vehicle'}
              {order.deliveryPersonPhone && ` • Contact: ${order.deliveryPersonPhone}`}
            </p>
          </div>
        </div>
      )}

      {/* Delivery Slot & Address */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <MapPin size={18} color="var(--color-primary)" />
            <h4 style={{ fontWeight: 800, fontSize: '0.95rem' }}>Delivery Address</h4>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-main)', lineHeight: '1.4' }}>
            {order.addressLine}, {order.city}, {order.state} - {order.pincode}
          </p>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Clock size={18} color="var(--color-primary)" />
            <h4 style={{ fontWeight: 800, fontSize: '0.95rem' }}>Delivery Slot</h4>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-main)' }}>
            <strong>{order.slotName}</strong> ({order.slotTime})
          </p>
          {order.notes && (
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
              Notes: "{order.notes}"
            </p>
          )}
        </div>
      </div>

      {/* Ordered Items */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h4 style={{ fontWeight: 800, marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
          Ordered Items ({order.items?.length || 0})
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {order.items?.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid var(--color-border-subtle)',
              }}
            >
              <div>
                <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{item.productName}</span>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                  {item.quantity} &times; ₹{item.price}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <strong style={{ fontSize: '1rem' }}>₹{item.subtotal}</strong>

                {/* Review button if delivered */}
                {isDelivered && (
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.78rem', padding: '0.25rem 0.6rem' }}
                    onClick={() => setReviewProductId(item.productId)}
                  >
                    <Star size={12} /> Rate Item
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bill Breakdown */}
        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1.5px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Subtotal</span>
            <span>₹{order.subtotal}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Delivery Charge</span>
            <span>{Number(order.deliveryCharge) === 0 ? 'FREE' : `₹${order.deliveryCharge}`}</span>
          </div>
          {order.couponDiscount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-primary)' }}>
              <span>Coupon Discount ({order.couponCode})</span>
              <span>-₹{order.couponDiscount}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 900, marginTop: '0.5rem' }}>
            <span>Total Paid</span>
            <span style={{ color: 'var(--color-primary)' }}>₹{order.totalAmount}</span>
          </div>
        </div>
      </div>

      {/* Review Modal / Box if triggered */}
      {reviewProductId && (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', border: '2px solid var(--color-primary)' }}>
          <h4 style={{ fontWeight: 800, marginBottom: '0.75rem' }}>Rate & Review Item</h4>
          <form onSubmit={handleSubmitReview}>
            <div className="form-group">
              <label className="form-label">Rating (1 to 5 Stars)</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setRating(num)}
                    style={{
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      padding: '0.2rem',
                    }}
                  >
                    <Star
                      size={24}
                      fill={num <= rating ? 'var(--color-primary)' : 'none'}
                      color="var(--color-primary)"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Your Review / Comments</label>
              <textarea
                className="form-control"
                rows={2}
                placeholder="Share your experience about freshness and quality..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn btn-primary btn-sm" disabled={submittingReview}>
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
              <button type="button" onClick={() => setReviewProductId(null)} className="btn btn-soft btn-sm">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Cancel Order Action */}
      {canCancel && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            type="button"
            className="btn btn-soft btn-sm"
            onClick={handleCancelOrder}
            disabled={cancelling}
          >
            {cancelling ? 'Cancelling...' : 'Cancel This Order'}
          </button>
        </div>
      )}
    </div>
  );
};
