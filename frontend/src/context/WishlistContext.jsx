import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistAPI } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated, isCustomer } = useAuth();
  const { showToast } = useToast();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated || !isCustomer) {
      setWishlist([]);
      return;
    }
    try {
      setLoading(true);
      const res = await wishlistAPI.getWishlist();
      if (res.success) {
        setWishlist(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isCustomer]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = async (productId) => {
    if (!isAuthenticated) {
      showToast('Please login to save favorites', 'info');
      return;
    }

    const inWishlist = wishlist.some((p) => p.id === productId);

    try {
      if (inWishlist) {
        await wishlistAPI.remove(productId);
        setWishlist((prev) => prev.filter((p) => p.id !== productId));
        showToast('Removed from wishlist');
      } else {
        await wishlistAPI.add(productId);
        fetchWishlist();
        showToast('Added to wishlist!');
      }
    } catch (err) {
      showToast(err.message || 'Action failed', 'error');
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((p) => p.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        toggleWishlist,
        isInWishlist,
        refreshWishlist: fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
