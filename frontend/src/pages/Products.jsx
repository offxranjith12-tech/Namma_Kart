import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, CheckCircle2 } from 'lucide-react';
import { productsAPI, categoriesAPI } from '../services/api';
import { ProductCard } from '../components/ProductCard';

export const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectedCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';
  const [sortBy, setSortBy] = useState('popular');
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const catRes = await categoriesAPI.getAll();
        if (catRes.success) setCategories(catRes.data);

        let prodRes;
        if (searchQuery) {
          prodRes = await productsAPI.search(searchQuery);
        } else if (selectedCategory) {
          prodRes = await productsAPI.getByCategory(selectedCategory);
        } else {
          prodRes = await productsAPI.getAll();
        }

        if (prodRes.success) {
          setProducts(prodRes.data);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, searchQuery]);

  const handleCategoryChange = (catId) => {
    if (catId) {
      setSearchParams({ category: catId });
    } else {
      setSearchParams({});
    }
  };

  // Filter & Sort
  let filtered = [...products];
  if (inStockOnly) {
    filtered = filtered.filter((p) => p.stock > 0);
  }

  if (sortBy === 'price-low') {
    filtered.sort((a, b) => Number(a.discountedPrice || a.price) - Number(b.discountedPrice || b.price));
  } else if (sortBy === 'price-high') {
    filtered.sort((a, b) => Number(b.discountedPrice || b.price) - Number(a.discountedPrice || a.price));
  } else if (sortBy === 'discount') {
    filtered.sort((a, b) => Number(b.discount || 0) - Number(a.discount || 0));
  }

  return (
    <div>
      {/* 1. Horizontal Side-Scrollable Category Suggestions Bar (Full swipe on all devices) */}
      <div className="category-subnav">
        <div className="category-subnav-list">
          <button
            type="button"
            className={`cat-chip ${!selectedCategory ? 'active' : ''}`}
            onClick={() => handleCategoryChange('')}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`cat-chip ${String(selectedCategory) === String(cat.id) ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="container" style={{ padding: '1.5rem 1rem 4rem' }}>
        {/* Search Header Banner if searching */}
        {searchQuery && (
          <div style={{ marginBottom: '1.25rem', padding: '1rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <p style={{ fontSize: '0.95rem' }}>
              Showing results for <strong>"{searchQuery}"</strong> ({filtered.length} products found)
            </p>
          </div>
        )}

        <div className="products-layout">
          {/* Desktop Sidebar Filters */}
          <aside className="products-sidebar-desktop">
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                <Filter size={18} color="var(--color-primary)" />
                <h4 style={{ fontWeight: 800 }}>Categories</h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <button
                  type="button"
                  className={`btn btn-sm ${!selectedCategory ? 'btn-primary' : 'btn-soft'}`}
                  style={{ justifyContent: 'flex-start', width: '100%' }}
                  onClick={() => handleCategoryChange('')}
                >
                  All Categories
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`btn btn-sm ${String(selectedCategory) === String(cat.id) ? 'btn-primary' : 'btn-soft'}`}
                    style={{ justifyContent: 'flex-start', width: '100%' }}
                    onClick={() => handleCategoryChange(cat.id)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 700 }}>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    style={{ accentColor: 'var(--color-primary)' }}
                  />
                  In Stock Only
                </label>
              </div>
            </div>
          </aside>

          {/* Products View */}
          <main>
            {/* Controls Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>
                Showing {filtered.length} products
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <SlidersHorizontal size={16} color="var(--color-primary)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Sort:</span>
                <select
                  className="form-control"
                  style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="popular">Popularity</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="discount">Highest Discount</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                Loading fresh products...
              </div>
            ) : filtered.length === 0 ? (
              <div className="card-soft" style={{ padding: '3rem', textAlign: 'center' }}>
                <h3 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>No products found</h3>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
                  We couldn't find any products matching your search or filter.
                </p>
                <button
                  type="button"
                  className="btn btn-primary btn-glue btn-sm"
                  onClick={() => {
                    setSearchParams({});
                    setInStockOnly(false);
                  }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
