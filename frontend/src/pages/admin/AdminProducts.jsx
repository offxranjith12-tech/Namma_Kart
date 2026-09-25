import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit3, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { adminAPI, categoriesAPI } from '../../services/api';
import { AdminSidebar } from '../../components/AdminSidebar';
import { useToast } from '../../context/ToastContext';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    categoryId: '',
    name: '',
    description: '',
    price: '',
    stock: '',
    unit: '1 kg',
    imageUrl: '',
    discount: '0',
    active: true,
  });

  const { showToast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        adminAPI.getProducts(),
        categoriesAPI.getAll(),
      ]);
      if (prodRes.success) setProducts(prodRes.data);
      if (catRes.success) setCategories(catRes.data);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      categoryId: categories[0]?.id || '',
      name: '',
      description: '',
      price: '',
      stock: '50',
      unit: '1 kg',
      imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60',
      discount: '0',
      active: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      categoryId: product.categoryId,
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      unit: product.unit,
      imageUrl: product.imageUrl || '',
      discount: product.discount || '0',
      active: product.active,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        categoryId: Number(formData.categoryId),
        price: Number(formData.price),
        stock: Number(formData.stock),
        discount: Number(formData.discount),
      };

      if (editingProduct) {
        await adminAPI.updateProduct(editingProduct.id, payload);
        showToast('Product updated successfully');
      } else {
        await adminAPI.createProduct(payload);
        showToast('Product created successfully');
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await adminAPI.deleteProduct(id);
      showToast('Product deactivated');
      fetchData();
    } catch (err) {
      showToast(err.message || 'Could not delete product', 'error');
    }
  };

  return (
    <div className="dashboard-layout">
      <AdminSidebar />

      <main className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: '1.85rem' }}>Products & Inventory</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
              Manage catalog items, pricing, discounts, and real-time stock levels
            </p>
          </div>

          <button type="button" onClick={handleOpenAdd} className="btn btn-primary btn-sm">
            <Plus size={16} /> Add Product
          </button>
        </div>

        {/* Modal */}
        {showModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'var(--color-primary-30)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '1rem',
            }}
          >
            <div className="card" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
              <h3 style={{ fontWeight: 800, marginBottom: '1.25rem' }}>
                {editingProduct ? 'Edit Product' : 'Add New Grocery Product'}
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-control"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    required
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Product Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Price (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Stock Units</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Unit Weight</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 1 kg, 500 g, 1 L"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Discount (%)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Image URL</label>
                    <input
                      type="url"
                      className="form-control"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
                  <button type="submit" className="btn btn-primary btn-sm">
                    {editingProduct ? 'Save Changes' : 'Create Product'}
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-soft btn-sm">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="card" style={{ padding: '1.5rem' }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading catalog...</div>
          ) : (
            <div className="custom-table-wrap">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Discount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            style={{ width: '40px', height: '40px', objectFit: 'contain', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-sm)' }}
                          />
                          <div>
                            <strong style={{ fontSize: '0.92rem' }}>{p.name}</strong>
                            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{p.unit}</div>
                          </div>
                        </div>
                      </td>

                      <td>{p.categoryName}</td>
                      <td>
                        <strong>₹{p.price}</strong>
                        {p.discount > 0 && (
                          <div style={{ fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 700 }}>
                            Effective: ₹{p.discountedPrice}
                          </div>
                        )}
                      </td>

                      <td>
                        <span
                          className="badge"
                          style={{
                            backgroundColor: p.stock <= 10 ? 'var(--color-primary-15)' : 'var(--color-surface)',
                            color: p.stock <= 10 ? 'var(--color-primary)' : 'var(--color-text-main)',
                            fontWeight: p.stock <= 10 ? 800 : 600,
                          }}
                        >
                          {p.stock <= 10 && <AlertTriangle size={12} />} {p.stock} units
                        </span>
                      </td>

                      <td>{p.discount ? `${p.discount}%` : 'None'}</td>

                      <td>
                        <span className={`badge ${p.active ? 'badge-primary' : 'badge-soft'}`}>
                          {p.active ? 'Active' : 'Disabled'}
                        </span>
                      </td>

                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(p)}
                            className="btn btn-soft btn-sm"
                            title="Edit Product"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(p.id)}
                            className="btn btn-soft btn-sm"
                            style={{ color: 'var(--color-primary)' }}
                            title="Deactivate Product"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
