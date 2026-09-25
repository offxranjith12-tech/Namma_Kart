import React, { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';
import { ProductCard } from '../components/ProductCard';

export const NearExpiryDeals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productsAPI.getAll();
      if (res.success) {
        // Only keep near expiry products that are not expired
        const nearExpiry = res.data.filter(p => p.isNearExpiry && !p.isExpired);
        setProducts(nearExpiry);
      }
    } catch (error) {
      console.error('Failed to fetch near expiry deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredProducts = () => {
    if (filter === 'TODAY') {
      return products.filter(p => p.daysRemaining === 0);
    }
    if (filter === 'TOMORROW') {
      return products.filter(p => p.daysRemaining === 1);
    }
    if (filter === '2_TO_3') {
      return products.filter(p => p.daysRemaining >= 2 && p.daysRemaining <= 3);
    }
    if (filter === 'HIGHEST_DISCOUNT') {
      return [...products].sort((a, b) => b.discount - a.discount);
    }
    return products; // ALL
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className="page-layout">
      <main className="container" style={{ padding: '2rem 1rem' }}>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontWeight: 800, fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>
            🔥 Near-Expiry Deals
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
            Help reduce food waste and save big with massive discounts on items nearing their best-before dates.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          <button 
            className={`btn ${filter === 'ALL' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter('ALL')}
            style={{ borderRadius: '20px' }}
          >
            All Deals
          </button>
          <button 
            className={`btn ${filter === 'TODAY' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter('TODAY')}
            style={{ borderRadius: '20px' }}
          >
            Expiring Today
          </button>
          <button 
            className={`btn ${filter === 'TOMORROW' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter('TOMORROW')}
            style={{ borderRadius: '20px' }}
          >
            Expires Tomorrow
          </button>
          <button 
            className={`btn ${filter === '2_TO_3' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter('2_TO_3')}
            style={{ borderRadius: '20px', whiteSpace: 'nowrap' }}
          >
            Expires in 2-3 Days
          </button>
          <button 
            className={`btn ${filter === 'HIGHEST_DISCOUNT' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter('HIGHEST_DISCOUNT')}
            style={{ borderRadius: '20px', whiteSpace: 'nowrap' }}
          >
            Highest Discount
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>Loading deals...</div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
            <h3 style={{ marginBottom: '1rem' }}>No deals found</h3>
            <p>Check back later for more near-expiry deals!</p>
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
