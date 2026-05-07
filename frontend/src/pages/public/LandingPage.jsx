import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import CartDrawer from '../../components/ui/CartDrawer';
import ProductCard from '../../components/ui/ProductCard';
import { api } from '../../services/api';
import { Wine, Star, ChevronLeft, ChevronRight, MapPin, Phone, Mail, Send, Award, Clock, Truck } from 'lucide-react';
import './LandingPage.css';

const BANNERS = [
  { title: 'Vinhos Exclusivos', sub: 'Seleção premium importada e nacional', cta: 'Ver Cardápio', bg: 'linear-gradient(135deg, #4A0F1C 0%, #6B1A2A 50%, #9B2F43 100%)' },
  { title: 'Cervejas Artesanais', sub: 'Os melhores rótulos das cervejarias locais', cta: 'Explorar', bg: 'linear-gradient(135deg, #1a2a3a 0%, #2c4a6a 50%, #1a3a5a 100%)' },
  { title: 'Espumantes & Proseccos', sub: 'Celebre cada momento com estilo', cta: 'Descobrir', bg: 'linear-gradient(135deg, #3a2a10 0%, #6a4a20 50%, #8a6030 100%)' },
];

const GALLERY = [
  { emoji: '🍷', label: 'Vinhos Tintos', desc: 'Cabernets, Malbecs e muito mais' },
  { emoji: '🥂', label: 'Espumantes', desc: 'Champagnes e Proseccos selecionados' },
  { emoji: '🍺', label: 'Cervejas Artesanais', desc: 'IPA, Stout, Weizen e muito mais' },
  { emoji: '🍾', label: 'Vinhos Brancos', desc: 'Chardonnay, Sauvignon e outros' },
  { emoji: '🌹', label: 'Vinhos Rosé', desc: 'Leveza e elegância em cada taça' },
  { emoji: '🎁', label: 'Kits & Presentes', desc: 'Combinações especiais para presentear' },
];

