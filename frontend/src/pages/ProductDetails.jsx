import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Plus, Minus, Star, Truck, ShieldCheck, Clock, ArrowLeft } from 'lucide-react';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const { getItemQuantity, addToCart, updateQuantity } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const [prodRes, revRes] = await Promise.all([
          productsAPI.getById(id),
          productsAPI.getReviews(id),
        ]);
        if (prodRes.success) setProduct(prodRes.data);
        if (revRes.success) setReviews(revRes.data);
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) {
    return <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>Loading product details...</div>;
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Products</Link>
      </div>
    );
  }

  const qty = getItemQuantity(product.id);
  const isFav = isInWishlist(product.id);
  const hasDiscount = product.discount && Number(product.discount) > 0;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="container" style={{ padding: '2rem 1rem 4rem' }}>
      <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem', color: 'var(--color-text-muted)' }}>
        <ArrowLeft size={16} /> Back to Catalog
      </Link>

      {/* Main Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 450px) 1fr', gap: '3rem', alignItems: 'start' }}>
        {/* Left: Product Image */}
        <div className="card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}>
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{ maxWidth: '100%', maxHeight: '350px', objectFit: 'contain' }}
          />
        </div>

        {/* Right: Info & Purchase */}
        <div>
          <span className="badge badge-soft" style={{ marginBottom: '0.75rem' }}>
            {product.categoryName}
          </span>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>{product.name}</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>{product.unit}</p>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                backgroundColor: 'var(--color-primary)',
                color: '#FFFFFF',
                padding: '0.25rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              <Star size={14} fill="#FFFFFF" />
              <span>{Number(product.rating || 4.5).toFixed(1)}</span>
            </div>
            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              ({reviews.length} customer ratings)
            </span>
          </div>

          {/* Price Section */}
          <div style={{ padding: '1.25rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-primary)' }}>
                ₹{product.discountedPrice || product.price}
              </span>
              {hasDiscount && (
                <>
                  <span style={{ fontSize: '1.2rem', textDecoration: 'line-through', color: 'var(--color-text-subtle)' }}>
                    ₹{product.price}
                  </span>
                  <span className="badge badge-primary">{Math.round(product.discount)}% OFF</span>
                </>
              )}
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
              Inclusive of all taxes. Free delivery on orders above ₹500.
            </p>
          </div>

          {/* Stock Status */}
          <div style={{ marginBottom: '1.5rem' }}>
            {isOutOfStock ? (
              <span className="badge" style={{ padding: '0.4rem 0.8rem' }}>Out of Stock</span>
            ) : (
              <span className="badge badge-soft" style={{ padding: '0.4rem 0.8rem' }}>
                In Stock ({product.stock} units available)
              </span>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
            {isOutOfStock ? (
              <button type="button" className="btn btn-soft" disabled style={{ flex: 1 }}>
                Currently Unavailable
              </button>
            ) : qty > 0 ? (
              <div className="qty-control" style={{ padding: '0.25rem' }}>
                <button type="button" className="qty-btn" onClick={() => updateQuantity(product.id, qty - 1)}>
                  <Minus size={16} />
                </button>
                <span className="qty-val" style={{ fontSize: '1.1rem', minWidth: '2.5rem' }}>{qty}</span>
                <button type="button" className="qty-btn" onClick={() => updateQuantity(product.id, qty + 1)}>
                  <Plus size={16} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-primary btn-lg"
                style={{ flex: 1 }}
                onClick={() => addToCart(product.id, 1)}
              >
                <Plus size={18} /> Add to Cart
              </button>
            )}

            <button
              type="button"
              className={`btn btn-soft btn-lg ${isFav ? 'btn-primary' : ''}`}
              onClick={() => toggleWishlist(product.id)}
              title="Save to Wishlist"
            >
              <Heart size={20} fill={isFav ? '#FFFFFF' : 'none'} />
            </button>
          </div>

          {/* Highlights */}
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
              <Truck size={18} color="var(--color-primary)" />
              <span>Express delivery in 30 minutes</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
              <ShieldCheck size={18} color="var(--color-primary)" />
              <span>100% Quality checked fresh produce</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
              <Clock size={18} color="var(--color-primary)" />
              <span>Flexible delivery slot selection at checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Reviews */}
      <div style={{ marginTop: '3.5rem' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontWeight: 800, marginBottom: '1rem' }}>Product Description</h3>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}>
            {product.description || 'High quality fresh grocery item sourced and packed under strict hygiene conditions for your daily family needs.'}
          </p>

          <hr style={{ margin: '2rem 0', borderColor: 'var(--color-border)' }} />

          <h3 style={{ fontWeight: 800, marginBottom: '1.25rem' }}>Customer Reviews ({reviews.length})</h3>

          {reviews.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)' }}>No customer reviews yet. Be the first to order and review this item!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {reviews.map((rev) => (
                <div key={rev.id} className="card-soft" style={{ padding: '1rem 1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{rev.userName}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < rev.rating ? 'var(--color-primary)' : 'none'}
                          color="var(--color-primary)"
                        />
                      ))}
                    </div>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
