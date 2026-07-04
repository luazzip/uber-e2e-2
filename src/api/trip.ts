import { api } from './client';
import {type Trip } from '../types';

export async function getMyTrips(): Promise<Trip[]> {
    const res = await api.get<Trip[]>('/trips');
    return res.data;
}