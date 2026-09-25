import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { couponsAPI } from '../services/api';

export const Cart = () => {
  const { cart, updateQuantity, removeItem, clearCart, loading } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    try {
      setValidatingCoupon(true);
      const res = await couponsAPI.validate(couponCode.trim(), cart.subtotal);
      if (res.success) {
        setAppliedCoupon(res.data);
        showToast(`Coupon '${res.data.code}' applied successfully! Saved ₹${res.data.calculatedDiscount}`);
      }
    } catch (err) {
      showToast(err.message || 'Invalid coupon code', 'error');
      setAppliedCoupon(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    showToast('Coupon removed');
  };

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="container" style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
        <div className="card-soft" style={{ maxWidth: '440px', width: '100%', padding: '3rem 2rem', textAlign: 'center' }}>
          <div
            style={{
              width: '4rem',
              height: '4rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-primary-15)',
              color: 'var(--color-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
            }}
          >
            <ShoppingBag size={32} />
          </div>
          <h2 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Your Cart is Empty</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Looks like you haven't added fresh groceries yet. Explore our wide range of daily essentials!
          </p>
          <Link to="/products" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  const couponDiscount = appliedCoupon?.calculatedDiscount || 0;
  const finalPayable = Math.max(0, Number(cart.totalAmount) - Number(couponDiscount));

  return (
    <div className="container" style={{ padding: '2rem 1rem 4rem' }}>
      <h1 style={{ fontWeight: 800, fontSize: '1.85rem', marginBottom: '1.75rem' }}>
        Shopping Cart ({cart.totalItems} items)
      </h1>

      <div className="checkout-layout">
        {/* Left: Cart Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="card"
              style={{
                padding: '1.25rem',
                display: 'grid',
                gridTemplateColumns: '80px 1fr auto auto',
                gap: '1.25rem',
                alignItems: 'center',
              }}
            >
              {/* Product Image */}
              <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              </div>

              {/* Product Info */}
              <div>
                <h4 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '0.2rem' }}>
                  {item.productName}
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>
                  {item.productUnit}
                </p>
                {item.expiryDate && (
                  <div style={{ fontSize: '0.75rem', color: item.daysRemaining < 0 ? 'var(--color-danger)' : (item.isNearExpiry ? '#e67e22' : 'var(--color-text-muted)'), marginBottom: '0.35rem', fontWeight: 600 }}>
                    {item.daysRemaining < 0 ? '⚠️ Expired' : `⚠️ Expires: ${new Date(item.expiryDate).toLocaleDateString('en-GB')} (${item.daysRemaining} days)`}
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 800, color: 'var(--color-primary)' }}>
                    ₹{item.effectivePrice}
                  </span>
                  {item.discount > 0 && (
                    <span style={{ fontSize: '0.8rem', textDecoration: 'line-through', color: 'var(--color-text-subtle)' }}>
                      ₹{item.price}
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="qty-control">
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                >
                  <Minus size={14} />
                </button>
                <span className="qty-val">{item.quantity}</span>
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Item Total & Remove */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--color-text-main)', marginBottom: '0.4rem' }}>
                  ₹{item.itemTotal}
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  className="btn btn-soft btn-sm"
                  style={{ padding: '0.25rem 0.6rem', color: 'var(--color-primary)' }}
                  title="Remove from cart"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
            <Link to="/products" className="btn btn-outline btn-sm">
              &larr; Continue Shopping
            </Link>
            <button type="button" onClick={clearCart} className="btn btn-soft btn-sm">
              Clear Cart
            </button>
          </div>
        </div>

        {/* Right: Order Summary & Checkout */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Coupon Box */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Tag size={18} color="var(--color-primary)" />
              <h4 style={{ fontWeight: 800, fontSize: '0.95rem' }}>Apply Promo Coupon</h4>
            </div>

            {appliedCoupon ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 1rem', backgroundColor: 'var(--color-primary-10)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-primary-20)' }}>
                <div>
                  <span style={{ fontWeight: 800, color: 'var(--color-primary)' }}>{appliedCoupon.code}</span>
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>-₹{appliedCoupon.calculatedDiscount} saved</p>
                </div>
                <button type="button" onClick={handleRemoveCoupon} className="btn btn-soft btn-sm" style={{ padding: '0.2rem 0.6rem' }}>
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. WELCOME50"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  style={{ textTransform: 'uppercase', fontSize: '0.88rem' }}
                />
                <button type="submit" className="btn btn-primary btn-sm" disabled={validatingCoupon || !couponCode.trim()}>
                  {validatingCoupon ? 'Checking...' : 'Apply'}
                </button>
              </form>
            )}
          </div>

          {/* Bill Summary */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h4 style={{ fontWeight: 800, marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
              Order Bill Summary
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.92rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Items Subtotal</span>
                <span style={{ fontWeight: 700 }}>₹{cart.subtotal}</span>
              </div>

              {cart.savings > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-primary)' }}>
                  <span>Product Savings</span>
                  <span style={{ fontWeight: 700 }}>-₹{cart.savings}</span>
                </div>
              )}

              {appliedCoupon && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-primary)' }}>
                  <span>Coupon Discount ({appliedCoupon.code})</span>
                  <span style={{ fontWeight: 700 }}>-₹{appliedCoupon.calculatedDiscount}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Delivery Charge</span>
                <span>
                  {Number(cart.deliveryCharge) === 0 ? (
                    <strong style={{ color: 'var(--color-primary)' }}>FREE</strong>
                  ) : (
                    <strong>₹{cart.deliveryCharge}</strong>
                  )}
                </span>
              </div>

              {Number(cart.deliveryCharge) > 0 && (
                <p style={{ fontSize: '0.78rem', color: 'var(--color-primary)' }}>
                  Add ₹{(500 - Number(cart.subtotal)).toFixed(2)} more for FREE Delivery!
                </p>
              )}

              <hr style={{ borderColor: 'var(--color-border)', margin: '0.5rem 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 900 }}>
                <span>To Pay</span>
                <span style={{ color: 'var(--color-primary)' }}>₹{finalPayable.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-glue btn-lg"
              style={{ width: '100%', marginTop: '1.5rem' }}
              onClick={() => navigate('/checkout', { state: { appliedCouponCode: appliedCoupon?.code } })}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
