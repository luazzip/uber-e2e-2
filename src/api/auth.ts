import { api } from './client';
import { type User } from '../types';

interface AuthResponse {
    token: string;
}

interface RegisterPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'PASSENGER' | 'DRIVER';
}

interface LoginPayload {
    email: string;
    password: string;
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/register', payload);
    return res.data;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/login', payload);
    return res.data;
}

export async function getMe(): Promise<User> {
    const res = await api.get<User>('/users/me');
    return res.data;
}