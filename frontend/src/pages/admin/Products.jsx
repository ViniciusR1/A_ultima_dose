import { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Modal from '../../components/ui/Modal';
import { api } from '../../services/api';
import { Plus, Pencil, Trash2, Search, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import './AdminProducts.css';

const CATEGORIES = [
  { value: 'wine_red', label: 'Vinho Tinto' },
  { value: 'wine_white', label: 'Vinho Branco' },
  { value: 'wine_rose', label: 'Vinho Rosé' },
  { value: 'sparkling', label: 'Espumante' },
  { value: 'craft_beer', label: 'Cerveja Artesanal' },
  { value: 'other', label: 'Outros' },
];

const EMPTY_FORM = { name: '', description: '', price: '', category: 'wine_red', image_url: '', stock: '', alcohol_content: '', volume: '' };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const data = await api.get('/products');
      setProducts(data);
    } catch { toast.error('Erro ao carregar produtos'); }
    finally { setLoading(false); }
  };

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (p) => { setEditing(p); setForm({ name: p.name, description: p.description || '', price: p.price, category: p.category, image_url: p.image_url || '', stock: p.stock, alcohol_content: p.alcohol_content || '', volume: p.volume || '' }); setModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock), alcohol_content: form.alcohol_content ? parseFloat(form.alcohol_content) : null, volume: form.volume ? parseInt(form.volume) : null };
      if (editing) { await api.put(`/products/${editing.id}`, payload); toast.success('Produto atualizado!'); }
      else { await api.post('/products', payload); toast.success('Produto criado!'); }
      setModalOpen(false);
      fetchProducts();
    } catch (err) { toast.error(err.error || 'Erro ao salvar produto'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Produto removido');
    } catch { toast.error('Erro ao remover'); }
    finally { setDeleteId(null); }
  };

  const filtered = products.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout title="Gestão de Produtos">
      <div className="admin-products">
        <div className="products-toolbar">
          <div className="search-box">
            <Search size={16} />
            <input placeholder="Buscar produto..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={openCreate}>
            <Plus size={16} /> Novo Produto
          </button>
        </div>

        {loading ? <p className="loading-text">Carregando...</p> : (
          <div className="products-grid">
            {filtered.map(p => (
              <div key={p.id} className="product-row">
                <div className="product-row-img">
                  {p.image_url ? <img src={p.image_url} alt={p.name} /> : <Package size={24} />}
                </div>
                <div className="product-row-info">
                  <span className="product-row-name">{p.name}</span>
                  <span className="product-row-cat">{CATEGORIES.find(c => c.value === p.category)?.label || p.category}</span>
                </div>
                <div className="product-row-stock">
                  <span className={`stock-indicator ${p.stock === 0 ? 'out' : p.stock < 5 ? 'low' : 'ok'}`}>{p.stock} un.</span>
                </div>
                <div className="product-row-price">R$ {Number(p.price).toFixed(2)}</div>
                <div className="product-row-actions">
                  <button className="icon-btn edit" onClick={() => openEdit(p)}><Pencil size={15} /></button>
                  <button className="icon-btn delete" onClick={() => setDeleteId(p.id)}><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Produto' : 'Novo Produto'} size="lg">
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-row">
            <div className="form-group">
              <label>Nome *</label>
              <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Categoria *</label>
              <select required value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Descrição</label>
            <textarea rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Preço (R$) *</label>
              <input type="number" step="0.01" min="0" required value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Estoque *</label>
              <input type="number" min="0" required value={form.stock} onChange={e => setForm(p => ({ ...p, stock: e.target.value }))} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Teor Alcoólico (%)</label>
              <input type="number" step="0.1" min="0" value={form.alcohol_content} onChange={e => setForm(p => ({ ...p, alcohol_content: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Volume (ml)</label>
              <input type="number" min="0" value={form.volume} onChange={e => setForm(p => ({ ...p, volume: e.target.value }))} />
            </div>
          </div>
          <div className="form-group">
            <label>URL da Imagem</label>
            <input type="url" value={form.image_url} onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))} placeholder="https://..." />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Salvando...' : editing ? 'Atualizar' : 'Criar Produto'}</button>
          </div>
        </form>
      </Modal>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Confirmar Remoção" size="sm">
        <p style={{ marginBottom: 24, color: 'var(--text-secondary)' }}>Tem certeza que deseja remover este produto? Esta ação não pode ser desfeita.</p>
        <div className="form-actions">
          <button className="btn btn-outline" onClick={() => setDeleteId(null)}>Cancelar</button>
          <button className="btn btn-primary" style={{ background: '#dc2626', borderColor: '#dc2626' }} onClick={() => handleDelete(deleteId)}>Remover</button>
        </div>
      </Modal>
    </AdminLayout>
  );
}
