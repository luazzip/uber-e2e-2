import { useAuth } from '../context/AuthContext';
import {useNavigate} from 'react-router-dom';

export default function PassengerDashboardPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="page">
            <header className="page-header">
                <div>
                    <h1>Pasajero: {user?.firstName} {user?.lastName}</h1>
                </div>
                <button className="btn btn-outline" onClick={logout}>Cerrar sesión</button>
            </header>
            <div className="card">
                <h2>Bienvenido</h2>
                <p>Desde aquí podrás solicitar un nuevo viaje.</p>
                <button className="btn" onClick={() => navigate('/passenger/request')}> Solicitar viaje </button></div>
        </div>
    );
}
