import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { MapPin, Clock, CreditCard, CheckCircle2, Plus, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { addressesAPI, deliverySlotsAPI, ordersAPI } from '../services/api';

export const Checkout = () => {
  const { cart, refreshCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const initialCoupon = location.state?.appliedCouponCode || '';

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [deliverySlots, setDeliverySlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [notes, setNotes] = useState('');
  const [couponCode, setCouponCode] = useState(initialCoupon);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  // New Address Form toggle
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    addressLine: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560103',
    isDefault: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [addrRes, slotRes] = await Promise.all([
          addressesAPI.getAll(),
          deliverySlotsAPI.getAll(),
        ]);

        if (addrRes.success) {
          setAddresses(addrRes.data);
          const defaultAddr = addrRes.data.find((a) => a.isDefault) || addrRes.data[0];
          if (defaultAddr) setSelectedAddressId(defaultAddr.id);
        }

        if (slotRes.success) {
          setDeliverySlots(slotRes.data);
          if (slotRes.data.length > 0) setSelectedSlotId(slotRes.data[0].id);
        }
      } catch (err) {
        console.error('Failed to load checkout details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.addressLine || !newAddress.pincode) {
      showToast('Please fill all address fields', 'error');
      return;
    }

    try {
      const res = await addressesAPI.create(newAddress);
      if (res.success) {
        setAddresses((prev) => [...prev, res.data]);
        setSelectedAddressId(res.data.id);
        setShowNewAddress(false);
        setNewAddress({ addressLine: '', city: 'Bengaluru', state: 'Karnataka', pincode: '560103', isDefault: false });
        showToast('Address added successfully');
      }
    } catch (err) {
      showToast(err.message || 'Failed to save address', 'error');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      showToast('Please select or add a delivery address', 'error');
      return;
    }
    if (!selectedSlotId) {
      showToast('Please select a delivery time slot', 'error');
      return;
    }

    try {
      setPlacingOrder(true);
      const payload = {
        addressId: selectedAddressId,
        deliverySlotId: selectedSlotId,
        couponCode: couponCode || null,
        paymentMethod: paymentMethod,
        notes: notes.trim() || null,
      };

      const res = await ordersAPI.create(payload);
      if (res.success) {
        await refreshCart();
        showToast('Order placed successfully! 🎉');
        navigate(`/orders/${res.data.id}`);
      }
    } catch (err) {
      showToast(err.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>Loading checkout...</div>;
  }

  if (!cart || cart.items?.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem 4rem' }}>
      <Link to="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem', color: 'var(--color-text-muted)' }}>
        <ArrowLeft size={16} /> Back to Cart
      </Link>

      <h1 style={{ fontWeight: 800, fontSize: '1.85rem', marginBottom: '1.75rem' }}>Checkout & Delivery</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }}>
        {/* Left Column: Delivery Details & Payment */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* 1. Address Selection */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={20} color="var(--color-primary)" />
                <h3 style={{ fontWeight: 800, fontSize: '1.15rem' }}>1. Delivery Address</h3>
              </div>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setShowNewAddress(!showNewAddress)}
              >
                <Plus size={14} /> {showNewAddress ? 'Cancel' : 'Add New Address'}
              </button>
            </div>

            {showNewAddress && (
              <form onSubmit={handleCreateAddress} className="card-soft" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
                <h4 style={{ fontWeight: 800, marginBottom: '0.75rem' }}>Add New Address</h4>
                <div className="form-group">
                  <label className="form-label">House / Flat / Street Details</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Flat 402, Sunshine Apts, Koramangala"
                    value={newAddress.addressLine}
                    onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pincode</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-sm" style={{ marginTop: '0.5rem' }}>
                  Save & Use Address
                </button>
              </form>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddressId(addr.id)}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: selectedAddressId === addr.id ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    backgroundColor: selectedAddressId === addr.id ? 'var(--color-primary-10)' : 'var(--color-surface)',
                    cursor: 'pointer',
                    transition: 'all 160ms ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{addr.city}, {addr.pincode}</span>
                    {selectedAddressId === addr.id && <CheckCircle2 size={16} color="var(--color-primary)" />}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>
                    {addr.addressLine}, {addr.state}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Delivery Slot Selection */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Clock size={20} color="var(--color-primary)" />
              <h3 style={{ fontWeight: 800, fontSize: '1.15rem' }}>2. Delivery Time Slot</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              {deliverySlots.map((slot) => (
                <div
                  key={slot.id}
                  onClick={() => setSelectedSlotId(slot.id)}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: selectedSlotId === slot.id ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    backgroundColor: selectedSlotId === slot.id ? 'var(--color-primary-10)' : 'var(--color-surface)',
                    cursor: 'pointer',
                    transition: 'all 160ms ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.92rem' }}>{slot.slotName}</span>
                    {selectedSlotId === slot.id && <CheckCircle2 size={16} color="var(--color-primary)" />}
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                    {slot.startTime} - {slot.endTime}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <CreditCard size={20} color="var(--color-primary)" />
              <h3 style={{ fontWeight: 800, fontSize: '1.15rem' }}>3. Payment Option</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: paymentMethod === 'COD' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                  backgroundColor: paymentMethod === 'COD' ? 'var(--color-primary-10)' : 'var(--color-surface)',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  style={{ accentColor: 'var(--color-primary)' }}
                />
                <div>
                  <strong style={{ fontSize: '0.95rem' }}>Cash on Delivery (COD)</strong>
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Pay cash or scan QR when groceries arrive at your doorstep</p>
                </div>
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: paymentMethod === 'UPI' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                  backgroundColor: paymentMethod === 'UPI' ? 'var(--color-primary-10)' : 'var(--color-surface)',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="UPI"
                  checked={paymentMethod === 'UPI'}
                  onChange={() => setPaymentMethod('UPI')}
                  style={{ accentColor: 'var(--color-primary)' }}
                />
                <div>
                  <strong style={{ fontSize: '0.95rem' }}>Simulated Instant UPI (GPay / PhonePe / Paytm)</strong>
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Fast simulated 1-click UPI checkout</p>
                </div>
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: paymentMethod === 'CARD' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                  backgroundColor: paymentMethod === 'CARD' ? 'var(--color-primary-10)' : 'var(--color-surface)',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CARD"
                  checked={paymentMethod === 'CARD'}
                  onChange={() => setPaymentMethod('CARD')}
                  style={{ accentColor: 'var(--color-primary)' }}
                />
                <div>
                  <strong style={{ fontSize: '0.95rem' }}>Credit / Debit Card</strong>
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Simulated Visa / Mastercard / RuPay</p>
                </div>
              </label>
            </div>
          </div>

          {/* 4. Delivery Instructions / Notes */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 800, fontSize: '1.15rem', marginBottom: '0.75rem' }}>4. Order Notes / Delivery Instructions</h3>
            <textarea
              className="form-control"
              rows={2}
              placeholder="e.g. Leave with security, or ring bell twice..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Right Column: Order Review & Place Order CTA */}
        <div>
          <div className="card" style={{ padding: '1.5rem', position: 'sticky', top: '5.5rem' }}>
            <h4 style={{ fontWeight: 800, marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
              Order Items ({cart.totalItems})
            </h4>

            <div style={{ maxHeight: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem', paddingRight: '0.25rem' }}>
              {cart.items.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--color-text-main)', flex: 1, paddingRight: '0.5rem' }}>
                    {item.productName} <span style={{ color: 'var(--color-text-muted)' }}>&times; {item.quantity}</span>
                  </span>
                  <span style={{ fontWeight: 700 }}>₹{item.itemTotal}</span>
                </div>
              ))}
            </div>

            <hr style={{ borderColor: 'var(--color-border)', margin: '0.75rem 0' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Subtotal</span>
                <span>₹{cart.subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Delivery Charge</span>
                <span>{Number(cart.deliveryCharge) === 0 ? <strong style={{ color: 'var(--color-primary)' }}>FREE</strong> : `₹${cart.deliveryCharge}`}</span>
              </div>
              {couponCode && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-primary)' }}>
                  <span>Coupon Code</span>
                  <strong>{couponCode}</strong>
                </div>
              )}
              <hr style={{ borderColor: 'var(--color-border)', margin: '0.5rem 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 900 }}>
                <span>Total Amount</span>
                <span style={{ color: 'var(--color-primary)' }}>₹{cart.totalAmount}</span>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-glue btn-lg"
              style={{ width: '100%', marginTop: '1.5rem' }}
              onClick={handlePlaceOrder}
              disabled={placingOrder}
            >
              {placingOrder ? 'Confirming Order...' : 'Confirm & Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
