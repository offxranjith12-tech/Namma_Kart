import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Grid, ShoppingBag, Heart, User, Truck, LayoutDashboard, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const MobileBottomNav = () => {
  const { user, isAuthenticated, isAdmin, isDeliveryPerson } = useAuth();
  const { cart } = useCart();
  const location = useLocation();

  // If in full-screen modal or checkout success, still show or adapt
  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      {isAdmin ? (
        // Admin Quick Mobile Navigation
        <>
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="mobile-nav-icon-wrap">
              <LayoutDashboard size={20} />
            </div>
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="mobile-nav-icon-wrap">
              <ShoppingBag size={20} />
            </div>
            <span>Orders</span>
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="mobile-nav-icon-wrap">
              <Grid size={20} />
            </div>
            <span>Catalog</span>
          </NavLink>

          <NavLink
            to="/admin/delivery-persons"
            className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="mobile-nav-icon-wrap">
              <Truck size={20} />
            </div>
            <span>Fleet</span>
          </NavLink>
        </>
      ) : isDeliveryPerson ? (
        // Delivery Partner Quick Mobile Navigation
        <>
          <NavLink
            to="/delivery"
            end
            className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="mobile-nav-icon-wrap">
              <LayoutDashboard size={20} />
            </div>
            <span>Hub</span>
          </NavLink>

          <NavLink
            to="/delivery/orders"
            className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="mobile-nav-icon-wrap">
              <Truck size={20} />
            </div>
            <span>Active Trips</span>
          </NavLink>

          <NavLink
            to="/delivery/history"
            className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="mobile-nav-icon-wrap">
              <ShoppingBag size={20} />
            </div>
            <span>History</span>
          </NavLink>

          <NavLink
            to="/delivery/profile"
            className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="mobile-nav-icon-wrap">
              <User size={20} />
            </div>
            <span>Profile</span>
          </NavLink>
        </>
      ) : (
        // Customer / Guest Navigation
        <>
          <NavLink
            to="/"
            end
            className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="mobile-nav-icon-wrap">
              <Home size={20} />
            </div>
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="mobile-nav-icon-wrap">
              <Grid size={20} />
            </div>
            <span>Shop</span>
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) => `mobile-nav-item cart-item ${isActive ? 'active' : ''}`}
          >
            <div className="mobile-nav-icon-wrap">
              <ShoppingBag size={20} />
              {cart?.totalItems > 0 && (
                <span className="mobile-cart-badge">{cart.totalItems}</span>
              )}
            </div>
            <span>Cart</span>
          </NavLink>

          {isAuthenticated ? (
            <NavLink
              to="/orders"
              className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
            >
              <div className="mobile-nav-icon-wrap">
                <ShoppingBag size={20} />
              </div>
              <span>Orders</span>
            </NavLink>
          ) : (
            <NavLink
              to="/wishlist"
              className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
            >
              <div className="mobile-nav-icon-wrap">
                <Heart size={20} />
              </div>
              <span>Wishlist</span>
            </NavLink>
          )}

          <NavLink
            to={isAuthenticated ? '/profile' : '/login'}
            className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="mobile-nav-icon-wrap">
              <User size={20} />
            </div>
            <span>{isAuthenticated ? 'Profile' : 'Login'}</span>
          </NavLink>
        </>
      )}
    </nav>
  );
};
