import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Plus, Minus, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const ProductCard = ({ product }) => {
  const { getItemQuantity, addToCart, updateQuantity } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!product) return null;

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
          onClick={() => toggleWishlist(product.id)}
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

        <Link to={`/products/${product.id}`}>
          <h4 className="product-name">{product.name}</h4>
        </Link>
        <p className="product-unit">{product.unit}</p>
      </div>

      {/* Pricing and Action */}
      <div>
        <div className="product-pricing">
          <span className="price-current">
            ₹{product.discountedPrice || product.price}
          </span>
          {hasDiscount && (
            <span className="price-original">
              ₹{product.price}
            </span>
          )}
        </div>

        <div className="product-card-footer">
          {isOutOfStock ? (
            <span className="badge" style={{ width: '100%', justifyContent: 'center', padding: '0.55rem 0' }}>
              Out of Stock
            </span>
          ) : qty > 0 ? (
            <div className="qty-control" style={{ width: '100%', justifyContent: 'space-between' }}>
              <button
                type="button"
                className="qty-btn"
                onClick={() => updateQuantity(product.id, qty - 1)}
              >
                <Minus size={14} />
              </button>
              <span className="qty-val">{qty}</span>
              <button
                type="button"
                className="qty-btn"
                onClick={() => updateQuantity(product.id, qty + 1)}
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              style={{ width: '100%' }}
              onClick={() => addToCart(product.id, 1)}
            >
              <Plus size={16} /> Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
