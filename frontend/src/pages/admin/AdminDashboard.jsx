import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Users,
  Package,
  Bike,
  Clock,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { adminAPI } from '../../services/api';
import { AdminSidebar } from '../../components/AdminSidebar';

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getDashboard();
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <AdminSidebar />
        <main className="main-content" style={{ textAlign: 'center', padding: '4rem' }}>
          Loading admin dashboard metrics...
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <AdminSidebar />

      <main className="main-content">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontWeight: 800, fontSize: '1.85rem' }}>Admin Operations Dashboard</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
            Real-time grocery orders, delivery assignments, inventory health, and revenue analytics
          </p>
        </div>

        {/* Top KPI Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          {/* Total Revenue */}
          <div className="stat-card">
            <div>
              <span className="stat-label">Total Revenue</span>
              <div className="stat-value">₹{data?.totalRevenue || 0}</div>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 700 }}>
                Today: ₹{data?.todayRevenue || 0}
              </span>
            </div>
            <div className="stat-icon-wrap">
              <TrendingUp size={24} />
            </div>
          </div>

          {/* Total Orders */}
          <div className="stat-card">
            <div>
              <span className="stat-label">Total Orders</span>
              <div className="stat-value">{data?.totalOrders || 0}</div>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                {data?.completedOrders || 0} Completed &bull; {data?.pendingOrders || 0} Pending
              </span>
            </div>
            <div className="stat-icon-wrap">
              <ShoppingBag size={24} />
            </div>
          </div>

          {/* Delivery Operations */}
          <div className="stat-card">
            <div>
              <span className="stat-label">Delivery Fleet</span>
              <div className="stat-value">{data?.activeDeliveryPersons || 0} Active</div>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                {data?.pendingDeliveries || 0} Ongoing Deliveries
              </span>
            </div>
            <div className="stat-icon-wrap">
              <Bike size={24} />
            </div>
          </div>

          {/* Catalog & Low Stock */}
          <div className="stat-card">
            <div>
              <span className="stat-label">Total Products</span>
              <div className="stat-value">{data?.totalProducts || 0}</div>
              <span style={{ fontSize: '0.8rem', color: data?.lowStockCount > 0 ? 'var(--color-primary)' : 'var(--color-text-muted)', fontWeight: 700 }}>
                {data?.lowStockCount || 0} Low Stock Alerts
              </span>
            </div>
            <div className="stat-icon-wrap">
              <Package size={24} />
            </div>
          </div>
        </div>

        {/* Low Stock Alerts Section */}
        {data?.lowStockProducts?.length > 0 && (
          <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', border: '2px solid var(--color-primary-30)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <AlertTriangle size={20} color="var(--color-primary)" />
              <h3 style={{ fontWeight: 800, fontSize: '1.15rem' }}>Low Stock Inventory Warnings</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
              {data.lowStockProducts.slice(0, 4).map((p) => (
                <div key={p.id} className="card-soft" style={{ padding: '0.85rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '0.9rem' }}>{p.name}</strong>
                    <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{p.categoryName} &bull; {p.unit}</p>
                  </div>
                  <span className="badge" style={{ backgroundColor: 'var(--color-primary-15)', color: 'var(--color-primary)', fontWeight: 800 }}>
                    {p.stock} left
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Orders Table */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontWeight: 800, fontSize: '1.15rem' }}>Recent Grocery Orders</h3>
            <Link to="/admin/orders" className="btn btn-outline btn-sm">
              Manage All Orders <ChevronRight size={14} />
            </Link>
          </div>

          <div className="custom-table-wrap">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Delivery Slot</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Delivery Partner</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data?.recentOrders?.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                      No recent orders recorded
                    </td>
                  </tr>
                ) : (
                  data?.recentOrders?.map((order) => (
                    <tr key={order.id}>
                      <td><strong>#NK{order.id}</strong></td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{order.customerName}</div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{order.city}</span>
                      </td>
                      <td>{order.slotName}</td>
                      <td><strong>₹{order.totalAmount}</strong></td>
                      <td>
                        <span className="badge badge-soft">{order.status}</span>
                      </td>
                      <td>
                        {order.deliveryPersonName ? (
                          <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{order.deliveryPersonName}</span>
                        ) : (
                          <span style={{ color: 'var(--color-text-subtle)' }}>Unassigned</span>
                        )}
                      </td>
                      <td>
                        <Link to="/admin/orders" className="btn btn-soft btn-sm">
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
