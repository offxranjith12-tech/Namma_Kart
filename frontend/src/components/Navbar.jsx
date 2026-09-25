import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  Bell,
  User as UserIcon,
  Search,
  LogOut,
  LayoutDashboard,
  Truck,
  Menu,
  X,
  MapPin,
  Package,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { notificationsAPI, productsAPI } from '../services/api';

export const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin, isDeliveryPerson } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
    setShowSuggestions(false);
  }, [location.pathname]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim().length < 2) {
        setSearchSuggestions([]);
        return;
      }
      try {
        const res = await productsAPI.search(searchTerm);
        if (res.success && res.data) {
          setSearchSuggestions(res.data.slice(0, 5));
        }
      } catch (err) {
        console.error(err);
      }
    };
    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    let interval;
    if (isAuthenticated) {
      const fetchNotifs = () => {
        notificationsAPI.getAll().then((res) => {
          if (res.success && res.data) {
            const unread = res.data.filter((n) => !n.isRead).length;
            setUnreadCount(unread);
          }
        }).catch(() => {});
      };
      
      fetchNotifs();
      interval = setInterval(fetchNotifs, 10000); // Poll every 10 seconds for live updates
    }
    return () => clearInterval(interval);
  }, [isAuthenticated, location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header className="navbar">
        <div className="container navbar-inner">
          {/* Brand */}
          <Link to={isAdmin ? "/admin" : isDeliveryPerson ? "/delivery" : "/"} className="nav-brand">
            <img src="/logo.png" alt="Namma Kart" style={{ height: '68px', width: 'auto', objectFit: 'contain' }} />
            {isAdmin && <span className="nav-brand-tag">ADMIN</span>}
            {isDeliveryPerson && <span className="nav-brand-tag">DELIVERY</span>}
          </Link>

          {/* Global Search Bar (Desktop) */}
          {!isAdmin && !isDeliveryPerson && (
            <div className="nav-search-wrapper" style={{ position: 'relative' }}>
              <form onSubmit={handleSearch} className="nav-search">
                <Search size={18} className="nav-search-icon" />
                <input
                  type="text"
                  placeholder="Search fresh veggies, milk, fruits, atta..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
              </form>

              {/* Desktop Suggestions Dropdown */}
              {showSuggestions && searchTerm.trim().length >= 2 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '0.5rem',
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--color-border)',
                  zIndex: 50,
                  overflow: 'hidden'
                }}>
                  {searchSuggestions.length > 0 ? (
                    searchSuggestions.map((product) => (
                      <div
                        key={product.id}
                        style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', borderBottom: '1px solid var(--color-surface)' }}
                        onClick={() => {
                          setSearchTerm('');
                          setShowSuggestions(false);
                          navigate(`/products?search=${encodeURIComponent(product.name)}`);
                        }}
                      >
                        <img src={product.imageUrl} alt={product.name} style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-main)' }}>{product.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)' }}>₹{product.discountedPrice || product.price}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '1rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      No matches found
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Navigation Action Buttons */}
          <div className="nav-actions">
            {/* Admin shortcuts (Desktop) */}
            {isAdmin && (
              <Link to="/admin" className={`nav-btn desktop-only ${location.pathname.startsWith('/admin') ? 'active' : ''}`}>
                <LayoutDashboard size={18} />
                <span>Admin Panel</span>
              </Link>
            )}

            {/* Delivery Person shortcuts (Desktop) */}
            {isDeliveryPerson && (
              <Link to="/delivery" className={`nav-btn desktop-only ${location.pathname.startsWith('/delivery') ? 'active' : ''}`}>
                <Truck size={18} />
                <span>Delivery Hub</span>
              </Link>
            )}

            {/* Customer links */}
            {!isAdmin && !isDeliveryPerson && (
              <>
                <Link to="/products" className={`nav-btn desktop-only ${location.pathname === '/products' ? 'active' : ''}`}>
                  <span>Explore</span>
                </Link>

                {/* Mobile Search Icon */}
                <button
                  type="button"
                  className="nav-btn mobile-only"
                  onClick={() => {
                    setMobileSearchOpen(!mobileSearchOpen);
                    if (!mobileSearchOpen) {
                      setTimeout(() => document.getElementById('mobile-inline-search')?.focus(), 100);
                    }
                  }}
                  title="Search"
                >
                  <Search size={18} />
                </button>

                {isAuthenticated && (
                  <>
                    <Link to="/orders" className="nav-btn desktop-only" title="My Orders">
                      <Package size={18} />
                      <span className="desktop-only" style={{ marginLeft: '4px' }}>Orders</span>
                    </Link>
                    <Link to="/wishlist" className="nav-btn desktop-only" title="Wishlist">
                      <Heart size={18} />
                    </Link>
                  </>
                )}

                <Link to="/cart" className="nav-btn" title="Cart">
                  <ShoppingBag size={18} />
                  <span className="desktop-only">Cart</span>
                  {cart?.totalItems > 0 && <span className="nav-badge-count">{cart.totalItems}</span>}
                </Link>
              </>
            )}

            {/* Notifications */}
            {isAuthenticated && (
              <Link to="/notifications" className="nav-btn" title="Notifications">
                <Bell size={18} />
                {unreadCount > 0 && <span className="nav-badge-count">{unreadCount}</span>}
              </Link>
            )}

            {/* User Account / Auth */}
            {isAuthenticated ? (
              <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link
                  to={isAdmin ? '/admin' : isDeliveryPerson ? '/delivery/profile' : '/profile'}
                  className="nav-btn"
                >
                  <UserIcon size={18} />
                  <span>{user?.name?.split(' ')[0] || 'Account'}</span>
                </Link>

                <button
                  type="button"
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
              <div className="desktop-only" style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to="/login" className="btn btn-outline btn-sm">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm btn-glow">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Inline Search Bar */}
        {mobileSearchOpen && !isAdmin && !isDeliveryPerson && (
          <div className="mobile-only" style={{ padding: '0.5rem 1rem 1rem', borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', position: 'relative' }}>
            <form onSubmit={(e) => {
              handleSearch(e);
              setMobileSearchOpen(false);
            }}>
              <div style={{ position: 'relative' }}>
                <input
                  id="mobile-inline-search"
                  type="text"
                  placeholder="Search fresh veggies, milk, fruits..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="form-control"
                  style={{ paddingLeft: '2.5rem', width: '100%', fontSize: '0.95rem' }}
                />
                <Search size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary)' }} />
              </div>
            </form>

            {/* Mobile Suggestions Dropdown */}
            {showSuggestions && searchTerm.trim().length >= 2 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '1rem',
                right: '1rem',
                marginTop: '0.2rem',
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--color-border)',
                zIndex: 50,
                overflow: 'hidden'
              }}>
                {searchSuggestions.length > 0 ? (
                  searchSuggestions.map((product) => (
                    <div
                      key={product.id}
                      style={{ padding: '0.65rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', borderBottom: '1px solid var(--color-surface)' }}
                      onClick={() => {
                        setSearchTerm('');
                        setShowSuggestions(false);
                        setMobileSearchOpen(false);
                        navigate(`/products?search=${encodeURIComponent(product.name)}`);
                      }}
                    >
                      <img src={product.imageUrl} alt={product.name} style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text-main)' }}>{product.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)' }}>₹{product.discountedPrice || product.price}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '1rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    No matches found
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </header>

      {/* Responsive Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
            {/* Drawer Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1.5px solid var(--color-border)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img src="/logo.png" alt="Namma Kart" style={{ height: '56px', width: 'auto', objectFit: 'contain' }} />
                <strong style={{ fontSize: '1.2rem', color: 'var(--color-primary)' }}>Namma Kart</strong>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-soft btn-sm"
                style={{ padding: '0.2rem 0.5rem', fontSize: '1.1rem' }}
              >
                <X size={18} />
              </button>
            </div>



            {/* Links List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
              <Link to="/products" className="sidebar-link">
                <Package size={18} />
                <span>Explore Catalog</span>
              </Link>

              {isAuthenticated && user?.role === 'CUSTOMER' && (
                <>
                  <Link to="/orders" className="sidebar-link">
                    <ShoppingBag size={18} />
                    <span>My Orders</span>
                  </Link>

                  <Link to="/wishlist" className="sidebar-link">
                    <Heart size={18} />
                    <span>Wishlist</span>
                  </Link>

                  <Link to="/addresses" className="sidebar-link">
                    <MapPin size={18} />
                    <span>Saved Addresses</span>
                  </Link>

                  <Link to="/profile" className="sidebar-link">
                    <UserIcon size={18} />
                    <span>My Profile</span>
                  </Link>
                </>
              )}

              {isAdmin && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-subtle)', textTransform: 'uppercase' }}>Admin Controls</span>
                  <Link to="/admin" className="sidebar-link" style={{ marginTop: '0.4rem' }}>
                    <LayoutDashboard size={18} />
                    <span>Admin Dashboard</span>
                  </Link>
                  <Link to="/admin/orders" className="sidebar-link">
                    <ShoppingBag size={18} />
                    <span>Manage Orders</span>
                  </Link>
                  <Link to="/admin/delivery-persons" className="sidebar-link">
                    <Truck size={18} />
                    <span>Delivery Fleet</span>
                  </Link>
                </div>
              )}

              {isDeliveryPerson && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-subtle)', textTransform: 'uppercase' }}>Driver Hub</span>
                  <Link to="/delivery" className="sidebar-link" style={{ marginTop: '0.4rem' }}>
                    <LayoutDashboard size={18} />
                    <span>Delivery Dashboard</span>
                  </Link>
                  <Link to="/delivery/orders" className="sidebar-link">
                    <Truck size={18} />
                    <span>Assigned Trips</span>
                  </Link>
                  <Link to="/delivery/history" className="sidebar-link">
                    <Package size={18} />
                    <span>Trip History</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Auth Actions in Drawer */}
            <div style={{ paddingTop: '1.25rem', borderTop: '1.5px solid var(--color-border)' }}>
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  className="btn btn-outline btn-sm"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <LogOut size={16} /> Logout ({user?.name?.split(' ')[0]})
                </button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <Link to="/login" className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-primary btn-sm btn-glow" style={{ width: '100%', justifyContent: 'center' }}>
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
