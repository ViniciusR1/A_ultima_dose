import { useState, useEffect } from 'react';
import ClientLayout from '../../components/layout/ClientLayout';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Link } from 'react-router-dom';
import { ShoppingBag, BookOpen, User, Clock } from 'lucide-react';
import './ClientDashboard.css';

export default function ClientDashboard() {
  const { profile } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my').then(setOrders).catch(console.error).finally(() => setLoading(false));
  }, []);

  const recent = orders.slice(0, 3);
  const totalSpent = orders.filter(o => o.status !== 'cancelled').reduce((acc, o) => acc + Number(o.total), 0);

  return (
    <ClientLayout title={`Olá, ${profile?.full_name?.split(' ')[0] || 'Cliente'}!`}>
      <div className="client-dashboard">
        <div className="stats-grid">
          <StatCard icon={ShoppingBag} label="Pedidos Realizados" value={orders.length} color="burgundy" />
          <StatCard icon={Clock} label="Pendentes" value={orders.filter(o => o.status === 'pending').length} color="gold" />
          <StatCard icon={ShoppingBag} label="Total Gasto" value={`R$ ${totalSpent.toFixed(2)}`} color="green" />
        </div>

        <div className="client-shortcuts">
          <Link to="/cliente/catalogo" className="shortcut-card">
            <BookOpen size={28} />
            <span>Ver Catálogo</span>
            <p>Explore nossa seleção de vinhos e cervejas</p>
          </Link>
          <Link to="/cliente/pedidos" className="shortcut-card">
            <ShoppingBag size={28} />
            <span>Meus Pedidos</span>
            <p>Acompanhe seus pedidos e histórico</p>
          </Link>
          <Link to="/cliente/perfil" className="shortcut-card">
            <User size={28} />
            <span>Meu Perfil</span>
            <p>Gerencie seus dados e endereços</p>
          </Link>
        </div>

        {recent.length > 0 && (
          <div className="recent-orders">
            <h3>Pedidos Recentes</h3>
            {recent.map(o => (
              <div key={o.id} className="order-row">
                <span className="order-row-id">#{o.id.slice(0,8).toUpperCase()}</span>
                <span className="order-row-date">{new Date(o.created_at).toLocaleDateString('pt-BR')}</span>
                <StatusBadge status={o.status} />
                <span className="order-row-total">R$ {Number(o.total).toFixed(2)}</span>
              </div>
            ))}
            <Link to="/cliente/pedidos" className="view-all-link">Ver todos os pedidos →</Link>
          </div>
        )}
      </div>
    </ClientLayout>
  );
}
