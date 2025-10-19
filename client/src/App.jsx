import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/UserContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import InvoiceList from './pages/InvoiceList';
import InvoiceForm from './pages/InvoiceForm';
import InvoiceDetail from './pages/InvoiceDetail';
import { Loader } from 'lucide-react';

// Component to protect routes requiring authentication
const ProtectedRoute = ({ children }) => {
    const { isLoggedIn, loading } = useAuth();
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 text-gray-600">
                <Loader className="animate-spin w-8 h-8 mr-2" /> Loading Authentication...
            </div>
        );
    }
    if (!isLoggedIn) {
        // Redirect unauthenticated users to the login page
        return <Navigate to="/login" replace />;
    }
    return children;
};

const AppContent = () => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />
            <main className="pt-8 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        
                        {/* Protected Routes */}
                        <Route path="/list" element={<ProtectedRoute><InvoiceList /></ProtectedRoute>} />
                        <Route path="/create" element={<ProtectedRoute><InvoiceForm /></ProtectedRoute>} />
                        <Route path="/invoice/:id" element={<ProtectedRoute><InvoiceDetail /></ProtectedRoute>} />
                        
                        {/* Catch-all Redirect */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

const App = () => (
    <Router>
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    </Router>
);

export default App;
