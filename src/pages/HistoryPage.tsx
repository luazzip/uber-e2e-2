import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyTrips, getMyDriverTrips } from '../api/trip';
import { type Trip, type TripStatus } from '../types';

const STATUSES: (TripStatus | 'ALL')[] = ['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED'];

export default function HistoryPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [trips, setTrips] = useState<Trip[]>([]);
    const [filter, setFilter] = useState<TripStatus | 'ALL'>('ALL');
    const [error, setError] = useState('');

    useEffect(() => {
        async function load() {
            try {
                const data = user?.role === 'DRIVER' ? await getMyDriverTrips() : await getMyTrips();
                setTrips(data);
            } catch {
                setError('Error al cargar historial');
            }
        }
        load();
    }, [user]);

    const filtered = filter === 'ALL' ? trips : trips.filter(t => t.status === filter);

    const backRoute = user?.role === 'DRIVER' ? '/driver/dashboard' : '/passenger/dashboard';

    return (
        <div className="page">
            <header className="page-header">
                <h1>Historial de viajes</h1>
                <button className="btn btn-outline" onClick={() => navigate(backRoute)}>
                    Volver
                </button>
            </header>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="filter-bar">
                {STATUSES.map(s => (
                    <button
                        key={s}
                        className={`btn btn-filter ${filter === s ? 'active' : ''}`}
                        onClick={() => setFilter(s)}
                    >
                        {s === 'ALL' ? 'Todos' : s}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <p className="empty">No hay viajes {filter !== 'ALL' ? `con estado ${filter}` : ''}</p>
            ) : (
                <table className="history-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Origen</th>
                            <th>Destino</th>
                            <th>Estado</th>
                            <th>Fecha</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(trip => (
                            <tr key={trip.id}>
                                <td>{trip.id}</td>
                                <td>{trip.pickupAddress}</td>
                                <td>{trip.dropoffAddress}</td>
                                <td><span className={`badge badge-${trip.status.toLowerCase()}`}>{trip.status}</span></td>
                                <td>{new Date(trip.requestedAt).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        className="btn btn-outline btn-sm"
                                        onClick={() => navigate(
                                            user?.role === 'DRIVER'
                                                ? `/driver/trips/${trip.id}` //del driver ya está
                                                : `/passenger/trips/${trip.id}` //faltaa
                                        )}
                                    >
                                        Detalle
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
