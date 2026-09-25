import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Truck,
  History,
  User
} from 'lucide-react';

export const DeliverySidebar = () => {
  return (
    <aside className="sidebar desktop-only">
      <div className="sidebar-heading">Driver Hub</div>
      <NavLink
        to="/delivery"
        end
        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
      >
        <LayoutDashboard size={18} />
        <span>Dashboard</span>
      </NavLink>

      <NavLink
        to="/delivery/orders"
        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
      >
        <Truck size={18} />
        <span>Active Deliveries</span>
      </NavLink>

      <NavLink
        to="/delivery/history"
        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
      >
        <History size={18} />
        <span>Delivery History</span>
      </NavLink>

      <div className="sidebar-heading">Account</div>
      <NavLink
        to="/delivery/profile"
        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
      >
        <User size={18} />
        <span>My Profile</span>
      </NavLink>
    </aside>
  );
};
