import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Wine, LayoutDashboard, ShoppingBag, User, BookOpen, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import './ClientLayout.css';

const navItems = [
  { to: '/cliente', label: 'Início', icon: LayoutDashboard, end: true },
  { to: '/cliente/catalogo', label: 'Catálogo', icon: BookOpen },
  { to: '/cliente/pedidos', label: 'Meus Pedidos', icon: ShoppingBag },
  { to: '/cliente/perfil', label: 'Meu Perfil', icon: User },
];

export default function ClientLayout({ children, title }) {
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    toast.success('Até logo!');
    navigate('/');
  };

  return (
    <div className="client-layout">
      <aside className="client-sidebar">
        <div className="client-sidebar-header">
          <Wine size={24} />
          <span>Adega Barrique</span>
        </div>
        <div className="client-sidebar-user">
          <div className="client-avatar">{profile?.full_name?.[0]?.toUpperCase() || 'C'}</div>
          <div>
            <p className="client-name">{profile?.full_name || 'Cliente'}</p>
            <p className="client-tag">Área do Cliente</p>
          </div>
        </div>
        <nav className="client-nav">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `client-link ${isActive ? 'active' : ''}`}>
              <Icon size={18} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <button className="client-logout" onClick={handleLogout}>
          <LogOut size={18} /><span>Sair</span>
        </button>
      </aside>
      <main className="client-main">
        <div className="client-topbar"><h1>{title}</h1></div>
        <div className="client-content">{children}</div>
      </main>
    </div>
  );
}
