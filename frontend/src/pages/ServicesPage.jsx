import { useEffect, useState } from 'react';
import api from '../services/api';

export default function ServicesPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', duration: 30, price: 15, enabled: true });
  const load = () => api.get('/services').then((r) => setItems(r.data));
  useEffect(load, []);

  const create = async (e) => {
    e.preventDefault();
    await api.post('/services', form);
    setForm({ name: '', duration: 30, price: 15, enabled: true });
    load();
  };

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <form onSubmit={create} className="card space-y-2">
        <h3 className="font-semibold">Nuevo servicio</h3>
        <input className="input" placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="input" type="number" placeholder="Duración (min)" value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} required />
        <input className="input" type="number" placeholder="Precio" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required />
        <button className="btn-primary">Agregar</button>
      </form>
      <div className="card lg:col-span-2 space-y-2">
        {items.map((s) => <div key={s.id} className="p-2 rounded bg-slate-100 dark:bg-slate-800">{s.name} · {s.duration} min · €{s.price}</div>)}
      </div>
    </div>
  );
}
