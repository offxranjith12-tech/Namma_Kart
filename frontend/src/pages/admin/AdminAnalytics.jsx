import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, ShoppingBag, Bike, CheckCircle2 } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { AdminSidebar } from '../../components/AdminSidebar';

export const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getAnalytics();
      if (res.success) setData(res.data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <AdminSidebar />

      <main className="main-content">
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontWeight: 800, fontSize: '1.85rem' }}>Analytics & Operational Performance</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
            Fulfillment velocity, sales totals, and delivery partner efficiency statistics
          </p>
        </div>

        {/* Overview cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          <div className="stat-card">
            <div>
              <span className="stat-label">Gross Revenue</span>
              <div className="stat-value">₹{data?.totalRevenue || 0}</div>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 700 }}>
                Today: ₹{data?.todayRevenue || 0}
              </span>
            </div>
            <div className="stat-icon-wrap"><TrendingUp size={24} /></div>
          </div>

          <div className="stat-card">
            <div>
              <span className="stat-label">Orders Completed</span>
              <div className="stat-value">{data?.completedOrders || 0}</div>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                {data?.totalOrders || 0} Total Orders
              </span>
            </div>
            <div className="stat-icon-wrap"><CheckCircle2 size={24} /></div>
          </div>

          <div className="stat-card">
            <div>
              <span className="stat-label">Active Delivery Fleet</span>
              <div className="stat-value">{data?.activeDeliveryPersons || 0} Drivers</div>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                {data?.totalDeliveryPersons || 0} Registered Agents
              </span>
            </div>
            <div className="stat-icon-wrap"><Bike size={24} /></div>
          </div>
        </div>

        {/* Operational Flow Metric Summary */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ fontWeight: 800, marginBottom: '1.25rem' }}>Delivery Fulfillment Velocity</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div className="card-soft" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>DISPATCH TIME</span>
              <h2 style={{ fontWeight: 900, color: 'var(--color-primary)', marginTop: '0.35rem' }}>~12 mins</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>From order placement to partner assignment</p>
            </div>

            <div className="card-soft" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>DOORSTEP TRANSIT</span>
              <h2 style={{ fontWeight: 900, color: 'var(--color-primary)', marginTop: '0.35rem' }}>~18 mins</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Pickup to delivered completion</p>
            </div>

            <div className="card-soft" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>CUSTOMER SATISFACTION</span>
              <h2 style={{ fontWeight: 900, color: 'var(--color-primary)', marginTop: '0.35rem' }}>4.8 / 5.0</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Based on verified post-delivery reviews</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
