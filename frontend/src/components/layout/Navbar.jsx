import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, Menu, X, Wine, User, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import './Navbar.css';

export default function Navbar({ onCartOpen }) {
  const { user, signOut, isAdmin } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    toast.success('Até logo!');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-logo">
          <Wine size={28} />
          <span>Adega Barrique</span>
        </Link>
        <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <li><a href="#cardapio" onClick={() => setMenuOpen(false)}>Cardápio</a></li>
          <li><a href="#mostruario" onClick={() => setMenuOpen(false)}>Mostruário</a></li>
          <li><a href="#localizacao" onClick={() => setMenuOpen(false)}>Localização</a></li>
          <li><a href="#contato" onClick={() => setMenuOpen(false)}>Contato</a></li>
        </ul>
        <div className="navbar-actions">
          {onCartOpen && (
            <button className="cart-btn" onClick={onCartOpen} aria-label="Carrinho">
              <ShoppingCart size={22} />
              {count > 0 && <span className="cart-badge">{count}</span>}
            </button>
          )}
          {user ? (
            <div className="user-menu" onMouseLeave={() => setDropOpen(false)}>
              <button className="user-btn" onClick={() => setDropOpen(!dropOpen)}>
                <User size={20} />
                <span>Minha Conta</span>
              </button>
              {dropOpen && (
                <div className="user-dropdown">
                  {isAdmin ? (
                    <Link to="/admin" onClick={() => setDropOpen(false)}>Painel Admin</Link>
                  ) : (
                    <>
                      <Link to="/cliente" onClick={() => setDropOpen(false)}>Dashboard</Link>
                      <Link to="/cliente/pedidos" onClick={() => setDropOpen(false)}>Meus Pedidos</Link>
                      <Link to="/cliente/perfil" onClick={() => setDropOpen(false)}>Meu Perfil</Link>
                    </>
                  )}
                  <button onClick={handleLogout}><LogOut size={14} /> Sair</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">Entrar</Link>
          )}
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
