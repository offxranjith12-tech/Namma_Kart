import React, { useState, useEffect } from 'react';
import { groceryListAPI, ordersAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { List, Plus, Trash2, ShoppingCart, RefreshCw } from 'lucide-react';

export const GroceryLists = () => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewList, setShowNewList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [buyAgainProducts, setBuyAgainProducts] = useState([]);
  
  const { showToast } = useToast();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const fetchListsAndBuyAgain = async () => {
    try {
      setLoading(true);
      const [listsRes, buyAgainRes] = await Promise.all([
        groceryListAPI.getAll(),
        ordersAPI.getBuyAgain()
      ]);
      if (listsRes.success) setLists(listsRes.data);
      if (buyAgainRes.success) setBuyAgainProducts(buyAgainRes.data);
    } catch (err) {
      showToast('Failed to load grocery lists', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListsAndBuyAgain();
  }, []);

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    try {
      const res = await groceryListAPI.create({ name: newListName });
      if (res.success) {
        setLists([res.data, ...lists]);
        setNewListName('');
        setShowNewList(false);
        showToast('List created successfully');
      }
    } catch (err) {
      showToast(err.message || 'Failed to create list', 'error');
    }
  };

  const handleDeleteList = async (listId) => {
    if (!window.confirm('Delete this list?')) return;
    try {
      await groceryListAPI.delete(listId);
      setLists(lists.filter(l => l.id !== listId));
      showToast('List deleted');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteItem = async (listId, productId) => {
    try {
      const res = await groceryListAPI.removeItem(listId, productId);
      if (res.success) {
        setLists(lists.map(l => l.id === listId ? res.data : l));
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleUpdateItemQty = async (listId, productId, qty) => {
    if (qty < 1) return;
    try {
      const res = await groceryListAPI.addOrUpdateItem(listId, { productId, quantity: qty });
      if (res.success) {
        setLists(lists.map(l => l.id === listId ? res.data : l));
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleAddListToCart = (list) => {
    if (!list.items || list.items.length === 0) {
      showToast('This list is empty', 'error');
      return;
    }
    list.items.forEach(item => {
      addToCart(item.productId, item.quantity);
    });
    showToast(`Added ${list.name} to cart!`);
    navigate('/cart');
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/profile" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Profile</Link>
          <span>&gt;</span>
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>My Grocery Lists</h1>
        </div>
        <button className="btn btn-primary" onClick={() => setShowNewList(true)}>
          <Plus size={20} /> New List
        </button>
      </div>

      {showNewList && (
        <form onSubmit={handleCreateList} className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input
              type="text"
              className="form-control"
              placeholder="E.g., Monthly Staples, Weekend BBQ..."
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              autoFocus
            />
            <button type="submit" className="btn btn-primary" disabled={!newListName.trim()}>Save</button>
            <button type="button" className="btn btn-outline" onClick={() => setShowNewList(false)}>Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <p>Loading your lists...</p>
      ) : lists.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          <List size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <h3>No Grocery Lists Yet</h3>
          <p>Create a list to easily manage your weekly or monthly shopping.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '2rem' }}>
          {lists.map(list => (
            <div key={list.id} className="card" style={{ overflow: 'hidden' }}>
              <div style={{ backgroundColor: 'var(--color-surface)', padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <List size={20} color="var(--color-primary)" /> {list.name}
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    className="btn btn-primary btn-sm" 
                    onClick={() => handleAddListToCart(list)}
                    disabled={!list.items || list.items.length === 0}
                  >
                    <ShoppingCart size={16} /> Add to Cart
                  </button>
                  <button className="btn btn-soft btn-sm" onClick={() => handleDeleteList(list.id)} style={{ color: '#E74C3C' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div style={{ padding: '1.5rem' }}>
                {(!list.items || list.items.length === 0) ? (
                  <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '0.9rem' }}>This list is empty. Browse products and add them to this list.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {list.items.map(item => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <img src={item.imageUrl} alt={item.productName} style={{ width: '50px', height: '50px', objectFit: 'contain', borderRadius: '8px' }} />
                          <div>
                            <Link to={`/product/${item.productId}`} style={{ fontWeight: 600, color: 'var(--color-text)', textDecoration: 'none' }}>{item.productName}</Link>
                            <p style={{ margin: '0.2rem 0 0', fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.9rem' }}>₹{item.discountedPrice || item.price}</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
                            <button style={{ border: 'none', background: 'none', padding: '0.4rem 0.6rem', cursor: 'pointer' }} onClick={() => handleUpdateItemQty(list.id, item.productId, item.quantity - 1)}>-</button>
                            <span style={{ padding: '0 0.5rem', fontWeight: 600, minWidth: '30px', textAlign: 'center' }}>{item.quantity}</span>
                            <button style={{ border: 'none', background: 'none', padding: '0.4rem 0.6rem', cursor: 'pointer' }} onClick={() => handleUpdateItemQty(list.id, item.productId, item.quantity + 1)}>+</button>
                          </div>
                          <button style={{ border: 'none', background: 'none', color: '#E74C3C', cursor: 'pointer', padding: '0.5rem' }} onClick={() => handleDeleteItem(list.id, item.productId)}>
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Buy Again Section */}
      {buyAgainProducts.length > 0 && (
        <div style={{ marginTop: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <RefreshCw size={24} color="var(--color-primary)" /> Buy Again
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {buyAgainProducts.map(p => (
              <div key={p.id} className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <img src={p.imageUrl} alt={p.name} style={{ width: '100px', height: '100px', objectFit: 'contain', marginBottom: '1rem' }} />
                <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', flex: 1 }}>{p.name}</h4>
                <p style={{ margin: '0 0 1rem', fontWeight: 700, color: 'var(--color-primary)' }}>₹{p.discountedPrice}</p>
                <button className="btn btn-outline btn-sm" style={{ width: '100%' }} onClick={() => addToCart(p.id, 1)}>Add to Cart</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
