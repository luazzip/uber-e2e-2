import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DriverDashboardPage from './pages/DriverDashboardPage';
import PassengerDashboardPage from './pages/PassengerDashboardPage';
import TripDetailDriverPage from './pages/TripDetailDriverPage';
import HistoryPage from './pages/HistoryPage';
import './App.css';

function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: string }) {
    const { user, loading } = useAuth();
    if (loading) return <div className="page"><p className="empty">Cargando...</p></div>;
    if (!user) return <Navigate to="/login" replace />;
    if (role && user.role !== role) return <Navigate to="/" replace />;
    return <>{children}</>;
}

function AppRoutes() {
    const { user, loading } = useAuth();

    if (loading) return <div className="page"><p className="empty">Cargando...</p></div>;

    return (
        <Routes>
            <Route path="/login" element={user ? <Navigate to={user.role === 'DRIVER' ? '/driver/dashboard' : '/passenger/dashboard'} replace /> : <LoginPage />} />
            <Route path="/driver/dashboard" element={<ProtectedRoute role="DRIVER"><DriverDashboardPage /></ProtectedRoute>} />
            <Route path="/driver/trips/:id" element={<ProtectedRoute role="DRIVER"><TripDetailDriverPage /></ProtectedRoute>} />
            <Route path="/driver/history" element={<ProtectedRoute role="DRIVER"><HistoryPage /></ProtectedRoute>} />
            <Route path="/passenger/dashboard" element={<ProtectedRoute><PassengerDashboardPage /></ProtectedRoute>} />
            <Route path="/" element={user ? <Navigate to={user.role === 'DRIVER' ? '/driver/dashboard' : '/passenger/dashboard'} replace /> : <Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}
