import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Truck, History, User } from 'lucide-react';

export const DeliveryNav = () => {
  return (
    <>
      {/* Desktop Delivery Sub-Navigation Bar */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1.5px solid var(--color-border)',
          padding: '0.75rem 0',
        }}
      >
        <div className="container" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <NavLink
            to="/delivery"
            end
            className={({ isActive }) => `btn btn-sm ${isActive ? 'btn-primary' : 'btn-soft'}`}
          >
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/delivery/orders"
            className={({ isActive }) => `btn btn-sm ${isActive ? 'btn-primary' : 'btn-soft'}`}
          >
            <Truck size={16} />
            <span>Active Deliveries</span>
          </NavLink>

          <NavLink
            to="/delivery/history"
            className={({ isActive }) => `btn btn-sm ${isActive ? 'btn-primary' : 'btn-soft'}`}
          >
            <History size={16} />
            <span>Delivery History</span>
          </NavLink>

          <NavLink
            to="/delivery/profile"
            className={({ isActive }) => `btn btn-sm ${isActive ? 'btn-primary' : 'btn-soft'}`}
          >
            <User size={16} />
            <span>My Profile</span>
          </NavLink>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="delivery-mobile-bar">
        <NavLink
          to="/delivery"
          end
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontSize: '0.75rem',
            fontWeight: 700,
            gap: '0.2rem',
            color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
            textDecoration: 'none',
          })}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/delivery/orders"
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontSize: '0.75rem',
            fontWeight: 700,
            gap: '0.2rem',
            color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
            textDecoration: 'none',
          })}
        >
          <Truck size={20} />
          <span>Deliveries</span>
        </NavLink>

        <NavLink
          to="/delivery/history"
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontSize: '0.75rem',
            fontWeight: 700,
            gap: '0.2rem',
            color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
            textDecoration: 'none',
          })}
        >
          <History size={20} />
          <span>History</span>
        </NavLink>

        <NavLink
          to="/delivery/profile"
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontSize: '0.75rem',
            fontWeight: 700,
            gap: '0.2rem',
            color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
            textDecoration: 'none',
          })}
        >
          <User size={20} />
          <span>Profile</span>
        </NavLink>
      </nav>
    </>
  );
};
