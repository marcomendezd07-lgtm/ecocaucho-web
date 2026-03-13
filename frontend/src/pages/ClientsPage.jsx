import { useEffect, useState } from 'react';
import api from '../services/api';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', notes: '' });

  const load = async () => {
    const { data } = await api.get(`/clients?search=${search}`);
    setClients(data);
  };

  useEffect(() => { load(); }, [search]);

  const create = async (e) => {
    e.preventDefault();
    await api.post('/clients', form);
    setForm({ name: '', phone: '', notes: '' });
    load();
  };

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <form onSubmit={create} className="card space-y-2">
        <h3 className="font-semibold">Nuevo cliente</h3>
        <input className="input" placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="input" placeholder="Teléfono" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
        <textarea className="input" placeholder="Notas" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        <button className="btn-primary">Guardar</button>
      </form>
      <div className="card lg:col-span-2">
        <input className="input mb-3" placeholder="Buscar por nombre o teléfono" value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="space-y-2">
          {clients.map((c) => <div key={c.id} className="p-2 rounded bg-slate-100 dark:bg-slate-800 text-sm">{c.name} · {c.phone} · visitas: {c.visitas}</div>)}
        </div>
      </div>
    </div>
  );
}
