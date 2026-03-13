export default function StatsCard({ title, value, subtitle }) {
  return (
    <div className="card">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      {subtitle && <p className="text-xs mt-2 text-slate-400">{subtitle}</p>}
    </div>
  );
}
