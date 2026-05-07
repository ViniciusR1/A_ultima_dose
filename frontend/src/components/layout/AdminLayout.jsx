import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Wine, LayoutDashboard, Package, ShoppingBag, User, LogOut, Menu, X, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import './AdminLayout.css';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/produtos', label: 'Produtos', icon: Package },
  { to: '/admin/pedidos', label: 'Pedidos', icon: ShoppingBag },
  { to: '/admin/usuarios', label: 'Clientes', icon: User },
  { to: '/admin/perfil', label: 'Meu Perfil', icon: User },
];

export default function AdminLayout({ children, title }) {
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await signOut();
    toast.success('Até logo!');
    navigate('/');
  };

  return (
    <div className={`admin-layout ${collapsed ? 'collapsed' : ''}`}>
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <Wine size={24} className="sidebar-icon" />
          {!collapsed && <span className="sidebar-brand">Adega Barrique</span>}
          <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronRight size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {!collapsed && (
          <div className="sidebar-user">
            <div className="sidebar-avatar">{profile?.full_name?.[0]?.toUpperCase() || 'A'}</div>
            <div>
              <p className="sidebar-name">{profile?.full_name || 'Administrador'}</p>
              <p className="sidebar-role">Admin</p>
            </div>
          </div>
        )}

        <nav className="sidebar-nav">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Icon size={18} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <button className="sidebar-logout" onClick={handleLogout}>
          <LogOut size={18} />
          {!collapsed && <span>Sair</span>}
        </button>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <h1 className="admin-page-title">{title}</h1>
        </div>
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
}
