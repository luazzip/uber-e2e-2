import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginApi, register as registerApi } from '../api/auth';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isRegister, setIsRegister] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'PASSENGER' | 'DRIVER'>('PASSENGER');
    const [error, setError] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        try {
            const res = isRegister
                ? await registerApi({ firstName, lastName, email, password, role })
                : await loginApi({ email, password });
            await login(res.token);
            navigate(role === 'DRIVER' ? '/driver/dashboard' : '/');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Error de autenticación');
        }
    }

    return (
        <div className="page page-center">
            <div className="card card-form">
                <h1>{isRegister ? 'Registro' : 'Iniciar sesión'}</h1>
                {error && <div className="alert alert-error">{error}</div>}
                <form onSubmit={handleSubmit}>
                    {isRegister && (
                        <>
                            <label>Nombre
                                <input value={firstName} onChange={e => setFirstName(e.target.value)} required />
                            </label>
                            <label>Apellido
                                <input value={lastName} onChange={e => setLastName(e.target.value)} required />
                            </label>
                        </>
                    )}
                    <label>Email
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </label>
                    <label>Contraseña
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
                    </label>
                    {isRegister && (
                        <label>Rol
                            <select value={role} onChange={e => setRole(e.target.value as 'PASSENGER' | 'DRIVER')}>
                                <option value="PASSENGER">Pasajero</option>
                                <option value="DRIVER">Conductor</option>
                            </select>
                        </label>
                    )}
                    <button type="submit" className="btn btn-primary btn-full">
                        {isRegister ? 'Registrarse' : 'Ingresar'}
                    </button>
                </form>
                <p className="switch-auth">
                    {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
                    <button className="btn btn-link" onClick={() => setIsRegister(!isRegister)}>
                        {isRegister ? 'Inicia sesión' : 'Regístrate'}
                    </button>
                </p>
            </div>
        </div>
    );
}
