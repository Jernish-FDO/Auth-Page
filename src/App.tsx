import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import './App.css';

// Lazy loaded routes for faster initial load
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AuthActionPage = lazy(() => import('./pages/AuthActionPage'));

// A sleek fallback loader for Suspense
const PageLoader = () => (
  <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] flex items-center justify-center font-sans">
    <div className="w-8 h-8 border-2 border-luxury-200 dark:border-luxury-800 border-t-luxury-950 dark:border-t-white rounded-full animate-spin"></div>
  </div>
);

const Forbidden = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900 p-4">
    <h1 className="text-6xl font-black text-indigo-600 mb-4">403</h1>
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Forbidden</h2>
    <p className="text-gray-500 dark:text-gray-400 mb-8">You don't have permission to view this page.</p>
    <Navigate to="/dashboard" replace />
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            className: 'font-sans text-sm font-medium',
            style: {
              background: '#0a0a0a',
              color: '#fff',
              border: '1px solid #262626',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/auth/action" element={<AuthActionPage />} />
            <Route path="/forbidden" element={<Forbidden />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900 p-4 text-center">
                <h1 className="text-9xl font-black text-gray-200 dark:text-slate-800 absolute -z-10 select-none">404</h1>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Page Not Found</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>
                <a href="/" className="bg-indigo-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20">Go Home</a>
              </div>
            } />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  )
}

export default App
