import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import ClientsPage from './pages/ClientsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import BarbersPage from './pages/BarbersPage';
import ServicesPage from './pages/ServicesPage';
import LoginPage from './pages/LoginPage';
import PublicBookingPage from './pages/PublicBookingPage';
import { useAuth } from './context/AuthContext';

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="p-4">Cargando sesión...</p>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/reservar" element={<PublicBookingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <Protected>
            <Layout />
          </Protected>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="citas" element={<AppointmentsPage />} />
        <Route path="clientes" element={<ClientsPage />} />
        <Route path="barberos" element={<BarbersPage />} />
        <Route path="servicios" element={<ServicesPage />} />
      </Route>
    </Routes>
  );
}
