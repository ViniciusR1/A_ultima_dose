import { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import StatusBadge from '../../components/ui/StatusBadge';
import { api } from '../../services/api';
import { ChevronDown, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import './AdminOrders.css';

const STATUS_OPTIONS = ['pending','confirmed','preparing','shipped','delivered','cancelled'];
const PERIOD_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'daily', label: 'Diário' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensal' },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [period, setPeriod] = useState('all');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => { fetchOrders(); }, [filterStatus, period]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (period && period !== 'all') params.set('period', period);
      if (filterStatus) params.set('status', filterStatus);
      const query = params.toString() ? `?${params.toString()}` : '';
      const data = await api.get(`/orders${query}`);
      setOrders(data);
    } catch {
      toast.error('Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/orders/${id}/status`, { status });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      toast.success('Status atualizado');
    } catch {
      toast.error('Erro ao atualizar status');
    }
  };

  const filtered = orders.filter(o => {
    const matchSearch = !search || o.id.includes(search) || o.profiles?.full_name?.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  return (
    <AdminLayout title="Gestão de Pedidos">
      <div className="admin-orders">
        <div className="orders-filters">
          <div className="search-box">
            <Search size={16} />
            <input placeholder="Buscar por cliente ou ID..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select value={period} onChange={e => setPeriod(e.target.value)} className="filter-select">
            {PERIOD_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="filter-select">
            <option value="">Todos os status</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="orders-loading">Carregando pedidos...</div>
        ) : filtered.length === 0 ? (
          <div className="orders-empty">Nenhum pedido encontrado.</div>
        ) : (
          <div className="orders-list">
            {filtered.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-card-header" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                  <div className="order-id">
                    <span className="order-num">#{order.id.slice(0,8).toUpperCase()}</span>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="order-meta">
                    <span className="order-client">{order.profiles?.full_name || 'Cliente'}</span>
                    <span className="order-date">{new Date(order.created_at).toLocaleDateString('pt-BR')}</span>
                    <span className="order-total">R$ {Number(order.total).toFixed(2)}</span>
                  </div>
                  <ChevronDown size={16} className={`expand-icon ${expanded === order.id ? 'rotated' : ''}`} />
                </div>

                {expanded === order.id && (
                  <div className="order-card-body">
                    <div className="order-items-list">
                      <h4>Itens do Pedido</h4>
                      {order.items?.map((item, i) => (
                        <div key={i} className="order-item-row">
                          <span>{item.name}</span>
                          <span>x{item.qty}</span>
                          <span>R$ {(item.price * item.qty).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    {order.address && (
                      <div className="order-address">
                        <h4>Endereço de Entrega</h4>
                        <p>{order.address.street}, {order.address.number} — {order.address.neighborhood}, {order.address.city}/{order.address.state}</p>
                      </div>
                    )}
                    <div className="order-payment-info">
                      <h4>Pagamento</h4>
                      <p>{order.payment_method === 'pix' ? 'PIX' : order.payment_method === 'cartao' ? 'Cartão de Crédito' : 'Dinheiro'}</p>
                      <p>Status: {order.payment_status || 'pendente'}</p>
                    </div>
                    <div className="order-status-change">
                      <h4>Atualizar Status</h4>
                      <div className="status-buttons">
                        {STATUS_OPTIONS.map(s => (
                          <button
                            key={s}
                            className={`status-btn ${order.status === s ? 'active' : ''}`}
                            onClick={() => updateStatus(order.id, s)}
                          >{s}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
