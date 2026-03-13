import { useEffect, useState } from 'react';
import api from '../services/api';
import StatsCard from '../components/StatsCard';

export default function DashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/dashboard').then((res) => setData(res.data));
  }, []);

  if (!data) return <p>Cargando dashboard...</p>;

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-4 gap-4">
        <StatsCard title="Citas de hoy" value={data.citasHoy} />
        <StatsCard title="Clientes totales" value={data.totalClientes} />
        <StatsCard title="Ingresos semanales" value={`€ ${data.ingresosSemanales}`} />
        <StatsCard title="Servicios populares" value={data.serviciosPopulares[0]?.name || '-'} />
      </div>
      <div className="card">
        <h3 className="font-semibold mb-3">Próximas citas</h3>
        <div className="space-y-2">
          {data.proximasCitas.map((item) => (
            <div key={item.id} className="flex justify-between text-sm border-b pb-1 border-slate-200 dark:border-slate-800">
              <span>{item.cliente} · {item.servicio}</span><span>{new Date(item.start_at).toLocaleString('es-ES')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