export default function LandingPage() {
  const [products, setProducts] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [slideIdx, setSlideIdx] = useState(0);
  const [activeCategory, setActiveCategory] = useState('');
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/products').then(setProducts).catch(console.error);
    const timer = setInterval(() => setSlideIdx(i => (i + 1) % BANNERS.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const CATS = [
    { value: '', label: 'Todos' },
    { value: 'wine_red', label: '🍷 Tintos' },
    { value: 'wine_white', label: '🍾 Brancos' },
    { value: 'wine_rose', label: '🌹 Rosé' },
    { value: 'sparkling', label: '🥂 Espumantes' },
    { value: 'craft_beer', label: '🍺 Cervejas' },
  ];

  const filtered = activeCategory ? products.filter(p => p.category === activeCategory) : products;

  const handleContact = async (e) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1000));
    setSending(false);
    setContactForm({ name: '', email: '', message: '' });
    alert('Mensagem enviada! Entraremos em contato em breve.');
  };

  return (
    <div className="landing">
      <Navbar onCartOpen={() => setCartOpen(true)} />

      {/* Hero Carousel */}
      <section className="hero">
        {BANNERS.map((b, i) => (
          <div key={i} className={`slide ${i === slideIdx ? 'active' : ''}`} style={{ background: b.bg }}>
            <div className="slide-content container">
              <div className="slide-tag">Adega Barrique</div>
              <h1>{b.title}</h1>
              <p>{b.sub}</p>
              <button className="btn btn-gold btn-lg" onClick={() => { document.getElementById('cardapio')?.scrollIntoView({ behavior: 'smooth' }); }}>
                {b.cta}
              </button>
            </div>
            <div className="slide-deco">
              <div className="deco-circle c1" />
              <div className="deco-circle c2" />
              <div className="wine-glass-icon">🍷</div>
            </div>
          </div>
        ))}
        <button className="slide-btn prev" onClick={() => setSlideIdx(i => (i - 1 + BANNERS.length) % BANNERS.length)}><ChevronLeft size={24} /></button>
        <button className="slide-btn next" onClick={() => setSlideIdx(i => (i + 1) % BANNERS.length)}><ChevronRight size={24} /></button>
        <div className="slide-dots">
          {BANNERS.map((_, i) => <button key={i} className={`dot ${i === slideIdx ? 'active' : ''}`} onClick={() => setSlideIdx(i)} />)}
        </div>
      </section>

      {/* Features bar */}
      <div className="features-bar">
        <div className="container">
          <div className="features-grid">
            <div className="feature"><Award size={22} /><span>Seleção Curada por Sommeliers</span></div>
            <div className="feature"><Truck size={22} /><span>Entrega em Recife e Região</span></div>
            <div className="feature"><Clock size={22} /><span>Seg a Sáb, 10h–22h</span></div>
            <div className="feature"><Star size={22} /><span>+500 Rótulos em Estoque</span></div>
          </div>
        </div>
      </div>

      {/* Cardápio */}
      <section id="cardapio" className="section">
        <div className="container">
          <h2 className="section-title">Nosso Cardápio</h2>
          <p className="section-subtitle">Cada garrafa conta uma história. Encontre a sua.</p>
          <div className="divider" />
          <div className="category-tabs">
            {CATS.map(c => (
              <button key={c.value} className={`cat-tab ${activeCategory === c.value ? 'active' : ''}`} onClick={() => setActiveCategory(c.value)}>
                {c.label}
              </button>
            ))}
          </div>
          <div className="products-grid">
            {filtered.slice(0, 8).map(p => <ProductCard key={p.id} product={p} />)}
            {filtered.length === 0 && <p className="no-products">Nenhum produto disponível nesta categoria.</p>}
          </div>
          {filtered.length > 8 && (
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <button className="btn btn-outline btn-lg" onClick={() => navigate('/catalogo')}>Ver Todos os Produtos</button>
            </div>
          )}
        </div>
      </section>

      {/* Mostruário */}
      <section id="mostruario" className="section section-dark">
        <div className="container">
          <h2 className="section-title" style={{ color: 'var(--gold)' }}>Nossa Adega</h2>
          <p className="section-subtitle" style={{ color: 'rgba(245,239,224,0.65)' }}>Uma curadoria para cada paladar e ocasião</p>
          <div className="divider" />
          <div className="gallery-grid">
            {GALLERY.map((g, i) => (
              <div key={i} className="gallery-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="gallery-emoji">{g.emoji}</div>
                <h3>{g.label}</h3>
                <p>{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Localização */}
      <section id="localizacao" className="section">
        <div className="container">
          <h2 className="section-title">Onde Estamos</h2>
          <p className="section-subtitle">Visite nossa adega física</p>
          <div className="divider" />
          <div className="location-grid">
            <div className="location-info">
              <div className="location-item"><MapPin size={20} className="loc-icon" /><div><strong>Endereço</strong><p>Rua das Vinhas, 42 — Boa Viagem, Recife/PE — CEP 51020-020</p></div></div>
              <div className="location-item"><Clock size={20} className="loc-icon" /><div><strong>Horário</strong><p>Segunda a Sábado: 10h às 22h<br />Domingo: 12h às 20h</p></div></div>
              <div className="location-item"><Phone size={20} className="loc-icon" /><div><strong>Telefone</strong><p><a href="tel:+5581999999999">(81) 9 9999-9999</a></p></div></div>
              <div className="location-item"><Mail size={20} className="loc-icon" /><div><strong>E-mail</strong><p><a href="mailto:contato@adegabarrique.com.br">contato@adegabarrique.com.br</a></p></div></div>
            </div>
            <div className="map-embed">
              <iframe
                title="Localização"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-34.9100%2C-8.1200%2C-34.8900%2C-8.1000&layer=mapnik"
                width="100%" height="350" style={{ border: 'none', borderRadius: 6 }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="section section-cream">
        <div className="container">
          <h2 className="section-title">Fale Conosco</h2>
          <p className="section-subtitle">Dúvidas, sugestões ou encomendas especiais</p>
          <div className="divider" />
          <div className="contact-grid">
            <form className="contact-form" onSubmit={handleContact}>
              <div className="form-group">
                <label>Nome</label>
                <input required placeholder="Seu nome" value={contactForm.name} onChange={e => setContactForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>E-mail</label>
                <input type="email" required placeholder="seu@email.com" value={contactForm.email} onChange={e => setContactForm(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Mensagem</label>
                <textarea rows={5} required placeholder="Sua mensagem..." value={contactForm.message} onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))} />
              </div>
              <button type="submit" className="btn btn-primary" disabled={sending}>
                <Send size={16} />{sending ? 'Enviando...' : 'Enviar Mensagem'}
              </button>
            </form>
            <div className="contact-whatsapp">
              <div className="wa-card">
                <div className="wa-icon">💬</div>
                <h3>Atendimento Rápido via WhatsApp</h3>
                <p>Resposta em até 30 minutos durante o horário de funcionamento</p>
                <a href="https://wa.me/5581999999999?text=Olá,%20vim%20pelo%20site%20da%20Adega%20Barrique!" target="_blank" rel="noreferrer" className="btn btn-gold btn-lg">
                  Abrir WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
