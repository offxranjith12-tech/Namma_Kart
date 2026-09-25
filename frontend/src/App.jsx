import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Products } from './pages/Products';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Orders } from './pages/Orders';
import { OrderDetails } from './pages/OrderDetails';
import { Wishlist } from './pages/Wishlist';
import { Profile } from './pages/Profile';
import { Addresses } from './pages/Addresses';
import { Notifications } from './pages/Notifications';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminDeliveryPersons } from './pages/admin/AdminDeliveryPersons';
import { AdminDeliverySlots } from './pages/admin/AdminDeliverySlots';
import { AdminCoupons } from './pages/admin/AdminCoupons';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';

// Delivery Pages
import { DeliveryDashboard } from './pages/delivery/DeliveryDashboard';
import { DeliveryOrders } from './pages/delivery/DeliveryOrders';
import { DeliveryOrderDetails } from './pages/delivery/DeliveryOrderDetails';
import { DeliveryHistory } from './pages/delivery/DeliveryHistory';
import { DeliveryProfile } from './pages/delivery/DeliveryProfile';

// Protected Route Helpers
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading application...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export const App = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ flex: 1 }}>
        <Routes>
          {/* Public & Customer Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          
          <Route
            path="/checkout"
            element={
              <ProtectedRoute allowedRoles={['ROLE_CUSTOMER', 'ROLE_ADMIN']}>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute allowedRoles={['ROLE_CUSTOMER', 'ROLE_ADMIN']}>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute allowedRoles={['ROLE_CUSTOMER', 'ROLE_ADMIN', 'ROLE_DELIVERY_PERSON']}>
                <OrderDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute allowedRoles={['ROLE_CUSTOMER', 'ROLE_ADMIN']}>
                <Wishlist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['ROLE_CUSTOMER', 'ROLE_ADMIN']}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addresses"
            element={
              <ProtectedRoute allowedRoles={['ROLE_CUSTOMER', 'ROLE_ADMIN']}>
                <Addresses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <AdminOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <AdminProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <AdminCategories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/delivery-persons"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <AdminDeliveryPersons />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/delivery-slots"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <AdminDeliverySlots />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/coupons"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <AdminCoupons />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <AdminAnalytics />
              </ProtectedRoute>
            }
          />

          {/* Delivery Person Routes */}
          <Route
            path="/delivery"
            element={
              <ProtectedRoute allowedRoles={['ROLE_DELIVERY_PERSON']}>
                <DeliveryDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/delivery/orders"
            element={
              <ProtectedRoute allowedRoles={['ROLE_DELIVERY_PERSON']}>
                <DeliveryOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/delivery/orders/:id"
            element={
              <ProtectedRoute allowedRoles={['ROLE_DELIVERY_PERSON']}>
                <DeliveryOrderDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/delivery/history"
            element={
              <ProtectedRoute allowedRoles={['ROLE_DELIVERY_PERSON']}>
                <DeliveryHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/delivery/profile"
            element={
              <ProtectedRoute allowedRoles={['ROLE_DELIVERY_PERSON']}>
                <DeliveryProfile />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};
