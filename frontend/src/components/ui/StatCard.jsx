import './StatCard.css';

export default function StatCard({ icon: Icon, label, value, color = 'burgundy', sub }) {
  return (
    <div className={`stat-card stat-${color}`}>
      <div className="stat-icon"><Icon size={22} /></div>
      <div className="stat-info">
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
        {sub && <p className="stat-sub">{sub}</p>}
      </div>
    </div>
  );
}
