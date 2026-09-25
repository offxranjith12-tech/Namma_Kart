import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, Clock, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <>
      {/* Trust Badges Section - Separated with White Background */}
      <section
        style={{
          backgroundColor: '#FFFFFF',
          borderTop: '1.5px solid var(--color-border)',
          borderBottom: '1.5px solid var(--color-border)',
          marginTop: '4rem',
          padding: '2.5rem 0',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-primary-15)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Truck size={24} />
              </div>
              <div>
                <h5 style={{ fontWeight: 800 }}>Fast Delivery</h5>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Under 30 mins to your doorstep</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-primary-15)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ShieldCheck size={24} />
              </div>
              <div>
                <h5 style={{ fontWeight: 800 }}>100% Quality Assured</h5>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Farm fresh & hygienically packed</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-primary-15)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles size={24} />
              </div>
              <div>
                <h5 style={{ fontWeight: 800 }}>Best Neighborhood Prices</h5>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Unbeatable daily offers & discounts</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-primary-15)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Clock size={24} />
              </div>
              <div>
                <h5 style={{ fontWeight: 800 }}>Flexible Delivery Slots</h5>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Early morning to late evening</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer
        style={{
          backgroundColor: 'var(--color-surface)',
          padding: '3.5rem 0 2rem',
        }}
      >
        <div className="container">
          {/* Footer Navigation Columns */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '2rem',
              paddingBottom: '2.5rem',
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: '2rem',
                    height: '2rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                  }}
                >
                  <ShoppingBag size={16} />
                </div>
                <h4 style={{ fontWeight: 900, color: 'var(--color-primary)' }}>Namma Kart</h4>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                Your beloved neighborhood online grocery store delivering fresh produce, dairy, bakery, and daily staples with love.
              </p>
            </div>

            <div>
              <h5 style={{ marginBottom: '1rem', fontWeight: 800 }}>Categories</h5>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                <li><Link to="/products?category=1" style={{ color: 'var(--color-text-muted)' }}>Fruits & Vegetables</Link></li>
                <li><Link to="/products?category=2" style={{ color: 'var(--color-text-muted)' }}>Dairy, Bread & Eggs</Link></li>
                <li><Link to="/products?category=8" style={{ color: 'var(--color-text-muted)' }}>Atta, Rice & Dal</Link></li>
                <li><Link to="/products?category=3" style={{ color: 'var(--color-text-muted)' }}>Snacks & Munchies</Link></li>
              </ul>
            </div>

            <div>
              <h5 style={{ marginBottom: '1rem', fontWeight: 800 }}>Quick Links</h5>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                <li><Link to="/products" style={{ color: 'var(--color-text-muted)' }}>All Products</Link></li>
                <li><Link to="/orders" style={{ color: 'var(--color-text-muted)' }}>Track Orders</Link></li>
                <li><Link to="/wishlist" style={{ color: 'var(--color-text-muted)' }}>Wishlist</Link></li>
                <li><Link to="/profile" style={{ color: 'var(--color-text-muted)' }}>My Profile</Link></li>
              </ul>
            </div>

            <div>
              <h5 style={{ marginBottom: '1rem', fontWeight: 800 }}>Demo Portals</h5>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                <li><Link to="/admin" style={{ color: 'var(--color-text-muted)' }}>Admin Dashboard</Link></li>
                <li><Link to="/delivery" style={{ color: 'var(--color-text-muted)' }}>Delivery Partner Portal</Link></li>
                <li><Link to="/login" style={{ color: 'var(--color-text-muted)' }}>Login / Switch Role</Link></li>
              </ul>
            </div>
          </div>

          <div style={{ paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-subtle)' }}>
            &copy; {new Date().getFullYear()} Namma Kart Inc. Built for 24-Hour Hackathon. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
};
