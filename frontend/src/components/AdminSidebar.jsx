import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Users,
  TicketPercent,
  Clock,
  Bike,
  BarChart3,
  AlertTriangle,
  MessageSquare,
} from 'lucide-react';

export const AdminSidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-heading">Main</div>
      <NavLink
        to="/admin"
        end
        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
      >
        <LayoutDashboard size={18} />
        <span>Dashboard</span>
      </NavLink>

      <NavLink
        to="/admin/orders"
        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
      >
        <ShoppingBag size={18} />
        <span>Orders</span>
      </NavLink>

      <div className="sidebar-heading">Inventory & Catalog</div>
      <NavLink
        to="/admin/products"
        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
      >
        <Package size={18} />
        <span>Products</span>
      </NavLink>

      <NavLink
        to="/admin/categories"
        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
      >
        <Layers size={18} />
        <span>Categories</span>
      </NavLink>

      <NavLink
        to="/admin/expiry"
        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
      >
        <AlertTriangle size={18} />
        <span>Expiry Management</span>
      </NavLink>

      <div className="sidebar-heading">Logistics & Operations</div>
      <NavLink
        to="/admin/delivery-persons"
        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
      >
        <Bike size={18} />
        <span>Delivery Persons</span>
      </NavLink>

      <NavLink
        to="/admin/delivery-slots"
        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
      >
        <Clock size={18} />
        <span>Delivery Slots</span>
      </NavLink>

      <div className="sidebar-heading">Marketing & Customers</div>
      <NavLink
        to="/admin/coupons"
        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
      >
        <TicketPercent size={18} />
        <span>Coupons</span>
      </NavLink>

      <NavLink
        to="/admin/users"
        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
      >
        <Users size={18} />
        <span>Users</span>
      </NavLink>

      <NavLink
        to="/admin/analytics"
        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
      >
        <BarChart3 size={18} />
        <span>Analytics</span>
      </NavLink>
    </aside>
  );
};
