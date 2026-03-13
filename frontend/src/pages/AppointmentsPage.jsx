import { useEffect, useState } from 'react';
import api from '../services/api';
import WeeklyCalendar from '../components/WeeklyCalendar';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [clients, setClients] = useState([]);
  const [barberFilter, setBarberFilter] = useState('');

  const load = async () => {
    const [a, b, s, c] = await Promise.all([
      api.get(`/appointments${barberFilter ? `?barberId=${barberFilter}` : ''}`),
      api.get('/barbers'),
      api.get('/services'),
      api.get('/clients')
    ]);
    setAppointments(a.data);
    setBarbers(b.data);
    setServices(s.data);
    setClients(c.data);
  };

  useEffect(() => { load(); }, [barberFilter]);

  const createAt = async (isoDate) => {
    const clientId = Number(prompt('ID del cliente'));
    const barberId = Number(prompt('ID del barbero'));
    const serviceId = Number(prompt('ID del servicio'));
    if (!clientId || !barberId || !serviceId) return;
    await api.post('/appointments', { clientId, barberId, serviceId, startAt: isoDate });
    load();
  };

  const move = async (id, date) => {
    await api.put(`/appointments/${id}`, { startAt: date });
    load();
  };

  const exportCSV = () => {
    const rows = ['Cliente,Barbero,Servicio,Inicio,Estado', ...appointments.map((a) => `${a.client_name},${a.barber_name},${a.service_name},${a.start_at},${a.status}`)];
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'citas.csv';
    link.click();
  };

  return (
    <div className="space-y-4">
      <div className="card flex flex-wrap gap-2 items-center">
        <select className="input max-w-xs" value={barberFilter} onChange={(e) => setBarberFilter(e.target.value)}>
          <option value="">Todos los barberos</option>
          {barbers.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <button className="btn-secondary" onClick={exportCSV}>Exportar citas</button>
        <div className="text-xs text-slate-500">Clientes IDs: {clients.map((c) => `${c.id}-${c.name}`).join(' | ')}</div>
        <div className="text-xs text-slate-500">Servicios IDs: {services.map((s) => `${s.id}-${s.name}`).join(' | ')}</div>
      </div>
      <WeeklyCalendar appointments={appointments} onCreate={createAt} onMove={move} />
    </div>
  );
}
