import { TrendingUp } from 'lucide-react';


export default function StatCard({
  label,
  value,
  trend,
  note,
  icon,
  tone,
}: {
  label: string;
  value: string;
  trend: string;
  note: string;
  icon: React.ReactNode;
  tone: string;
}) {
  return (
    <article className="stat-card">
      <div className="stat-top">
        <span>{label}</span>
        <span className={`stat-icon ${tone}`}>{icon}</span>
      </div>
      <strong className="stat-value">{value}</strong>
      <div className="stat-foot">
        <span className="trend-pill">
          <TrendingUp size={12} /> {trend}
        </span>
        <span>{note}</span>
      </div>
    </article>
  );
}