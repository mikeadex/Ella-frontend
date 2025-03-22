import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CVFormProvider } from './context/CVFormContext';
import { HelmetProvider } from 'react-helmet-async';
import RootErrorBoundary from './components/ErrorBoundary/RootErrorBoundary';
import Navbar from './components/Navbar';
import ThemeSwitcher from './components/ThemeSwitcher';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Write from './pages/Write';
import Home from './pages/Home';
import Templates from './pages/Templates';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
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
import CVImprovements from './pages/cvWriter/CVImprovements';
import CVPreview from './pages/cvWriter/preview';
import CVPreviewPage from './pages/CVPreviewPage';
import About from './pages/About';
import Blog from './pages/Blog';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import Help from './pages/Help';
import Tips from './pages/Tips';
import Api from './pages/Api';
import Status from './pages/Status';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Cookies from './pages/Cookies';
import Licenses from './pages/Licenses';
import Sitemap from './pages/Sitemap';
import RouteTransition from './components/PageTransition/RouteTransition';
import Applications from './pages/Applications'; // Import Applications page
import CVVersionManager from './components/CVVersionManager'; // Import CVVersionManager
import AICVParserPage from './pages/AICVParserPage';
import CVRewriter from './components/CVRewriter';
import { Toaster } from 'react-hot-toast';

// Import global styles
import './styles/index.css';
import './styles/variables.css';
import './styles/global.css';

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="flex flex-col min-h-screen">
        <ThemeSwitcher />
        {/* <Navbar /> */}
        <div className="flex-grow">
          <RouteTransition>
            <Routes>
              {/* Public routes (no authentication required) */}
              <Route path="/" element={<Home />} />
              <Route path="/cv-writer" element={<Navigate to="/cv-writer/write" />} />
              <Route path="/cv-writer/write" element={<CVWriter />} />
              <Route path="/cv-writer/preview/:id" element={<CVPreviewPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/reset-password-confirm" element={<ResetPasswordConfirm />} />
              <Route path="/linkedin/callback" element={<LinkedInCallback />} />
              <Route path="/template-preview" element={<TemplatePreview />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/features" element={<Features />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/about" element={<About />} />
              <Route path="/blog/*" element={<Blog />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/help" element={<Help />} />
              <Route path="/tips" element={<Tips />} />
              <Route path="/api" element={<Api />} />
              <Route path="/status" element={<Status />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/licenses" element={<Licenses />} />
              <Route path="/sitemap" element={<Sitemap />} />

              {/* Protected routes (require authentication) */}
              <Route
                path="/write"
                element={
                  <ProtectedRoute>
                    <Navigate to="/cv-writer/write" />
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
                path="/cv-writer/preview/:cvId"
                element={
                  <ProtectedRoute>
                    <CVPreview />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cv-writer/improvements/:cvId"
                element={
                  <ProtectedRoute>
                    <CVImprovements />
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
                path="/ai-cv-parser"
                element={
                  <ProtectedRoute>
                    <AICVParserPage />
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
                path="/cv/:cvId/improvements"
                element={
                  <ProtectedRoute>
                    <CVImprovements />
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
              <Route
                path="/applications"
                element={
                  <ProtectedRoute>
                    <Applications />
                  </ProtectedRoute>
                }
              />
              <Route path="/cv/versions" element={<CVVersionManager />} />
              <Route path="/cv-rewriter" element={<CVRewriter />} />
            </Routes>
          </RouteTransition>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AuthProvider>
          <ThemeProvider>
            <CVFormProvider>
              <RootErrorBoundary>
                <AppRoutes />
                <Toaster 
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                    success: {
                      duration: 3000,
                      style: {
                        background: '#166534',
                      },
                    },
                    error: {
                      duration: 5000,
                      style: {
                        background: '#991b1b',
                      },
                    },
                  }}
                />
              </RootErrorBoundary>
            </CVFormProvider>
          </ThemeProvider>
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;