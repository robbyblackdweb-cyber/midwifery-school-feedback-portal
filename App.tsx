import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import SubmitFeedback from './pages/SubmitFeedback';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Layout from './components/Layout';
import { AuthProvider, useAuth } from './services/authContext';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/submit" element={<Layout><SubmitFeedback /></Layout>} />
          <Route path="/admin/login" element={<Layout><AdminLogin /></Layout>} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <Layout isAdmin><AdminDashboard /></Layout>
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;