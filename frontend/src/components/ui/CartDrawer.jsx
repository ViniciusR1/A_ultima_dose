import { X, Trash2, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './CartDrawer.css';

export default function CartDrawer({ open, onClose }) {
  const { items, updateQty, removeItem, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      toast('Faça login para finalizar o pedido', { icon: '🔐' });
      onClose();
      navigate('/login');
      return;
    }
    onClose();
    navigate('/cliente/catalogo');
  };

  return (
    <>
      <div className={`cart-overlay ${open ? 'open' : ''}`} onClick={onClose} />
      <div className={`cart-drawer ${open ? 'open' : ''}`}>
        <div className="cart-header">
          <h3><ShoppingCart size={20} /> Carrinho</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <ShoppingCart size={48} opacity={0.3} />
            <p>Seu carrinho está vazio</p>
            <span>Adicione produtos do cardápio</span>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map(item => (
                <div key={item.id} className="cart-item">
                  {item.image_url && <img src={item.image_url} alt={item.name} />}
                  {!item.image_url && <div className="cart-item-placeholder">🍷</div>}
                  <div className="cart-item-info">
                    <p className="cart-item-name">{item.name}</p>
                    <p className="cart-item-price">R$ {(item.price * item.qty).toFixed(2)}</p>
                    <div className="cart-item-qty">
                      <button onClick={() => updateQty(item.id, item.qty - 1)}><Minus size={12} /></button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)}><Plus size={12} /></button>
                    </div>
                  </div>
                  <button className="cart-item-remove" onClick={() => removeItem(item.id)}><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
            <div className="cart-footer">
              <div className="cart-total">
                <span>Total</span>
                <strong>R$ {total.toFixed(2)}</strong>
              </div>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleCheckout}>
                {user ? 'Finalizar Pedido' : 'Entrar para Finalizar'}
              </button>
              <button className="cart-clear" onClick={() => { clearCart(); toast.success('Carrinho limpo'); }}>Limpar carrinho</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
