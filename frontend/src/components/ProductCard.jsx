import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Plus, Minus, Star, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

export const ProductCard = ({ product }) => {
  const { getItemQuantity, addToCart, updateQuantity } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);

  if (!product) return null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const card = e.currentTarget.closest('.product-card');
    const img = card ? card.querySelector('img') : null;
    const cartIcon = document.querySelector('.nav-btn[title="Cart"]') || document.querySelector('.mobile-nav-item[href="/cart"]');

    if (img && cartIcon) {
      const rect = img.getBoundingClientRect();
      const cartRect = cartIcon.getBoundingClientRect();
      
      const flyImg = document.createElement('img');
      flyImg.src = img.src;
      flyImg.className = 'flying-product';
      flyImg.style.top = `${rect.top}px`;
      flyImg.style.left = `${rect.left}px`;
      flyImg.style.width = `${rect.width}px`;
      flyImg.style.height = `${rect.height}px`;
      document.body.appendChild(flyImg);
      
      // Trigger animation
      requestAnimationFrame(() => {
        flyImg.style.top = `${cartRect.top + (cartRect.height/2) - 10}px`;
        flyImg.style.left = `${cartRect.left + (cartRect.width/2) - 10}px`;
        flyImg.style.width = '20px';
        flyImg.style.height = '20px';
        flyImg.style.opacity = '1';
        flyImg.style.transform = 'scale(0.5) rotate(15deg)';
      });
      
      setTimeout(() => {
        flyImg.remove();
        const badge = cartIcon.querySelector('.nav-badge-count') || cartIcon.querySelector('.mobile-cart-badge');
        if (badge) {
          badge.classList.remove('badge-pop');
          void badge.offsetWidth;
          badge.classList.add('badge-pop');
        }
      }, 400);
    }

    setIsAdding(true);
    addToCart(product.id, 1);
    
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
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
  const isOutOfStock = product.stock <= 0 || product.isExpired;
  
  // Use expiry discount if present, else normal discount
  const effectiveDiscount = product.isNearExpiry && product.expiryDiscountPercentage 
    ? product.expiryDiscountPercentage 
    : product.discount;
    
  const hasDiscount = effectiveDiscount && Number(effectiveDiscount) > 0;
  
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="product-card">
      {/* Image & Badges */}
      <div className="product-image-wrap">
        <Link to={`/products/${product.id}`} style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <img
            src={product.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60'}
            alt={product.name}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Link>

        {hasDiscount && (
          <span className="product-discount-badge" style={product.isNearExpiry ? { backgroundColor: '#ff4d4f' } : {}}>
            {product.isNearExpiry ? '🔥 ' : ''}{Math.round(effectiveDiscount)}% OFF
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
        <p className="product-unit" style={{ marginBottom: '0.2rem' }}>{product.unit}</p>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-primary-hover)', fontWeight: 600 }}>
          {product.stock} units available
        </p>

        {/* Quick Quantity Chips */}
        {!product.isExpired && product.minQuantity > 0 && product.unit && product.unit.match(/g|kg|L|ml/i) && (
          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.6rem', flexWrap: 'wrap' }}>
            {[1, 2, 4].map(multiplier => {
              const weightVal = product.minQuantity * multiplier;
              if (weightVal > (product.maxQuantity || 50)) return null;
              
              let label = `${weightVal}x ${product.unit}`;
              const unitMatch = product.unit.match(/^([\d.]+)\s*([a-zA-Z]+)$/);
              if (unitMatch) {
                const num = parseFloat(unitMatch[1]) * weightVal;
                let u = unitMatch[2].toLowerCase();
                if (u === 'g' && num >= 1000) { label = `${num/1000}kg`; }
                else if (u === 'ml' && num >= 1000) { label = `${num/1000}L`; }
                else { label = `${num}${u}`; }
              }

              return (
                <button 
                  key={multiplier} 
                  type="button" 
                  className="badge"
                  style={{ 
                    cursor: 'pointer', 
                    background: 'var(--color-primary-10)', 
                    color: 'var(--color-primary-dark)', 
                    border: '1px solid var(--color-border)',
                    padding: '0.3rem 0.6rem',
                    fontSize: '0.7rem'
                  }}
                  onClick={(e) => {
                     e.preventDefault();
                     if (weightVal <= (product.maxQuantity || product.stockQuantity || 50)) {
                       if (qty === 0) addToCart(product.id, weightVal);
                       else updateQuantity(product.id, weightVal);
                     } else {
                       alert(`Cannot add more. Limit is ${product.maxQuantity || product.stockQuantity}`);
                     }
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Pricing and Action */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: 'auto' }}>
        
        {/* Expiry Details */}
        {product.expiryDate && (
          <div style={{ padding: '0.5rem', backgroundColor: 'var(--color-bg-alt)', borderRadius: '8px', fontSize: '0.8rem', border: '1px solid var(--color-border)' }}>
            <div style={{ color: product.isExpired ? 'var(--color-danger)' : 'var(--color-text-main)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              ⚠️ Expires: {formatDate(product.expiryDate)}
            </div>
            {product.daysRemaining !== null && !product.isExpired && (
              <div style={{ color: product.isNearExpiry ? '#e67e22' : 'var(--color-text-muted)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                ⏳ {product.daysRemaining} days remaining
              </div>
            )}
            {product.isExpired && (
              <div style={{ color: 'var(--color-danger)', marginTop: '0.2rem' }}>
                Product Unavailable
              </div>
            )}
          </div>
        )}

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
            <span className="badge" style={{ width: '100%', justifyContent: 'center', padding: '0.55rem 0', backgroundColor: product.isExpired ? 'var(--color-danger)' : undefined, color: product.isExpired ? 'white' : undefined }}>
              {product.isExpired ? 'Expired' : 'Out of Stock'}
            </span>
          ) : qty > 0 ? (
            <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
              <div className="qty-control" style={{ flex: 1, justifyContent: 'space-between', padding: '0.1rem 0' }}>
                <button type="button" className="qty-btn" onClick={(e) => { e.preventDefault(); updateQuantity(product.id, qty - (product.minQuantity || 1)); }}>
                  <Minus size={14} />
                </button>
                <span className="qty-val">{qty}</span>
                <button type="button" className="qty-btn" onClick={(e) => { 
                  e.preventDefault(); 
                  const nextQty = qty + (product.minQuantity || 1);
                  if (nextQty <= (product.maxQuantity || product.stockQuantity || 50)) {
                    updateQuantity(product.id, nextQty);
                  } else {
                    alert(`Cannot add more. Limit is ${product.maxQuantity || product.stockQuantity}`);
                  }
                }}>
                  <Plus size={14} />
                </button>
              </div>
              <button type="button" className="btn btn-primary btn-glue btn-sm" style={{ flex: 1, padding: '0' }} onClick={handleBuyNow}>
                Buy Now
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
              <button type="button" className="btn btn-outline btn-sm" style={{ flex: 1, padding: '0.45rem 0' }} onClick={(e) => handleAddToCart(e)} disabled={isAdding}>
                {isAdding ? <Check size={16} /> : 'Add'}
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
