import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';
import type { Trip, User } from '../types';

export default function RequestTripPage() {
    const [drivers, setDrivers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [pickupAddress, setPickupAddress] = useState('');
    const [dropoffAddress, setDropoffAddress] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadDrivers();
    }, []);

    async function loadDrivers(){
        try {
            const response = await api.get('/drivers/available')

            console.log(response.data);
            setDrivers(response.data);
        } catch (error) {
            console.error('Error al cargar conductores', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleRequesTrip(){
        if (!pickupAddress || !dropoffAddress){
            alert('Debes ingresar el origen y destino del viaje');
            return;
        }

        try {
            const response = await api.post<Trip>('/trips', {
                pickupAddress,
                dropoffAddress
            });

            navigate(`/passenger/trips/${response.data.id}`);
        } catch (error) {
            console.error('Error al solicitar viaje', error);
            alert('No se pudo solicitar el viaje. Intente nuevamente.');
        }
    }

    return (
        <div className="page">
            <h1>Solicitar viaje</h1>
            <h2>Conductores disponibles</h2>
            {loading ? (
                <p>Cargando...</p>
            ) : drivers.length === 0 ? (
                <p>No hay conductores disponibles.</p>
            ) : (
                <ul>
                    {drivers.map(driver => (
                        <li key={driver.id}>
                            {driver.firstName} {driver.lastName} ⭐ {driver.rating}
                        </li>
                    ))}
                </ul>
            )}

            <hr />

            <h2>Solicitar viaje</h2>

            <div>
                <label>Origen</label>
                <input
                    type="text"
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                />
            </div>

            <div>
                <label>Destino</label>
                <input
                    type="text"
                    value={dropoffAddress}
                    onChange={(e) => setDropoffAddress(e.target.value)}
                />
            </div>

            <button onClick={handleRequesTrip}>
                Solicitar viaje
            </button>
        </div>
    )
}