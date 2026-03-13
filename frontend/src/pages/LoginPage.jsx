import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'admin@barber.com', password: '123456' });
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch {
      setError('No se pudo iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-slate-100 dark:from-slate-900 dark:to-slate-950 p-4">
      <form onSubmit={submit} className="card w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold">Acceso al panel</h1>
        <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input" type="password" placeholder="Contraseña" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button className="btn-primary w-full">Entrar</button>
      </form>
    </div>
  );
}
