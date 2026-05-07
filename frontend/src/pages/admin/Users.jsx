import { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Modal from '../../components/ui/Modal';
import { api } from '../../services/api';
import { Search, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import './AdminUsers.css';

const ROLES = [
  { value: 'client', label: 'Cliente' },
  { value: 'admin', label: 'Administrador' }
];

const EMPTY_FORM = { full_name: '', phone: '', cpf: '', role: 'client', addresses: [] };

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.get('/profiles');
      setUsers(data);
    } catch { toast.error('Erro ao carregar clientes'); }
    finally { setLoading(false); }
  };

  const openEdit = (user) => {
    setEditing(user);
    setForm({
      full_name: user.full_name || '',
      phone: user.phone || '',
      cpf: user.cpf || '',
      role: user.role || 'client',
      addresses: user.addresses || []
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      await api.put(`/profiles/${editing.id}`, form);
      toast.success('Cliente atualizado!');
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error(err?.error || err?.message || 'Erro ao salvar');
    } finally { setSaving(false); }
  };

  const filtered = users.filter(user =>
    !search || user.full_name?.toLowerCase().includes(search.toLowerCase()) || user.email?.toLowerCase().includes(search.toLowerCase()) || user.cpf?.includes(search)
  );

  return (
    <AdminLayout title="Gestão de Clientes">
      <div className="admin-users">
        <div className="users-toolbar">
          <div className="search-box">
            <Search size={16} />
            <input placeholder="Buscar cliente, e-mail ou CPF" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        {loading ? (
          <p className="loading-text">Carregando clientes...</p>
        ) : filtered.length === 0 ? (
          <p className="empty-text">Nenhum cliente encontrado.</p>
        ) : (
          <div className="users-grid">
            {filtered.map(user => (
              <div key={user.id} className="user-card">
                <div className="user-card-header">
                  <div>
                    <p className="user-name">{user.full_name || 'Sem nome'}</p>
                    <p className="user-email">{user.email}</p>
                  </div>
                  <span className={`user-role ${user.role}`}>{user.role === 'admin' ? 'Admin' : 'Cliente'}</span>
                </div>
                <div className="user-card-body">
                  <p><strong>CPF:</strong> {user.cpf || '—'}</p>
                  <p><strong>Telefone:</strong> {user.phone || '—'}</p>
                  <p><strong>Endereços:</strong> {user.addresses?.length || 0}</p>
                </div>
                <div className="user-card-actions">
                  <button className="icon-btn edit" onClick={() => openEdit(user)}><Pencil size={20} />Editar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Editar Cliente" size="lg">
        <form onSubmit={handleSave} className="user-form">
          <div className="form-group">
            <label>Nome</label>
            <input required value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>CPF</label>
              <input value={form.cpf} onChange={e => setForm(p => ({ ...p, cpf: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Telefone</label>
              <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
            </div>
          </div>
          <div className="form-group">
            <label>Role</label>
            <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
              {ROLES.map(role => <option key={role.value} value={role.value}>{role.label}</option>)}
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Salvando...' : 'Salvar Cliente'}</button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}
