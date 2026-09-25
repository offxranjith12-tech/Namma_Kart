import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated, isCustomer } = useAuth();
  const { showToast } = useToast();
  const [cart, setCart] = useState({
    items: [],
    totalItems: 0,
    subtotal: 0,
    savings: 0,
    deliveryCharge: 0,
    totalAmount: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !isCustomer) {
      setCart({ items: [], totalItems: 0, subtotal: 0, savings: 0, deliveryCharge: 0, totalAmount: 0 });
      return;
    }
    try {
      setLoading(true);
      const res = await cartAPI.getCart();
      if (res.success) {
        setCart(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isCustomer]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      showToast('Please login to add items to your cart', 'info');
      return false;
    }
    try {
      const res = await cartAPI.addItem(productId, quantity);
      if (res.success) {
        setCart(res.data);
        showToast('Item added to cart!');
        return true;
      }
    } catch (err) {
      showToast(err.message || 'Could not add to cart', 'error');
      return false;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await cartAPI.updateQuantity(productId, quantity);
      if (res.success) {
        setCart(res.data);
      }
    } catch (err) {
      showToast(err.message || 'Could not update quantity', 'error');
    }
  };

  const removeItem = async (productId) => {
    try {
      const res = await cartAPI.removeItem(productId);
      if (res.success) {
        setCart(res.data);
        showToast('Item removed from cart');
      }
    } catch (err) {
      showToast(err.message || 'Could not remove item', 'error');
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clearCart();
      setCart({ items: [], totalItems: 0, subtotal: 0, savings: 0, deliveryCharge: 0, totalAmount: 0 });
    } catch (err) {
      console.error('Could not clear cart:', err);
    }
  };

  const getItemQuantity = (productId) => {
    const item = cart.items?.find((i) => i.productId === productId);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart: fetchCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
