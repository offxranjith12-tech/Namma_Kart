import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, Bell, User as UserIcon, Search, LogOut, LayoutDashboard, Truck, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { notificationsAPI } from '../services/api';

export const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin, isDeliveryPerson } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      notificationsAPI.getAll().then((res) => {
        if (res.success && res.data) {
          const unread = res.data.filter((n) => !n.isRead).length;
          setUnreadCount(unread);
        }
      }).catch(() => {});
    }
  }, [isAuthenticated, location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        {/* Brand */}
        <Link to="/" className="nav-brand">
          <div
            style={{
              width: '2.4rem',
              height: '2.4rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
            }}
          >
            <ShoppingBag size={20} strokeWidth={2.5} />
          </div>
          <span>Namma Kart</span>
          {isAdmin && <span className="nav-brand-tag">ADMIN</span>}
          {isDeliveryPerson && <span className="nav-brand-tag">DELIVERY PARTNER</span>}
        </Link>

        {/* Global Search Bar (primarily on customer view) */}
        {!isAdmin && !isDeliveryPerson && (
          <form onSubmit={handleSearch} className="nav-search">
            <Search size={18} className="nav-search-icon" />
            <input
              type="text"
              placeholder="Search fresh veggies, milk, fruits, atta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        )}

        {/* Navigation Action Buttons */}
        <div className="nav-actions">
          {/* Admin shortcuts */}
          {isAdmin && (
            <Link to="/admin" className={`nav-btn ${location.pathname.startsWith('/admin') ? 'active' : ''}`}>
              <LayoutDashboard size={18} />
              <span>Admin Panel</span>
            </Link>
          )}

          {/* Delivery Person shortcuts */}
          {isDeliveryPerson && (
            <Link to="/delivery" className={`nav-btn ${location.pathname.startsWith('/delivery') ? 'active' : ''}`}>
              <Truck size={18} />
              <span>Delivery Hub</span>
            </Link>
          )}

          {/* Customer links */}
          {!isAdmin && !isDeliveryPerson && (
            <>
              <Link to="/products" className={`nav-btn ${location.pathname === '/products' ? 'active' : ''}`}>
                <span>Explore</span>
              </Link>

              {isAuthenticated && (
                <Link to="/wishlist" className="nav-btn" title="Wishlist">
                  <Heart size={18} />
                </Link>
              )}

              <Link to="/cart" className="nav-btn" title="Cart">
                <ShoppingBag size={18} />
                <span>Cart</span>
                {cart?.totalItems > 0 && <span className="nav-badge-count">{cart.totalItems}</span>}
              </Link>
            </>
          )}

          {/* Notifications */}
          {isAuthenticated && (
            <Link to="/notifications" className="nav-btn" title="Notifications" style={{ position: 'relative' }}>
              <Bell size={18} />
              {unreadCount > 0 && <span className="nav-badge-count">{unreadCount}</span>}
            </Link>
          )}

          {/* User Account / Auth */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link
                to={isAdmin ? '/admin' : isDeliveryPerson ? '/delivery/profile' : '/profile'}
                className="nav-btn"
              >
                <UserIcon size={18} />
                <span>{user?.name?.split(' ')[0] || 'Account'}</span>
              </Link>

              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="btn btn-outline btn-sm"
                title="Logout"
                style={{ padding: '0.45rem 0.8rem' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
