import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientLayout from '../../components/layout/ClientLayout';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ProductCard from '../../components/ui/ProductCard';
import CartDrawer from '../../components/ui/CartDrawer';
import { api } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { ShoppingCart, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatCEP } from '../../utils/validation';
import './ClientCatalog.css';

const CATEGORIES = [
  { value: '', label: 'Todos' },
  { value: 'wine_red', label: 'Vinho Tinto' },
  { value: 'wine_white', label: 'Vinho Branco' },
  { value: 'wine_rose', label: 'Vinho Rosé' },
  { value: 'sparkling', label: 'Espumante' },
  { value: 'craft_beer', label: 'Cerveja Artesanal' },
  // { value: 'other', label: 'Outros' },
];

const FIELD_LABELS = {
  street: 'Rua/Av.',
  number: 'Número',
  neighborhood: 'Bairro',
  city: 'Cidade',
  state: 'Estado',
  zipcode: 'CEP',
};

// Checkout modal inline — sem depender de componente Modal externo
function CheckoutModal({ open, onClose, onSubmit, profile, address, setAddress, paymentMethod, setPaymentMethod, placing, errors, total }) {
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    if (profile?.addresses?.length) {
      setSelectedAddress(0);
      setAddress(profile.addresses[0]);
    }
  }, [profile]);

  if (!open) return null;

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto',
      }}
    >
      <div style={{
        background: '#fff',
        borderRadius: 12,
        width: '100%',
        maxWidth: 520,
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        overflow: 'hidden',
      }}>
        {/* Header fixo */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 24px',
          borderBottom: '1px solid #f0ebe4',
          flexShrink: 0,
        }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#2d1b1b' }}>
            Finalizar Pedido
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7a6060', padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body com scroll */}
        <form
          onSubmit={onSubmit}
          style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', flex: 1 }}
        >
          <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{ color: 'var(--text-secondary, #7a6060)', margin: 0, fontSize: '0.9rem' }}>
              Informe o endereço de entrega:
            </p>

            {/* Endereço salvo */}
            {profile?.addresses?.length > 0 && (
              <div>
                <label style={labelStyle}>Usar endereço salvo</label>
                <select
                  style={inputStyle}
                  value={selectedAddress !== null ? selectedAddress : ''}
                  onChange={(e) => {
                    const sel = e.target.value !== '' ? Number(e.target.value) : null;
                    setSelectedAddress(sel);
                    setAddress(sel !== null
                      ? profile.addresses[sel]
                      : { street: '', number: '', neighborhood: '', city: '', state: '', zipcode: '' }
                    );
                  }}
                >
                  {profile.addresses.map((addr, i) => (
                    <option key={i} value={i}>
                      {addr.label || `Endereço ${i + 1}`} — {addr.street}, {addr.city}
                    </option>
                  ))}
                  <option value="">Outro endereço</option>
                </select>
              </div>
            )}

            {/* Grid de campos: rua ocupa linha inteira, número pequeno */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
              {/* Rua */}
              <div>
                <label style={labelStyle}>RUA/AV.</label>
                <input
                  required style={inputStyle}
                  value={address.street}
                  onChange={e => setAddress(p => ({ ...p, street: e.target.value }))}
                />
                {errors.street && <span style={errorStyle}>{errors.street}</span>}
              </div>

              {/* Número + Bairro lado a lado */}
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>NÚMERO</label>
                  <input
                    required style={inputStyle}
                    value={address.number}
                    onChange={e => setAddress(p => ({ ...p, number: e.target.value }))}
                  />
                  {errors.number && <span style={errorStyle}>{errors.number}</span>}
                </div>
                <div>
                  <label style={labelStyle}>BAIRRO</label>
                  <input
                    required style={inputStyle}
                    value={address.neighborhood}
                    onChange={e => setAddress(p => ({ ...p, neighborhood: e.target.value }))}
                  />
                  {errors.neighborhood && <span style={errorStyle}>{errors.neighborhood}</span>}
                </div>
              </div>

              {/* Cidade + Estado lado a lado */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: 12 }}>
                <div>
                  <label style={labelStyle}>CIDADE</label>
                  <input
                    required style={inputStyle}
                    value={address.city}
                    onChange={e => setAddress(p => ({ ...p, city: e.target.value }))}
                  />
                  {errors.city && <span style={errorStyle}>{errors.city}</span>}
                </div>
                <div>
                  <label style={labelStyle}>ESTADO</label>
                  <input
                    required style={inputStyle} maxLength={2}
                    value={address.state}
                    onChange={e => setAddress(p => ({ ...p, state: e.target.value.toUpperCase() }))}
                  />
                  {errors.state && <span style={errorStyle}>{errors.state}</span>}
                </div>
              </div>

              {/* CEP */}
              <div>
                <label style={labelStyle}>CEP</label>
                <input
                  required style={inputStyle} placeholder="00000-000"
                  value={address.zipcode}
                  onChange={e => setAddress(p => ({ ...p, zipcode: formatCEP(e.target.value) }))}
                />
                {errors.zipcode && <span style={errorStyle}>{errors.zipcode}</span>}
              </div>

              {/* Pagamento */}
              <div>
                <label style={labelStyle}>FORMA DE PAGAMENTO</label>
                <select style={inputStyle} value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                  <option value="pix">PIX</option>
                  <option value="cartao">Cartão de Crédito</option>
                  <option value="dinheiro">Dinheiro</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer fixo com total e botão */}
          <div style={{
            flexShrink: 0,
            borderTop: '1px solid #f0ebe4',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            background: '#fff',
          }}>
            <span style={{
              fontFamily: 'var(--font-display, Georgia, serif)',
              fontSize: '1.15rem',
              fontWeight: 700,
              color: '#5c1a28',
            }}>
              Total: R$ {total.toFixed(2)}
            </span>
            <button
              type="submit"
              disabled={placing}
              style={{
                background: placing ? '#9b6673' : '#7b1f2e',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '10px 24px',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: placing ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
              }}
            >
              {placing ? 'Enviando...' : 'Confirmar Pedido'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: '0.72rem',
  fontWeight: 700,
  letterSpacing: '0.05em',
  color: '#7a6060',
  marginBottom: 5,
  textTransform: 'uppercase',
};

