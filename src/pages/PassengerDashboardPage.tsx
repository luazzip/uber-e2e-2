import { useAuth } from '../context/AuthContext';

export default function PassengerDashboardPage() {
    const { user, logout } = useAuth();

    return (
        <div className="page">
            <header className="page-header">
                <div>
                    <h1>Pasajero: {user?.firstName} {user?.lastName}</h1>
                </div>
                <button className="btn btn-outline" onClick={logout}>Cerrar sesión</button>
            </header>
            <p className="empty">espacio para el dashboard de pasajerooo</p>
        </div>
    );
}
