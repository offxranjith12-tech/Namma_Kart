import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit3, Trash2 } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { AdminSidebar } from '../../components/AdminSidebar';
import { useToast } from '../../context/ToastContext';

export const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    active: true,
  });

  const { showToast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getCategories();
      if (res.success) setCategories(res.data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingCat(null);
    setFormData({ name: '', description: '', imageUrl: '', active: true });
    setShowModal(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCat(cat);
    setFormData({
      name: cat.name,
      description: cat.description || '',
      imageUrl: cat.imageUrl || '',
      active: cat.active,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCat) {
        await adminAPI.updateCategory(editingCat.id, formData);
        showToast('Category updated successfully');
      } else {
        await adminAPI.createCategory(formData);
        showToast('Category created successfully');
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await adminAPI.deleteCategory(id);
      showToast('Category deleted');
      fetchCategories();
    } catch (err) {
      showToast(err.message || 'Failed to delete', 'error');
    }
  };

  return (
    <div className="dashboard-layout">
      <AdminSidebar />

      <main className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: '1.85rem' }}>Category Management</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
              Organize products into intuitive grocery categories
            </p>
          </div>

          <button type="button" onClick={handleOpenAdd} className="btn btn-primary btn-sm">
            <Plus size={16} /> Add Category
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
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '1rem',
            }}
          >
            <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '2rem' }}>
              <h3 style={{ fontWeight: 800, marginBottom: '1.25rem' }}>
                {editingCat ? 'Edit Category' : 'Create Category'}
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Category Name</label>
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

                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input
                    type="url"
                    className="form-control"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
                  <button type="submit" className="btn btn-primary btn-sm">
                    {editingCat ? 'Save Changes' : 'Create Category'}
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-soft btn-sm">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="card" style={{ padding: '1.5rem' }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading categories...</div>
          ) : (
            <div className="custom-table-wrap">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={c.imageUrl}
                            alt={c.name}
                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                          />
                          <strong style={{ fontSize: '0.95rem' }}>{c.name}</strong>
                        </div>
                      </td>

                      <td style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{c.description}</td>

                      <td>
                        <span className={`badge ${c.active ? 'badge-primary' : 'badge-soft'}`}>
                          {c.active ? 'Active' : 'Hidden'}
                        </span>
                      </td>

                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(c)}
                            className="btn btn-soft btn-sm"
                            title="Edit"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(c.id)}
                            className="btn btn-soft btn-sm"
                            style={{ color: 'var(--color-primary)' }}
                            title="Delete"
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