const inputStyle = {
  width: '100%',
  padding: '9px 12px',
  border: '1px solid #d9cfc9',
  borderRadius: 8,
  fontSize: '0.95rem',
  color: '#2d1b1b',
  background: '#faf8f5',
  boxSizing: 'border-box',
  outline: 'none',
  fontFamily: 'inherit',
};

const errorStyle = {
  display: 'block',
  color: '#dc2626',
  fontSize: '0.78rem',
  marginTop: 3,
};

export default function ClientCatalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [address, setAddress] = useState({ street: '', number: '', neighborhood: '', city: '', state: '', zipcode: '' });
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [placing, setPlacing] = useState(false);
  const [errors, setErrors] = useState({});
  const { items, total, clearCart, count } = useCart();
  const { profile, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    api.get(`/products?${params}`).then(setProducts).catch(console.error).finally(() => setLoading(false));
  }, [category, search]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Faça login para finalizar o pedido');
      setCheckoutOpen(false);
      navigate('/login');
      return;
    }

    const requiredFields = ['street', 'number', 'neighborhood', 'city', 'state', 'zipcode'];
    const newErrors = {};
    requiredFields.forEach((key) => {
      if (!address[key]) newErrors[key] = 'Campo obrigatório';
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Preencha todas as informações de entrega.');
      return;
    }

    setErrors({});
    setPlacing(true);
    try {
      await api.post('/orders', { items, address, payment_method: paymentMethod });
      toast.success('Pedido realizado com sucesso! 🍷');
      clearCart();
      setCheckoutOpen(false);
    } catch (err) {
      toast.error(err?.error || err?.message || 'Erro ao finalizar pedido');
    } finally {
      setPlacing(false);
    }
  };

  const catalogContent = (
    <div className="client-catalog">
      <div className="catalog-toolbar">
        <div className="search-box">
          <Search size={16} />
          <input placeholder="Buscar produto..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="cart-fab" onClick={() => setCartOpen(true)}>
          <ShoppingCart size={18} /> Ver Carrinho {count > 0 && <span className="fab-badge">{count}</span>}
        </button>
      </div>

      <div className="category-tabs">
        {CATEGORIES.map(c => (
          <button
            key={c.value}
            className={`cat-tab ${category === c.value ? 'active' : ''}`}
            onClick={() => setCategory(c.value)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="loading-text">Carregando produtos...</p>
      ) : (
        <div className="catalog-grid">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
          {products.length === 0 && <p className="empty-text">Nenhum produto encontrado.</p>}
        </div>
      )}

      {count > 0 && (
        <div className="checkout-bar">
          <span>{count} {count === 1 ? 'item' : 'itens'} — <strong>R$ {total.toFixed(2)}</strong></span>
          <button className="btn btn-gold" onClick={() => setCheckoutOpen(true)}>Finalizar Pedido</button>
        </div>
      )}
    </div>
  );

  const pageBody = (
    <>
      {!user && (
        <section className="public-catalog-intro" style={{ margin: '40px auto', maxWidth: 1120, padding: '0 16px' }}>
          <h1>Catálogo de Produtos</h1>
          <p>Veja nossos vinhos, espumantes e cervejas artesanais. Adicione ao carrinho agora e faça login para finalizar a compra.</p>
        </section>
      )}
      {catalogContent}
    </>
  );

  return (
    <>
      {user ? (
        <ClientLayout title="Catálogo">{pageBody}</ClientLayout>
      ) : (
        <>
          <Navbar onCartOpen={() => setCartOpen(true)} />
          <main style={{ minHeight: 'calc(100vh - 120px)', padding: '24px 16px', maxWidth: 1200, margin: '0 auto' }}>
            {pageBody}
          </main>
          <Footer />
        </>
      )}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onSubmit={handlePlaceOrder}
        profile={profile}
        address={address}
        setAddress={setAddress}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        placing={placing}
        errors={errors}
        total={total}
      />
    </>
  );
}
