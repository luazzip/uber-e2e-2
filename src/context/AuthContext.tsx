import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getMe } from '../api/auth';
import { type User } from '../types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    async function loadUser() {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
        return;
        }
        try {
            const me = await getMe();
            setUser(me);
        } catch {
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadUser();
    }, []);

    async function login(token: string) {
        localStorage.setItem('token', token);
        const me = await getMe();
        setUser(me);
    }

    function logout() {
        localStorage.removeItem('token');
        setUser(null);
    }

    return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
        {children}
    </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
    return ctx;
}