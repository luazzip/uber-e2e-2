import { api } from './client';
import { type Trip } from '../types';

export async function getMyTrips(): Promise<Trip[]> {
    const res = await api.get<Trip[]>('/trips');
    return res.data;
}

export async function getPendingTrips(): Promise<Trip[]> {
    const res = await api.get<Trip[]>('/trips/pending');
    return res.data;
}

export async function getMyDriverTrips(): Promise<Trip[]> {
    const res = await api.get<Trip[]>('/trips/my');
    return res.data;
}

export async function getTripById(id: number): Promise<Trip> {
    const res = await api.get<Trip>(`/trips/${id}`);
    return res.data;
}

export async function acceptTrip(id: number): Promise<Trip> {
    const res = await api.patch<Trip>(`/trips/${id}/accept`);
    return res.data;
}

export async function completeTrip(id: number): Promise<Trip> {
    const res = await api.patch<Trip>(`/trips/${id}/complete`);
    return res.data;
}