import { useState, useEffect } from 'react';
import ClientLayout from '../../components/layout/ClientLayout';
import StatusBadge from '../../components/ui/StatusBadge';
import { api } from '../../services/api';
import { ChevronDown, ShoppingBag } from 'lucide-react';
import './ClientOrders.css';

export default function ClientOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [period, setPeriod] = useState('all');

  useEffect(() => {
    setLoading(true);
    const url = period === 'all' ? '/orders/my' : `/orders/my?period=${period}`;
    api.get(url).then(setOrders).catch(console.error).finally(() => setLoading(false));
  }, [period]);

  const filteredOrders = orders;

  return (
    <ClientLayout title="Meus Pedidos">
      <div className="orders-period-filter">
        <button className={period === 'all' ? 'active' : ''} onClick={() => setPeriod('all')}>Todos</button>
        <button className={period === 'daily' ? 'active' : ''} onClick={() => setPeriod('daily')}>Diário</button>
        <button className={period === 'weekly' ? 'active' : ''} onClick={() => setPeriod('weekly')}>Semanal</button>
        <button className={period === 'monthly' ? 'active' : ''} onClick={() => setPeriod('monthly')}>Mensal</button>
      </div>
      {loading ? (
        <p className="loading-text">Carregando...</p>
      ) : filteredOrders.length === 0 ? (
        <div className="orders-empty-state">
          <ShoppingBag size={48} opacity={0.3} />
          <p>Você ainda não fez nenhum pedido.</p>
        </div>
      ) : (
        <div className="client-orders-list">
          {orders.map(order => (
            <div key={order.id} className="client-order-card">
              <div className="client-order-header" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                <div>
                  <span className="order-id-label">Pedido #{order.id.slice(0,8).toUpperCase()}</span>
                  <span className="order-date-label">{new Date(order.created_at).toLocaleDateString('pt-BR', { day:'2-digit', month:'long', year:'numeric' })}</span>
                </div>
                <div className="order-header-right">
                  <StatusBadge status={order.status} />
                  <span className="order-total-label">R$ {Number(order.total).toFixed(2)}</span>
                  <ChevronDown size={16} className={`exp-icon ${expanded === order.id ? 'open' : ''}`} />
                </div>
              </div>
              {expanded === order.id && (
                <div className="client-order-body">
                  <h4>Itens</h4>
                  {order.items?.map((item, i) => (
                    <div key={i} className="co-item">
                      <span>{item.name}</span>
                      <span className="co-item-qty">x{item.qty}</span>
                      <span className="co-item-price">R$ {(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                  {order.address && (
                    <div className="co-address">
                      <h4>Endereço</h4>
                      <p>{order.address.street}, {order.address.number} — {order.address.neighborhood}, {order.address.city}/{order.address.state} — CEP {order.address.zipcode}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </ClientLayout>
  );
}
