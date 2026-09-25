import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, Plus, Minus, Star, Truck, ShieldCheck, Clock, ArrowLeft, ShoppingCart, Sprout, MapPin, ShieldX } from 'lucide-react';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

export const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const { getItemQuantity, addToCart, updateQuantity } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    addToCart(product.id, 1);
  };

  const handleBuyNow = () => {
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
    <div className="container" style={{ padding: '2rem 1rem 4rem', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Breadcrumb */}
      <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <Link to="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Home</Link>
        <span>&gt;</span>
        <span>{product.categoryName}</span>
        <span>&gt;</span>
        <span style={{ color: 'var(--color-text)' }}>{product.name}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
        {/* Left: Images */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ 
            backgroundColor: '#FFF1F0', 
            borderRadius: '24px', 
            padding: '2rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            position: 'relative',
            height: '350px'
          }}>
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }}
            />
            {hasDiscount && (
              <span className="badge badge-primary" style={{ position: 'absolute', top: '1rem', left: '1rem', fontSize: '0.8rem' }}>
                {Math.round(product.discount)}% OFF
              </span>
            )}
          </div>
          
        </div>

        {/* Right: Info */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem', lineHeight: '1.2' }}>{product.name}</h1>
            <button
              onClick={() => toggleWishlist(product.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}
            >
              <Heart size={24} fill={isFav ? 'var(--color-primary)' : 'none'} color={isFav ? 'var(--color-primary)' : 'var(--color-text-muted)'} />
            </button>
          </div>
          
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
            {product.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800 }}>₹{product.discountedPrice || product.price}</span>
            {hasDiscount && (
              <>
                <span style={{ fontSize: '1.1rem', textDecoration: 'line-through', color: 'var(--color-text-subtle)' }}>₹{product.price}</span>
                <span style={{ backgroundColor: '#D4F5E4', color: 'var(--color-primary)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 700 }}>
                  {Math.round(product.discount)}% OFF
                </span>
              </>
            )}
            <span style={{ fontSize: '1.1rem', color: 'var(--color-text)' }}>/{product.unit}</span>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.95rem' }}>Unit</p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {(product.minQuantity > 0 && product.unit && product.unit.match(/g|kg|L|ml/i)) ? (
                [1, 2, 4].map(multiplier => {
                  const weightVal = product.minQuantity * multiplier;
                  if (weightVal > (product.maxQuantity || 50)) return null;
                  
                  let label = `${weightVal}x ${product.unit}`;
                  const unitMatch = product.unit.match(/^([\d.]+)\s*([a-zA-Z]+)$/);
                  if (unitMatch) {
                    const num = parseFloat(unitMatch[1]) * weightVal;
                    let u = unitMatch[2].toLowerCase();
                    if (u === 'g' && num >= 1000) { label = `${num/1000} kg`; }
                    else if (u === 'ml' && num >= 1000) { label = `${num/1000} L`; }
                    else { label = `${num} ${u}`; }
                  }

                  const isSelected = qty === weightVal;
                  return (
                    <div 
                      key={multiplier}
                      onClick={() => {
                        if (qty === 0) {
                          addToCart(product.id, weightVal);
                        } else {
                          updateQuantity(product.id, weightVal);
                        }
                      }}
                      style={{ 
                        backgroundColor: isSelected ? 'var(--color-primary)' : 'var(--color-surface)', 
                        color: isSelected ? 'white' : 'var(--color-text)', 
                        padding: '0.5rem 1.5rem', 
                        borderRadius: '999px', 
                        fontWeight: 700, 
                        fontSize: '0.95rem', 
                        cursor: 'pointer' 
                      }}>
                      {label}
                    </div>
                  );
                })
              ) : (
                <div style={{ 
                  backgroundColor: 'var(--color-primary)', color: 'white', padding: '0.5rem 1.5rem', 
                  borderRadius: '999px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' 
                }}>
                  {product.unit}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
            {/* Qty pill */}
            <div style={{ 
              display: 'flex', alignItems: 'center', backgroundColor: 'var(--color-surface)', 
              borderRadius: '999px', padding: '0.3rem 0.5rem'
            }}>
              <button 
                onClick={() => {
                  if (qty > 0) {
                    updateQuantity(product.id, qty - (product.minQuantity || 1));
                  }
                }}
                disabled={qty === 0}
                style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', backgroundColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: qty > 0 ? 'pointer' : 'not-allowed', color: qty > 0 ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
              >
                <Minus size={18} />
              </button>
              <span style={{ width: '40px', textAlign: 'center', fontWeight: 700, fontSize: '1.1rem' }}>
                {qty > 0 ? qty : 0}
              </span>
              <button 
                onClick={() => {
                  if (qty === 0) {
                    addToCart(product.id, product.minQuantity || 1);
                  } else {
                    const nextQty = qty + (product.minQuantity || 1);
                    if (nextQty <= (product.maxQuantity || product.stockQuantity || 50)) {
                      updateQuantity(product.id, nextQty);
                    } else {
                      showToast(`Cannot add more. Limit is ${product.maxQuantity || product.stockQuantity}`);
                    }
                  }
                }}
                style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', backgroundColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-primary)' }}
              >
                <Plus size={18} />
              </button>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary)' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }}></div>
              In Stock
            </div>
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            onClick={qty === 0 ? handleAddToCart : () => navigate('/cart')}
          >
            <ShoppingCart size={20} /> {qty > 0 ? 'Go to Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Features Row */}
      <div style={{ 
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', 
        backgroundColor: 'var(--color-surface)', borderRadius: '24px', padding: '2rem 1rem',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <Sprout size={32} color="var(--color-primary)" strokeWidth={1.5} />
          <span style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: '0.9rem' }}>Fresh Quality</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <MapPin size={32} color="var(--color-primary)" strokeWidth={1.5} />
          <span style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: '0.9rem' }}>Locally Sourced</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldX size={32} color="var(--color-primary)" strokeWidth={1.5} />
          <span style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: '0.9rem' }}>No Chemicals</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <Heart size={32} color="var(--color-primary)" strokeWidth={1.5} />
          <span style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: '0.9rem' }}>Healthy Choice</span>
        </div>
      </div>

    </div>
  );
};
