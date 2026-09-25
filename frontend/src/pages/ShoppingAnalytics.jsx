import React, { useState, useEffect } from 'react';
import { ordersAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, ShoppingBag, DollarSign, Calendar, Tag } from 'lucide-react';

const COLORS = ['#2ECC71', '#27AE60', '#F1C40F', '#E67E22', '#E74C3C'];

export const ShoppingAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await ordersAPI.getAnalytics();
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        showToast(err.message || 'Failed to load analytics', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [showToast]);

  if (loading) return <div className="container" style={{ padding: '2rem' }}>Loading analytics...</div>;
  if (!data) return null;

  const isSpendingUp = data.currentMonthSpent > data.previousMonthSpent;
  const difference = Math.abs(data.currentMonthSpent - data.previousMonthSpent);

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/profile" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Profile</Link>
        <span>&gt;</span>
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Shopping Analytics</h1>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(46, 204, 113, 0.1)', borderRadius: '12px', color: 'var(--color-primary)' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Total Spent</p>
            <h3 style={{ margin: '0.5rem 0 0', fontSize: '1.5rem' }}>₹{data.totalSpent}</h3>
          </div>
        </div>
        
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(46, 204, 113, 0.1)', borderRadius: '12px', color: 'var(--color-primary)' }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Total Orders</p>
            <h3 style={{ margin: '0.5rem 0 0', fontSize: '1.5rem' }}>{data.totalOrders}</h3>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(46, 204, 113, 0.1)', borderRadius: '12px', color: 'var(--color-primary)' }}>
            <Tag size={24} />
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Total Saved</p>
            <h3 style={{ margin: '0.5rem 0 0', fontSize: '1.5rem' }}>₹{data.totalSaved}</h3>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: 'var(--color-surface)' }}>
        {isSpendingUp ? <TrendingUp color="#E74C3C" /> : <TrendingDown color="var(--color-primary)" />}
        <p style={{ margin: 0, fontWeight: 500 }}>
          You spent <strong style={{ color: isSpendingUp ? '#E74C3C' : 'var(--color-primary)' }}>₹{difference}</strong> {isSpendingUp ? 'more' : 'less'} this month compared to last month.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        {/* Monthly Chart */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={20} color="var(--color-primary)" /> Monthly Spending
          </h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthlySpending}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val}`} />
                <Tooltip cursor={{ fill: 'rgba(46, 204, 113, 0.1)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="amount" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Chart */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Category Distribution</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.mostPurchasedCategories} dataKey="totalSpent" nameKey="categoryName" cx="50%" cy="50%" outerRadius={100} label>
                  {data.mostPurchasedCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
