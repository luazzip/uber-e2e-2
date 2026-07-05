import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getMyTrips } from '../api/trip';
import { type Trip } from '../types';

export default function PassengerDashboardPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [trips, setTrips] = useState<Trip[]>([]);
    const [error, setError] = useState('');

    async function load() {
        try {
            const data = await getMyTrips();
            setTrips(data);
        } catch {
            setError('Error al cargar tus viajes');
        }
    }

    useEffect(() => {
        load();
    }, []);

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
                <button className="btn" onClick={() => navigate('/passenger/request')}>
                    Solicitar viaje
                </button>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <section>
                <h2>Mis viajes</h2>
                <button className="btn btn-link" onClick={() => navigate('/passenger/history')}>
                    Ver historial completo
                </button>

                {trips.length === 0 ? (
                    <p className="empty">Aún no tienes viajes</p>
                ) : (
                    <div className="trip-list">
                        {trips.map(trip => (
                            <div key={trip.id} className={`card status-${trip.status.toLowerCase()}`}>
                                <p><strong>Origen:</strong> {trip.pickupAddress}</p>
                                <p><strong>Destino:</strong> {trip.dropoffAddress}</p>
                                <span className={`badge badge-${trip.status.toLowerCase()}`}>{trip.status}</span>
                                <div className="card-actions">
                                    <button className="btn btn-outline" onClick={() => navigate(`/passenger/trips/${trip.id}`)}>
                                        Ver detalle
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}