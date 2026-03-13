import { useEffect, useState } from 'react';
import api from '../services/api';

export default function PublicBookingPage() {
  const [meta, setMeta] = useState({ services: [], barbers: [] });
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState({ clientName: '', phone: '', serviceId: '', barberId: '', date: '', startAt: '' });
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api.get('/public/metadata').then((res) => setMeta(res.data));
  }, []);

  const loadSlots = async () => {
    if (!form.barberId || !form.serviceId || !form.date) return;
    const { data } = await api.get(`/appointments/available-slots?barberId=${form.barberId}&serviceId=${form.serviceId}&date=${form.date}`);
    setSlots(data);
  };

  useEffect(() => { loadSlots(); }, [form.barberId, form.serviceId, form.date]);

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/public/book', form);
    setSuccess('Reserva confirmada. ¡Gracias!');
  };

  return (
    <div className="min-h-screen p-4 bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
      <form onSubmit={submit} className="card w-full max-w-xl space-y-3">
        <h1 className="text-2xl font-bold">Reserva online</h1>
        <input className="input" placeholder="Tu nombre" value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} required />
        <input className="input" placeholder="Teléfono" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
        <div className="grid md:grid-cols-2 gap-2">
          <select className="input" value={form.serviceId} onChange={(e) => setForm({ ...form, serviceId: e.target.value })} required>
            <option value="">Selecciona servicio</option>
            {meta.services.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.duration} min)</option>)}
          </select>
          <select className="input" value={form.barberId} onChange={(e) => setForm({ ...form, barberId: e.target.value })} required>
            <option value="">Selecciona barbero</option>
            {meta.barbers.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        <input className="input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
        <select className="input" value={form.startAt} onChange={(e) => setForm({ ...form, startAt: e.target.value })} required>
          <option value="">Selecciona horario</option>
          {slots.map((slot) => <option key={slot} value={slot}>{new Date(slot).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</option>)}
        </select>
        <button className="btn-primary w-full">Confirmar reserva</button>
        {success && <p className="text-green-600">{success}</p>}
      </form>
    </div>
  );
}
