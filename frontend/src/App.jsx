import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RequirementList from './pages/RequirementList';
import AdminPanel from './pages/AdminPanel';
import StudentProfile from './pages/StudentProfile';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/requirements" element={
            <ProtectedRoute>
              <Layout>
                <RequirementList />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute requiredRole="ADMIN">
              <Layout>
                <AdminPanel />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/hr" element={
            <ProtectedRoute requiredRole="HR">
              <Layout>
                <RequirementList /> {/* Reuse for now, can be specialized */}
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/staff" element={
            <ProtectedRoute requiredRole="STAFF">
              <Layout>
                <RequirementList />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/student-profile" element={
            <ProtectedRoute requiredRole="STUDENT">
              <Layout>
                <StudentProfile />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/unauthorized" element={
            <div className="text-center mt-4">
              <h1>403 - Unauthorized</h1>
              <p>You do not have permission to view this page.</p>
            </div>
          } />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
