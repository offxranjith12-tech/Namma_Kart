import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '../../components/AdminSidebar';
import { adminAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { AlertTriangle, Clock, ShieldAlert, CheckCircle2, Settings, Ban } from 'lucide-react';
import axios from 'axios'; // We will use axios directly since api.js might not have these specific endpoints yet
import { useAuth } from '../../context/AuthContext';

export const ExpiryManagement = () => {
  const [products, setProducts] = useState([]);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(''); // '' means all
  const [showRuleModal, setShowRuleModal] = useState(false);
  const { showToast } = useToast();
  const { token } = useAuth();

  const [ruleForm, setRuleForm] = useState({
    id: null,
    minDays: 0,
    maxDays: 7,
    discountPercentage: 10,
    active: true
  });

  const getStatusColor = (product) => {
    if (product.isExpired) return 'var(--color-danger)';
    if (product.isNearExpiry) return '#FF9800'; // Orange
    if (product.daysRemaining <= 15) return '#FFC107'; // Yellow
    return 'var(--color-primary)';
  };

  const getStatusText = (product) => {
    if (product.isExpired) return 'Expired';
    if (product.isNearExpiry) return 'Near Expiry';
    if (product.daysRemaining != null && product.daysRemaining <= 15) return 'Expiring Soon';
    if (product.daysRemaining == null) return 'No Expiry';
    return 'Safe';
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const prodRes = await axios.get(`http://localhost:5173/api/admin/expiry/products${statusFilter ? `?status=${statusFilter}` : ''}`, config);
      if (prodRes.data.success) {
        setProducts(prodRes.data.data);
      }

      const rulesRes = await axios.get('http://localhost:5173/api/admin/expiry/rules', config);
      if (rulesRes.data.success) {
        setRules(rulesRes.data.data);
      }
    } catch (err) {
      showToast('Failed to load expiry data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRuleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (ruleForm.id) {
        await axios.put(`http://localhost:5173/api/admin/expiry/rules/${ruleForm.id}`, ruleForm, config);
        showToast('Rule updated successfully');
      } else {
        await axios.post('http://localhost:5173/api/admin/expiry/rules', ruleForm, config);
        showToast('Rule created successfully');
      }
      setShowRuleModal(false);
      fetchData();
    } catch (err) {
      showToast('Failed to save rule', 'error');
    }
  };

  const deleteRule = async (id) => {
    if (!window.confirm('Delete this rule?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`http://localhost:5173/api/admin/expiry/rules/${id}`, config);
      showToast('Rule deleted');
      fetchData();
    } catch (err) {
      showToast('Failed to delete rule', 'error');
    }
  };

  const disableProduct = async (id) => {
    if (!window.confirm('Deactivate this product?')) return;
    try {
      await adminAPI.deleteProduct(id);
      showToast('Product deactivated');
      fetchData();
    } catch (err) {
      showToast('Failed to deactivate product', 'error');
    }
  };

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <main className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: '1.85rem' }}>Expiry Management</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
              Track product expiry dates and manage automatic discounts
            </p>
          </div>
          <button onClick={() => { setRuleForm({ id: null, minDays: 0, maxDays: 7, discountPercentage: 10, active: true }); setShowRuleModal(true); }} className="btn btn-primary btn-sm">
            <Settings size={16} /> Add Discount Rule
          </button>
        </div>

        {/* Rules Section */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Active Expiry Discount Rules</h2>
          {rules.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)' }}>No rules configured.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              {rules.map(rule => (
                <div key={rule.id} style={{ border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-primary)' }}>{rule.discountPercentage}% OFF</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>When {rule.minDays} to {rule.maxDays} days remaining</div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => { setRuleForm(rule); setShowRuleModal(true); }} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => deleteRule(rule.id)} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}>Del</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Products Section */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem' }}>Product Expiry Tracking</h2>
            <select className="form-control" style={{ width: 'auto' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All Products</option>
              <option value="SAFE">Safe</option>
              <option value="EXPIRING_SOON">Expiring Soon</option>
              <option value="NEAR_EXPIRY">Near Expiry</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>

          <div className="custom-table-wrap">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Expiry Date</th>
                  <th>Days Left</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
                ) : products.map(product => (
                  <tr key={product.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img src={product.imageUrl} alt={product.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px' }} />
                        <div>
                          <div style={{ fontWeight: 600 }}>{product.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{product.categoryName}</div>
                        </div>
                      </div>
                    </td>
                    <td>{product.stock}</td>
                    <td>
                      <span style={{ 
                        display: 'inline-block', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '20px', 
                        fontSize: '0.75rem', 
                        fontWeight: 700, 
                        backgroundColor: `${getStatusColor(product)}20`, 
                        color: getStatusColor(product) 
                      }}>
                        {getStatusText(product)}
                      </span>
                    </td>
                    <td>{product.expiryDate || 'Not Set'}</td>
                    <td style={{ fontWeight: 700, color: getStatusColor(product) }}>
                      {product.daysRemaining != null ? product.daysRemaining : '-'}
                    </td>
                    <td>
                      {product.isExpired && product.active && (
                        <button onClick={() => disableProduct(product.id)} className="btn btn-sm" style={{ backgroundColor: 'var(--color-danger)', color: '#fff', border: 'none' }}>
                          <Ban size={14} /> Disable
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rule Modal */}
        {showRuleModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="card" style={{ padding: '2rem', width: '400px' }}>
              <h3 style={{ marginBottom: '1rem' }}>{ruleForm.id ? 'Edit Rule' : 'New Rule'}</h3>
              <form onSubmit={handleRuleSubmit}>
                <div className="form-group">
                  <label>Min Days Remaining</label>
                  <input type="number" className="form-control" value={ruleForm.minDays} onChange={e => setRuleForm({...ruleForm, minDays: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Max Days Remaining</label>
                  <input type="number" className="form-control" value={ruleForm.maxDays} onChange={e => setRuleForm({...ruleForm, maxDays: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Discount Percentage (%)</label>
                  <input type="number" step="0.01" className="form-control" value={ruleForm.discountPercentage} onChange={e => setRuleForm({...ruleForm, discountPercentage: e.target.value})} required />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button type="submit" className="btn btn-primary btn-sm">Save</button>
                  <button type="button" onClick={() => setShowRuleModal(false)} className="btn btn-soft btn-sm">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
