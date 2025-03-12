import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import { useAuth } from './context/AuthContext';

// Layout components
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CabinDirectory from './pages/CabinDirectory';
import CabinDetail from './pages/CabinDetail';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/AdminDashboard';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  // Show loading state while checking authentication
  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</Box>;
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Admin route component
const AdminRoute = ({ children }) => {
  const { user, loading, isGlobalAdmin } = useAuth();
  
  // Show loading state while checking authentication
  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</Box>;
  }
  
  // Redirect to dashboard if not admin
  if (!user || !isGlobalAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function App() {
  const { user } = useAuth();
  
  return (
    <>
      <CssBaseline />
      <Routes>
        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" replace />} />
        </Route>
        
        {/* Protected routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/cabins" element={
            <ProtectedRoute>
              <CabinDirectory />
            </ProtectedRoute>
          } />
          
          <Route path="/cabins/:id" element={
            <ProtectedRoute>
              <CabinDetail />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
        </Route>
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
