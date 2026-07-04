import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPendingTrips, getMyDriverTrips, acceptTrip, completeTrip } from '../api/trip';
import { type Trip } from '../types';

export default function DriverDashboardPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [pendingTrips, setPendingTrips] = useState<Trip[]>([]);
    const [myTrips, setMyTrips] = useState<Trip[]>([]);
    const [error, setError] = useState('');

    async function load() {
        try {
            const [pending, mine] = await Promise.all([
                getPendingTrips(),
                getMyDriverTrips(),
            ]);
            setPendingTrips(pending);
            setMyTrips(mine);
        } catch {
            setError('Error al cargar datos');
        }
    }

    useEffect(() => {
        load();
        const interval = setInterval(load, 5000);
        return () => clearInterval(interval);
    }, []);

    async function handleAccept(id: number) {
        try {
            await acceptTrip(id);
            navigate(`/driver/trips/${id}`);
        } catch {
            setError('No se pudo aceptar el viaje');
        }
    }

    async function handleComplete(id: number) {
        try {
            await completeTrip(id);
            load();
        } catch {
            setError('No se pudo completar el viaje');
        }
    }

    const activeTrip = myTrips.find(t => t.status === 'IN_PROGRESS');

    return (
        <div className="page">
            <header className="page-header">
                <div>
                    <h1>Conductor: {user?.firstName} {user?.lastName}</h1>
                    <p className="rating">Rating: {user?.rating.toFixed(1)} ⭐</p>
                </div>
                <button className="btn btn-outline" onClick={logout}>Cerrar sesión</button>
            </header>

            {error && <div className="alert alert-error">{error}</div>}

            {activeTrip && (
                <section className="card card-highlight">
                    <h2>Viaje activo</h2>
                    <p><strong>Origen:</strong> {activeTrip.pickupAddress}</p>
                    <p><strong>Destino:</strong> {activeTrip.dropoffAddress}</p>
                    <p><strong>Pasajero:</strong> {activeTrip.passenger.firstName} {activeTrip.passenger.lastName}</p>
                    <div className="card-actions">
                        <button className="btn btn-primary" onClick={() => navigate(`/driver/trips/${activeTrip.id}`)}>
                            Ver detalle
                        </button>
                        <button className="btn btn-success" onClick={() => handleComplete(activeTrip.id)}>
                            Completar viaje
                        </button>
                    </div>
                </section>
            )}

            <section>
                <h2>Viajes disponibles ({pendingTrips.length})</h2>
                {pendingTrips.length === 0 ? (
                    <p className="empty">No hay viajes pendientes</p>
                ) : (
                    <div className="trip-list">
                        {pendingTrips.map(trip => (
                            <div key={trip.id} className="card">
                                <p><strong>Origen:</strong> {trip.pickupAddress}</p>
                                <p><strong>Destino:</strong> {trip.dropoffAddress}</p>
                                <p><strong>Pasajero:</strong> {trip.passenger.firstName} {trip.passenger.lastName}</p>
                                <div className="card-actions">
                                    <button className="btn btn-accent" onClick={() => handleAccept(trip.id)}>
                                        Aceptar viaje
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section>
                <h2>Mis viajes</h2>
                <button className="btn btn-link" onClick={() => navigate('/driver/history')}>
                    Ver historial completo
                </button>
                {myTrips.length === 0 ? (
                    <p className="empty">Sin viajes aún</p>
                ) : (
                    <div className="trip-list">
                        {myTrips.map(trip => (
                            <div key={trip.id} className={`card status-${trip.status.toLowerCase()}`}>
                                <p><strong>Origen:</strong> {trip.pickupAddress}</p>
                                <p><strong>Destino:</strong> {trip.dropoffAddress}</p>
                                <span className={`badge badge-${trip.status.toLowerCase()}`}>{trip.status}</span>
                                <div className="card-actions">
                                    <button className="btn btn-outline" onClick={() => navigate(`/driver/trips/${trip.id}`)}>
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
