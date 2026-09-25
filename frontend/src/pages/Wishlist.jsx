import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/ProductCard';

export const Wishlist = () => {
  const { wishlist, loading } = useWishlist();

  return (
    <div className="container" style={{ padding: '2rem 1rem 4rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.75rem' }}>
        <Heart size={24} color="var(--color-primary)" fill="var(--color-primary)" />
        <h1 style={{ fontWeight: 800, fontSize: '1.85rem' }}>My Wishlist ({wishlist.length})</h1>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading wishlist...</div>
      ) : wishlist.length === 0 ? (
        <div className="card-soft" style={{ padding: '3rem 2rem', textAlign: 'center', maxWidth: '440px', margin: '2rem auto' }}>
          <div
            style={{
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-primary-15)',
              color: 'var(--color-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <Heart size={28} />
          </div>
          <h3 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Your Wishlist is Empty</h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            Tap the heart on any product to save it to your favorites for quick re-ordering.
          </p>
          <Link to="/products" className="btn btn-primary">
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-4">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
