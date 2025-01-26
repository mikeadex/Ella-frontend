import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Write from './pages/Write';
import Home from './pages/Home';
import Subscription from './pages/Subscription';
import CVParserPage from './pages/CVParserPage';
import LinkedInTest from './pages/LinkedInTest';
import LinkedInCallback from './pages/LinkedInCallback';
import ResetPassword from './pages/ResetPassword';
import ResetPasswordConfirm from './pages/ResetPasswordConfirm';
import Logout from './pages/Logout';
import ProtectedRoute from './components/ProtectedRoute';
import CVWriter from './pages/cvWriter/write';
import CVTemplates from './pages/CVTemplates';
import TemplatePreview from './shared/pages/TemplatePreview';

// Import global styles
import './styles/index.css';
import './styles/variables.css';
import './styles/global.css';

function AppRoutes() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            {/* Public routes (no authentication required) */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/reset-password-confirm" element={<ResetPasswordConfirm />} />
            <Route path="/linkedin/callback" element={<LinkedInCallback />} />
            <Route path="/template-preview" element={<TemplatePreview />} />

            {/* Protected routes (require authentication) */}
            <Route
              path="/write"
              element={
                <ProtectedRoute>
                  <Write />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cv-writer/write"
              element={
                <ProtectedRoute>
                  <CVWriter />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/subscription"
              element={
                <ProtectedRoute>
                  <Subscription />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cv-parser"
              element={
                <ProtectedRoute>
                  <CVParserPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/linkedin-test"
              element={
                <ProtectedRoute>
                  <LinkedInTest />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cv-templates"
              element={
                <ProtectedRoute>
                  <CVTemplates />
                </ProtectedRoute>
              }
            />
            <Route
              path="/logout"
              element={
                <ProtectedRoute>
                  <Logout />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;