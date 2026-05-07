import { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabase';
import { api } from '../../services/api';
import { Save, KeyRound, User, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { isValidCPF, formatCPF } from '../../utils/validation';
import './AdminProfile.css';

export default function AdminProfile() {
  const { profile, user, fetchProfile } = useAuth();
  const [form, setForm] = useState({ full_name: '', phone: '', cpf: '' });
  const [errors, setErrors] = useState({});
  const [pwForm, setPwForm] = useState({ current: '', new_pw: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  useEffect(() => {
    if (profile) setForm({ full_name: profile.full_name || '', phone: profile.phone || '', cpf: formatCPF(profile.cpf || '') });
  }, [profile]);

  const handleSave = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.full_name.trim()) newErrors.full_name = 'Nome completo é obrigatório';
    if (!form.cpf.trim()) newErrors.cpf = 'CPF é obrigatório';
    else if (!isValidCPF(form.cpf)) newErrors.cpf = 'CPF inválido';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Corrija os erros antes de salvar');
      return;
    }

    setErrors({});
    setSaving(true);
    try {
      await api.put('/profiles/me', form);
      await fetchProfile();
      toast.success('Perfil atualizado!');
    } catch (err) {
      toast.error(err?.response?.data?.error || err.message || 'Erro ao salvar');
    } finally { setSaving(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.new_pw !== pwForm.confirm) { toast.error('As senhas não coincidem'); return; }
    if (pwForm.new_pw.length < 6) { toast.error('A senha deve ter pelo menos 6 caracteres'); return; }
    setChangingPw(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: pwForm.new_pw });
      if (error) throw error;
      toast.success('Senha alterada com sucesso!');
      setPwForm({ current: '', new_pw: '', confirm: '' });
    } catch (err) { toast.error(err.message || 'Erro ao alterar senha'); }
    finally { setChangingPw(false); }
  };

  return (
    <AdminLayout title="Meu Perfil">
      <div className="admin-profile">
        <div className="profile-card">
          <div className="profile-card-header">
            <User size={18} />
            <h3>Dados Pessoais</h3>
          </div>
          <form onSubmit={handleSave} className="profile-form">
            <div className="form-group">
              <label>E-mail</label>
              <input type="email" value={user?.email || ''} disabled />
              <span className="form-hint">O e-mail não pode ser alterado.</span>
            </div>
            <div className="form-group">
              <label>Nome Completo</label>
              <input type="text" value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label>CPF</label>
              <input type="text" placeholder="000.000.000-00" value={form.cpf} onChange={e => setForm(p => ({ ...p, cpf: formatCPF(e.target.value) }))} required />
              {errors.cpf && <span className="error-msg"><AlertCircle size={14} />{errors.cpf}</span>}
            </div>
            <div className="form-group">
              <label>Telefone</label>
              <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={16} />{saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </form>
        </div>

        <div className="profile-card">
          <div className="profile-card-header">
            <KeyRound size={18} />
            <h3>Alterar Senha</h3>
          </div>
          <form onSubmit={handleChangePassword} className="profile-form">
            <div className="form-group">
              <label>Nova Senha</label>
              <input type="password" value={pwForm.new_pw} onChange={e => setPwForm(p => ({ ...p, new_pw: e.target.value }))} required minLength={6} />
            </div>
            <div className="form-group">
              <label>Confirmar Nova Senha</label>
              <input type="password" value={pwForm.confirm} onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} required minLength={6} />
            </div>
            <button type="submit" className="btn btn-outline" disabled={changingPw}>
              <KeyRound size={16} />{changingPw ? 'Alterando...' : 'Alterar Senha'}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
