import { Calendar, Scissors, Users, UserSquare, LayoutDashboard, Moon, Sun } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/citas', label: 'Citas', icon: Calendar },
  { to: '/clientes', label: 'Clientes', icon: Users },
  { to: '/barberos', label: 'Barberos', icon: UserSquare },
  { to: '/servicios', label: 'Servicios', icon: Scissors }
];

export default function Layout() {
  const { pathname } = useLocation();
  const { logout, user } = useAuth();
  const [dark, setDark] = useState(false);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setDark((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex">
      <aside className="w-64 hidden md:block p-4 border-r border-slate-200 dark:border-slate-800">
        <h1 className="text-xl font-bold mb-6">Barber SaaS</h1>
        <nav className="space-y-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} className={`flex gap-2 p-2 rounded-lg ${pathname === to ? 'bg-indigo-600 text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-800'}`}>
              <Icon size={16} /> {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1 p-4 md:p-6">
        <header className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm text-slate-500">Bienvenido</p>
            <h2 className="font-semibold">{user?.name || 'Administrador'}</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={toggleTheme} className="btn-secondary">{dark ? <Sun size={16} /> : <Moon size={16} />}</button>
            <button onClick={logout} className="btn-secondary">Salir</button>
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
