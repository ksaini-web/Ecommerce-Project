import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductDetail = lazy(() => import('./pages/products/ProductDetail'));
const ProductList = lazy(() => import('./pages/products/ProductList'));
const CartPage = lazy(() => import('./pages/cart/CartPage'));
const OrderHistory = lazy(() => import('./pages/orders/OrderHistory'));
const OrderSuccess = lazy(() => import('./pages/orders/OrderSuccess'));

// Auth Pages
const UserLogin = lazy(() => import('./pages/auth/UserLogin'));
const UserSignup = lazy(() => import('./pages/auth/UserSignup'));
const SellerLogin = lazy(() => import('./pages/auth/SellerLogin'));
const SellerSignup = lazy(() => import('./pages/auth/SellerSignup'));

// Seller Pages
const SellerDashboard = lazy(() => import('./pages/seller/SellerDashboard'));
const SellerAnalytics = lazy(() => import('./pages/seller/SellerAnalytics'));
const AddProduct = lazy(() => import('./pages/seller/AddProduct'));

// Protected Route
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner label="Loading page" />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/:id" element={<ProductDetail />} />

              {/* Auth Routes */}
              <Route path="/login" element={<UserLogin />} />
              <Route path="/signup" element={<UserSignup />} />
              <Route path="/seller/login" element={<SellerLogin />} />
              <Route path="/seller/signup" element={<SellerSignup />} />

              {/* User Protected Routes */}
              <Route path="/cart" element={<ProtectedRoute role="user"><CartPage /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute role="user"><OrderHistory /></ProtectedRoute>} />
              <Route path="/orders/success" element={<ProtectedRoute role="user"><OrderSuccess /></ProtectedRoute>} />
              <Route path="/orders/success/:id" element={<ProtectedRoute role="user"><OrderSuccess /></ProtectedRoute>} />

              {/* Seller Protected Routes */}
              <Route path="/seller/dashboard" element={<ProtectedRoute role="seller"><SellerDashboard /></ProtectedRoute>} />
              <Route path="/seller/analytics" element={<ProtectedRoute role="seller"><SellerAnalytics /></ProtectedRoute>} />
              <Route path="/seller/add-product" element={<ProtectedRoute role="seller"><AddProduct /></ProtectedRoute>} />
              <Route path="/seller/products/:id/edit" element={<ProtectedRoute role="seller"><AddProduct /></ProtectedRoute>} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
