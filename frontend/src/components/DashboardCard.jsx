export default function DashboardCard({ title, value, icon }) {
  return (
    <div className="dashboard-card">
      <div className="card-icon">{icon}</div>
      <div>
        <p className="card-label">{title}</p>
        <h3>{value}</h3>
      </div>
    </div>
  );
}
