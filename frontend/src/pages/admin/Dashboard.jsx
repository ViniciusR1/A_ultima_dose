import { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import { api } from '../../services/api';
import { Package, ShoppingBag, Users, DollarSign, Clock } from 'lucide-react';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/profiles/admin/stats'),
      api.get('/orders'),
    ]).then(([s, o]) => {
      setStats(s);
      setRecentOrders(o.slice(0, 5));
    }).catch(console.error)
    .finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminLayout title="Dashboard"><p className="loading-text">Carregando...</p></AdminLayout>;

  return (
    <AdminLayout title="Dashboard">
      <div className="admin-dashboard">
        <div className="stats-grid">
          <StatCard icon={DollarSign} label="Receita Total" value={`R$ ${stats?.totalRevenue?.toFixed(2) || '0,00'}`} color="burgundy" />
          <StatCard icon={ShoppingBag} label="Total de Pedidos" value={stats?.totalOrders || 0} sub={`${stats?.pendingOrders || 0} pendentes`} color="gold" />
          <StatCard icon={Package} label="Produtos Ativos" value={stats?.totalProducts || 0} color="green" />
          <StatCard icon={Users} label="Clientes" value={stats?.totalUsers || 0} color="blue" />
        </div>

        <div className="recent-orders-section">
          <h2 className="section-heading">Pedidos Recentes</h2>
          {recentOrders.length === 0 ? (
            <p className="empty-text">Nenhum pedido ainda.</p>
          ) : (
            <div className="recent-orders-table">
              <div className="table-head">
                <span>ID</span><span>Cliente</span><span>Total</span><span>Status</span><span>Data</span>
              </div>
              {recentOrders.map(o => (
                <div key={o.id} className="table-row">
                  <span className="mono">#{o.id.slice(0,8).toUpperCase()}</span>
                  <span>{o.profiles?.full_name || '—'}</span>
                  <span className="price">R$ {Number(o.total).toFixed(2)}</span>
                  <StatusBadge status={o.status} />
                  <span className="date">{new Date(o.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
