import './StatusBadge.css';

const STATUS = {
  pending:    { label: 'Pendente',     color: 'yellow' },
  confirmed:  { label: 'Confirmado',   color: 'blue'   },
  preparing:  { label: 'Preparando',   color: 'purple' },
  shipped:    { label: 'Enviado',      color: 'orange' },
  delivered:  { label: 'Entregue',     color: 'green'  },
  cancelled:  { label: 'Cancelado',    color: 'red'    },
};

export default function StatusBadge({ status }) {
  const s = STATUS[status] || { label: status, color: 'gray' };
  return <span className={`status-badge status-${s.color}`}>{s.label}</span>;
}
