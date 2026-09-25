import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Plus, Minus, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

export const ProductCard = ({ product }) => {
  const { getItemQuantity, addToCart, updateQuantity } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!product) return null;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    addToCart(product.id, 1);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (product.stock <= 0) return;
    
    if (getItemQuantity(product.id) === 0) {
      addToCart(product.id, 1);
    }
    navigate('/checkout');
  };

  const qty = getItemQuantity(product.id);
  const isFav = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const hasDiscount = product.discount && Number(product.discount) > 0;

  return (
    <div className="product-card">
      {/* Image & Badges */}
      <div className="product-image-wrap">
        <Link to={`/products/${product.id}`} style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={product.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60'}
            alt={product.name}
            loading="lazy"
          />
        </Link>

        {hasDiscount && (
          <span className="product-discount-badge">
            {Math.round(product.discount)}% OFF
          </span>
        )}

        <button
          type="button"
          onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
          className={`product-wishlist-btn ${isFav ? 'active' : ''}`}
          title={isFav ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={16} fill={isFav ? 'var(--color-primary)' : 'none'} />
        </button>
      </div>

      {/* Product Information */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {product.categoryName || 'Grocery'}
          </span>
          {product.rating && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
              <Star size={13} fill="var(--color-primary)" color="var(--color-primary)" />
              <span>{Number(product.rating).toFixed(1)}</span>
            </div>
          )}
        </div>

        <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
          <h4 className="product-name">{product.name}</h4>
        </Link>
        <p className="product-unit">{product.unit}</p>
      </div>

      {/* Pricing and Action */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: 'auto' }}>
        <div className="product-pricing" style={{ marginBottom: 0 }}>
          <span className="price-current">
            ₹{product.discountedPrice || product.price}
          </span>
          {hasDiscount && (
            <span className="price-original">
              ₹{product.price}
            </span>
          )}
        </div>

        <div className="product-card-footer" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {isOutOfStock ? (
            <span className="badge" style={{ width: '100%', justifyContent: 'center', padding: '0.55rem 0' }}>
              Out of Stock
            </span>
          ) : qty > 0 ? (
            <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
              <div className="qty-control" style={{ flex: 1, justifyContent: 'space-between', padding: '0.1rem 0' }}>
                <button type="button" className="qty-btn" onClick={(e) => { e.preventDefault(); updateQuantity(product.id, qty - 1); }}>
                  <Minus size={14} />
                </button>
                <span className="qty-val">{qty}</span>
                <button type="button" className="qty-btn" onClick={(e) => { e.preventDefault(); updateQuantity(product.id, qty + 1); }}>
                  <Plus size={14} />
                </button>
              </div>
              <button type="button" className="btn btn-primary btn-glue btn-sm" style={{ flex: 1, padding: '0' }} onClick={handleBuyNow}>
                Buy Now
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
              <button type="button" className="btn btn-outline btn-sm" style={{ flex: 1, padding: '0.45rem 0' }} onClick={(e) => { e.preventDefault(); handleAddToCart(); }}>
                Add
              </button>
              <button type="button" className="btn btn-primary btn-glue btn-sm" style={{ flex: 1, padding: '0.45rem 0' }} onClick={handleBuyNow}>
                Buy Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
