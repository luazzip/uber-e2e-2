import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTripById, completeTrip } from '../api/trip';
import { type Trip } from '../types';

export default function TripDetailDriverPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [trip, setTrip] = useState<Trip | null>(null);
    const [error, setError] = useState('');

    async function load() {
        if (!id) return;
        try {
            const data = await getTripById(Number(id));
            setTrip(data);
        } catch {
            setError('Error al cargar el viaje');
        }
    }

    useEffect(() => {
        load();
        const interval = setInterval(load, 4000);
        return () => clearInterval(interval);
    }, [id]);

    async function handleComplete() {
        if (!trip) return;
        try {
            await completeTrip(trip.id);
            load();
        } catch {
            setError('No se pudo completar el viaje');
        }
    }

    if (error) return <div className="page"><div className="alert alert-error">{error}</div></div>;
    if (!trip) return <div className="page"><p className="empty">Cargando...</p></div>;

    return (
        <div className="page">
            <header className="page-header">
                <h1>Detalle del viaje #{trip.id}</h1>
                <button className="btn btn-outline" onClick={() => navigate('/driver/dashboard')}>
                    Volver al dashboard
                </button>
            </header>

            <div className="card">
                <p><strong>Estado:</strong> <span className={`badge badge-${trip.status.toLowerCase()}`}>{trip.status}</span></p>
                <p><strong>Origen:</strong> {trip.pickupAddress}</p>
                <p><strong>Destino:</strong> {trip.dropoffAddress}</p>
                <p><strong>Solicitado:</strong> {new Date(trip.requestedAt).toLocaleString()}</p>
                {trip.acceptedAt && <p><strong>Aceptado:</strong> {new Date(trip.acceptedAt).toLocaleString()}</p>}
                {trip.completedAt && <p><strong>Completado:</strong> {new Date(trip.completedAt).toLocaleString()}</p>}

                <h3>Pasajero</h3>
                <p>{trip.passenger.firstName} {trip.passenger.lastName} — {trip.passenger.email}</p>
            </div>

            {trip.status === 'IN_PROGRESS' && (
                <div className="card-actions" style={{ marginTop: 16 }}>
                    <button className="btn btn-success" onClick={handleComplete}>
                        Completar viaje
                    </button>
                </div>
            )}

            {trip.status === 'COMPLETED' && (
                <div className="card">
                    <h3>Viaje completado</h3>
                    <p>El viaje ha finalizado. Gracias por tu servicio.</p>
                </div>
            )}
        </div>
    );
}
