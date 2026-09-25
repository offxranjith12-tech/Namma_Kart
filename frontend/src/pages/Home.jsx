import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Clock, Zap, Percent, ShoppingBag } from 'lucide-react';
import { productsAPI, categoriesAPI } from '../services/api';
import { ProductCard } from '../components/ProductCard';

export const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          categoriesAPI.getAll(),
          productsAPI.getAll(),
        ]);
        if (catRes.success) setCategories(catRes.data);
        if (prodRes.success) setProducts(prodRes.data);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const featuredProducts = products.slice(0, 8);
  const discountedProducts = products.filter((p) => p.discount && Number(p.discount) > 0).slice(0, 4);

  return (
    <div>
      {/* Category Subnav Bar */}
      <div className="category-subnav">
        <div className="container category-subnav-list">
          <Link to="/products" className="cat-chip active">All Products</Link>
          {categories.map((cat) => (
            <Link key={cat.id} to={`/products?category=${cat.id}`} className="cat-chip">
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-primary-15)',
                  color: 'var(--color-primary)',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  marginBottom: '1rem',
                }}
              >
                <Zap size={16} />
                <span>Superfast 30-Minute Neighborhood Delivery</span>
              </div>

              <h1 className="hero-title">
                Fresh Groceries & Daily Needs, <span>Delivered with Trust.</span>
              </h1>

              <p className="hero-desc">
                From farm-picked vegetables and fresh dairy to pantry staples, get authentic local quality at unbeatable everyday prices.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/products" className="btn btn-primary btn-lg">
                  Shop Now <ArrowRight size={18} />
                </Link>
                <Link to="/products?category=1" className="btn btn-soft btn-lg">
                  Explore Fresh Produce
                </Link>
              </div>

              <div className="hero-features">
                <div className="hero-feature-item">
                  <ShieldCheck size={16} color="var(--color-primary)" />
                  <span>100% Quality Checked</span>
                </div>
                <div className="hero-feature-item">
                  <Clock size={16} color="var(--color-primary)" />
                  <span>On-Time Guarantee</span>
                </div>
                <div className="hero-feature-item">
                  <Percent size={16} color="var(--color-primary)" />
                  <span>Zero Delivery over ₹500</span>
                </div>
              </div>
            </div>

            {/* Promo Highlights */}
            <div className="hero-card-grid">
              <div className="hero-promo-card">
                <div>
                  <span className="badge badge-soft" style={{ marginBottom: '0.5rem' }}>TODAY'S SPECIAL</span>
                  <h3 style={{ fontWeight: 800, color: 'var(--color-primary)' }}>Up to 50% OFF</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Use code WELCOME50 on first order</p>
                </div>
                <Link to="/products" style={{ fontSize: '0.88rem', fontWeight: 700 }}>Grab Deal &rarr;</Link>
              </div>

              <div className="hero-promo-card">
                <div>
                  <span className="badge badge-soft" style={{ marginBottom: '0.5rem' }}>FARM FRESH</span>
                  <h3 style={{ fontWeight: 800, color: 'var(--color-primary)' }}>Daily Harvest</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Direct from local Karnataka farms</p>
                </div>
                <Link to="/products?category=1" style={{ fontSize: '0.88rem', fontWeight: 700 }}>Explore &rarr;</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container" style={{ marginTop: '3.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h2>Shop by Category</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>Explore our handpicked selection of daily grocery essentials</p>
          </div>
          <Link to="/products" className="btn btn-outline btn-sm">
            View All Categories
          </Link>
        </div>

        <div className="grid grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              className="card"
              style={{
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <div style={{ height: '140px', backgroundColor: 'var(--color-surface)', overflow: 'hidden' }}>
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 240ms' }}
                />
              </div>
              <div style={{ padding: '1rem' }}>
                <h4 style={{ fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '0.25rem' }}>{cat.name}</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Today's Offers & Big Discounts */}
      {discountedProducts.length > 0 && (
        <section className="container" style={{ marginTop: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={24} color="var(--color-primary)" />
              <div>
                <h2>Today's Best Offers</h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>Special discounts and flash sale items for today</p>
              </div>
            </div>
            <Link to="/products" className="btn btn-outline btn-sm">
              See All Deals
            </Link>
          </div>

          <div className="grid grid-cols-4">
            {discountedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="container" style={{ marginTop: '4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h2>Popular in Your Neighborhood</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>Most loved items ordered by customers today</p>
          </div>
          <Link to="/products" className="btn btn-outline btn-sm">
            Browse All Items
          </Link>
        </div>

        <div className="grid grid-cols-4">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
};
