import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/client';
import type { Trip } from '../types';

export default function TripDetailPassengerPage() {
    const { id } = useParams();

    const [trip, setTrip] = useState<Trip | null>(null);
    const [loading, setLoading] = useState(true);

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [sending, setSending] = useState(false);

    async function loadTrip() {
        try {
            const response = await api.get<Trip>(`/trips/${id}`);
            setTrip(response.data);
        } catch (error) {
            console.error('Error al cargar el viaje', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadTrip();

        const interval = setInterval(async () => {
            const response = await api.get<Trip>(`/trips/${id}`);
            setTrip(response.data);

            if (response.data.status === 'COMPLETED') {
                clearInterval(interval);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [id]);

    async function handleRateTrip() {
        if (sending) return;

        setSending(true);

        try {
            await api.post(`/trips/${id}/rate`, {
                rating,
                comment,
            });

            await loadTrip();
        } catch (error) {
            console.error('Error al calificar el viaje', error);
            alert('No se pudo registrar la calificación.');
        } finally {
            setSending(false);
        }
    }

    if (loading) {
        return (
            <div className="page">
                <p>Cargando viaje...</p>
            </div>
        );
    }

    if (!trip) {
        return (
            <div className="page">
                <p>No se encontró el viaje.</p>
            </div>
        );
    }

    return (
        <div className="page">

            <h1>🚖 Detalle del viaje</h1>

            <div className="trip-card">

                <h2>Información del viaje</h2>

                <p>
                    <strong>📍 Origen</strong><br />
                    {trip.pickupAddress}
                </p>

                <p>
                    <strong>🏁 Destino</strong><br />
                    {trip.dropoffAddress}
                </p>

                <p>
                    <strong>🚦 Estado:</strong> {trip.status}
                </p>

            </div>

            <div className="trip-card">

                <h2>Conductor</h2>

                {trip.driver ? (
                    <>
                        <p>
                            👤 {trip.driver.firstName} {trip.driver.lastName}
                        </p>

                        <p>
                            ⭐ {trip.driver.rating}
                        </p>
                    </>
                ) : (
                    <p>🔍 Buscando conductor...</p>
                )}

            </div>

            {trip.status === 'COMPLETED' &&
                trip.passengerRating === null && (

                    <div className="trip-card">

                        <h2>⭐ Calificar viaje</h2>

                        <div className="form-group">
                            <label>Calificación</label>

                            <select
                                value={rating}
                                onChange={(e) => setRating(Number(e.target.value))}
                            >
                                <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                                <option value={4}>⭐⭐⭐⭐ (4)</option>
                                <option value={3}>⭐⭐⭐ (3)</option>
                                <option value={2}>⭐⭐ (2)</option>
                                <option value={1}>⭐ (1)</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Comentario</label>

                            <textarea
                                rows={4}
                                placeholder="Escribe tu opinión sobre el viaje..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </div>

                        <button
                            className="btn"
                            onClick={handleRateTrip}
                            disabled={sending}
                        >
                            {sending ? 'Enviando...' : 'Calificar viaje'}
                        </button>

                    </div>
                )}

            {trip.passengerRating !== null && (

                <div className="trip-card">

                    <h2>⭐ Tu calificación</h2>

                    <p>
                        <strong>Puntuación:</strong> {trip.passengerRating}/5
                    </p>

                    <p>
                        <strong>Comentario:</strong>
                    </p>

                    <div className="comment-box">
                        {trip.ratingComment || 'Sin comentario'}
                    </div>

                </div>
            )}

        </div>
    );
}