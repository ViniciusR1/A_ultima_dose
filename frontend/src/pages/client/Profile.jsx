import { useState, useEffect } from 'react';
import ClientLayout from '../../components/layout/ClientLayout';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabase';
import { api } from '../../services/api';
import { Save, KeyRound, User, MapPin, Plus, Trash2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { isValidCPF, formatCPF } from '../../utils/validation';
import './ClientProfile.css';

const EMPTY_ADDRESS = { label: '', street: '', number: '', neighborhood: '', city: '', state: '', zipcode: '' };

export default function ClientProfile() {
  const { profile, user, fetchProfile } = useAuth();
  const [form, setForm] = useState({ full_name: '', phone: '', cpf: '' });
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState(null);
  const [errors, setErrors] = useState({});
  const [pwForm, setPwForm] = useState({ new_pw: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({ full_name: profile.full_name || '', phone: profile.phone || '', cpf: formatCPF(profile.cpf || '') });
      setAddresses(profile.addresses || []);
    }
  }, [profile]);

  const handleSave = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.full_name.trim()) newErrors.full_name = 'Nome completo é obrigatório';
    if (!form.cpf.trim()) newErrors.cpf = 'CPF é obrigatório';
    else if (!isValidCPF(form.cpf)) newErrors.cpf = 'CPF inválido';
    if (addresses.some(addr => !addr.street || !addr.number || !addr.neighborhood || !addr.city || !addr.state || !addr.zipcode)) {
      newErrors.addresses = 'Todos os endereços devem estar completos';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Corrija os erros antes de salvar');
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      await api.put('/profiles/me', { ...form, addresses });
      await fetchProfile();
      toast.success('Perfil atualizado!');
    } catch (err) {
      toast.error(err?.response?.data?.error || err.message || 'Erro ao salvar');
    } finally { setSaving(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.new_pw !== pwForm.confirm) { toast.error('As senhas não coincidem'); return; }
    setChangingPw(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: pwForm.new_pw });
      if (error) throw error;
      toast.success('Senha alterada!');
      setPwForm({ new_pw: '', confirm: '' });
    } catch (err) { toast.error(err.message); } finally { setChangingPw(false); }
  };

  const addAddress = () => { if (newAddress) { setAddresses(prev => [...prev, newAddress]); setNewAddress(null); } };
  const updateAddress = (index, key, value) => setAddresses(prev => prev.map((addr, idx) => idx === index ? { ...addr, [key]: value } : addr));
  const removeAddress = (i) => setAddresses(prev => prev.filter((_, idx) => idx !== i));

  return (
    <ClientLayout title="Meu Perfil">
      <div className="client-profile">
        <div className="profile-section">
          <div className="section-label"><User size={16} /> Dados Pessoais</div>
          <form onSubmit={handleSave} className="profile-form">
            <div className="form-group">
              <label>E-mail</label>
              <input type="email" value={user?.email || ''} disabled />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Nome Completo</label>
                <input required value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} />
                {errors.full_name && <span className="error-msg"><AlertCircle size={14} />{errors.full_name}</span>}
              </div>
              <div className="form-group">
                <label>CPF</label>
                <input required placeholder="000.000.000-00" value={form.cpf} onChange={e => setForm(p => ({ ...p, cpf: formatCPF(e.target.value) }))} />
                {errors.cpf && <span className="error-msg"><AlertCircle size={14} />{errors.cpf}</span>}
              </div>
            </div>
            <div className="form-group">
              <label>Telefone</label>
              <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}><Save size={15} />{saving ? 'Salvando...' : 'Salvar'}</button>
          </form>
        </div>

        <div className="profile-section">
          <div className="section-label"><MapPin size={16} /> Endereços de Entrega</div>
          {addresses.map((addr, i) => (
            <div key={i} className="address-card address-card-edit">
              <div className="address-card-fields">
                <div className="form-row">
                  <div className="form-group">
                    <label>Apelido</label>
                    <input value={addr.label || ''} onChange={e => updateAddress(i, 'label', e.target.value)} placeholder="Casa, Trabalho..." />
                  </div>
                  <div className="form-group">
                    <label>CEP</label>
                    <input value={addr.zipcode || ''} onChange={e => updateAddress(i, 'zipcode', e.target.value)} placeholder="00000-000" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Rua / Av.</label>
                    <input value={addr.street || ''} onChange={e => updateAddress(i, 'street', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Número</label>
                    <input value={addr.number || ''} onChange={e => updateAddress(i, 'number', e.target.value)} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Bairro</label>
                    <input value={addr.neighborhood || ''} onChange={e => updateAddress(i, 'neighborhood', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Cidade</label>
                    <input value={addr.city || ''} onChange={e => updateAddress(i, 'city', e.target.value)} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Estado</label>
                    <input value={addr.state || ''} onChange={e => updateAddress(i, 'state', e.target.value)} />
                  </div>
                  <div className="form-group address-remove-group">
                    <label>&nbsp;</label>
                    <button type="button" className="icon-btn delete" onClick={() => removeAddress(i)}><Trash2 size={14} /> Remover</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {errors.addresses && <span className="error-msg"><AlertCircle size={14} />{errors.addresses}</span>}
          {newAddress ? (
            <div className="new-address-form">
              {Object.keys(EMPTY_ADDRESS).map(key => (
                <div key={key} className="form-group">
                  <label>{key === 'label' ? 'Apelido (Casa, Trabalho...)' : key}</label>
                  <input value={newAddress[key]} onChange={e => setNewAddress(p => ({ ...p, [key]: e.target.value }))} />
                </div>
              ))}
              <div className="form-actions-row">
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setNewAddress(null)}>Cancelar</button>
                <button type="button" className="btn btn-primary btn-sm" onClick={addAddress}>Adicionar</button>
              </div>
            </div>
          ) : (
            <button type="button" className="add-address-btn" onClick={() => setNewAddress({ ...EMPTY_ADDRESS })}>
              <Plus size={16} /> Adicionar Endereço
            </button>
          )}
          {addresses.length > 0 && (
            <button type="button" className="btn btn-primary btn-sm" style={{ marginTop: 8 }} onClick={handleSave} disabled={saving}>
              <Save size={14} />{saving ? 'Salvando...' : 'Salvar Endereços'}
            </button>
          )}
        </div>

        <div className="profile-section">
          <div className="section-label"><KeyRound size={16} /> Alterar Senha</div>
          <form onSubmit={handleChangePassword} className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label>Nova Senha</label>
                <input type="password" required minLength={6} value={pwForm.new_pw} onChange={e => setPwForm(p => ({ ...p, new_pw: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Confirmar Senha</label>
                <input type="password" required minLength={6} value={pwForm.confirm} onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} />
              </div>
            </div>
            <button type="submit" className="btn btn-outline" disabled={changingPw}><KeyRound size={15} />{changingPw ? 'Alterando...' : 'Alterar Senha'}</button>
          </form>
        </div>
      </div>
    </ClientLayout>
  );
}
