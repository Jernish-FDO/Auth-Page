import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import './App.css'

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
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
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
      </AuthProvider>
    </Router>
  )
}

export default App
