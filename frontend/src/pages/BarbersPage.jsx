import { useEffect, useState } from 'react';
import api from '../services/api';

export default function BarbersPage() {
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ name: '', services: [] });

  const load = async () => {
    const [b, s] = await Promise.all([api.get('/barbers'), api.get('/services')]);
    setBarbers(b.data);
    setServices(s.data);
  };

  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    await api.post('/barbers', form);
    setForm({ name: '', services: [] });
    load();
  };

  const toggleService = (id) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(id) ? prev.services.filter((x) => x !== id) : [...prev.services, id]
    }));
  };

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <form className="card space-y-2" onSubmit={create}>
        <h3 className="font-semibold">Nuevo barbero</h3>
        <input className="input" placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <p className="text-sm text-slate-500">Servicios que puede realizar</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {services.map((s) => (
            <label key={s.id}><input type="checkbox" checked={form.services.includes(s.id)} onChange={() => toggleService(s.id)} /> {s.name}</label>
          ))}
        </div>
        <button className="btn-primary">Guardar</button>
      </form>
      <div className="card lg:col-span-2 space-y-2">
        {barbers.map((b) => <div key={b.id} className="p-2 rounded bg-slate-100 dark:bg-slate-800">{b.name} · {b.enabled ? 'Disponible' : 'No disponible'}</div>)}
      </div>
    </div>
  );
}
