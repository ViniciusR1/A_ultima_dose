import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Wine, Eye, EyeOff, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import './AuthPages.css';

const formatCPF = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0,3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6)}`;
  return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6,9)}-${d.slice(9)}`;
};

const formatCEP = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 8);
  return d.length <= 5 ? d : `${d.slice(0,5)}-${d.slice(5)}`;
};

const normalizeDigits = (v) => (v || '').replace(/\D/g, '');

export default function RegisterPage() {
  const [form, setForm] = useState({
    full_name: '', cpf: '', phone: '',
    email: '', password: '', confirm: '',
    street: '', number: '', neighborhood: '',
    city: '', state: '', zipcode: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handle = (field, transform) => (e) =>
    setForm(p => ({ ...p, [field]: transform ? transform(e.target.value) : e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};

    if (!form.full_name.trim()) errs.full_name = 'Obrigatório';
    if (!form.cpf.trim()) errs.cpf = 'Obrigatório';
    if (!form.email.trim()) errs.email = 'Obrigatório';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'E-mail inválido';
    if (!form.password) errs.password = 'Obrigatório';
    else if (form.password.length < 6) errs.password = 'Mínimo 6 caracteres';
    if (!form.confirm) errs.confirm = 'Obrigatório';
    else if (form.password !== form.confirm) errs.confirm = 'Senhas não conferem';
    if (!form.street.trim()) errs.street = 'Obrigatório';
    if (!form.number.trim()) errs.number = 'Obrigatório';
    if (!form.neighborhood.trim()) errs.neighborhood = 'Obrigatório';
    if (!form.city.trim()) errs.city = 'Obrigatório';
    if (!form.state.trim()) errs.state = 'Obrigatório';
    if (!form.zipcode.trim()) errs.zipcode = 'Obrigatório';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error('Corrija os erros no formulário');
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      await signUp(
        form.email,
        form.password,
        form.full_name,
        form.phone,
        normalizeDigits(form.cpf),
        [{
          label: 'Endereço principal',
          street: form.street,
          number: form.number,
          neighborhood: form.neighborhood,
          city: form.city,
          state: form.state,
          zipcode: normalizeDigits(form.zipcode),
        }]
      );
      toast.success('Conta criada! Verifique seu e-mail para ativar.');
      navigate('/login');
    } catch (err) {
      toast.error(err.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">
          <Wine size={24} /><span>Adega Barrique</span>
        </Link>
        <h1>Criar Conta</h1>
        <p className="auth-sub">Junte-se à nossa comunidade de apreciadores</p>

        <form onSubmit={handleSubmit} className="auth-form">

          <div className="form-group">
            <label>Nome Completo *</label>
            <input required placeholder="Seu nome completo"
              value={form.full_name} onChange={handle('full_name')} />
            {errors.full_name && <span className="error-msg"><AlertCircle size={12}/>{errors.full_name}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>CPF *</label>
              <input required placeholder="000.000.000-00"
                value={form.cpf} onChange={handle('cpf', formatCPF)} />
              {errors.cpf && <span className="error-msg"><AlertCircle size={12}/>{errors.cpf}</span>}
            </div>
            <div className="form-group">
              <label>Telefone</label>
              <input type="tel" placeholder="(81) 9 9999-9999"
                value={form.phone} onChange={handle('phone')} />
            </div>
          </div>

          <div className="form-group">
            <label>E-mail *</label>
            <input type="email" required autoComplete="email" placeholder="seu@email.com"
              value={form.email} onChange={handle('email')} />
            {errors.email && <span className="error-msg"><AlertCircle size={12}/>{errors.email}</span>}
          </div>

          <div className="form-section-label">Endereço de Entrega</div>

          <div className="form-row street-row">
            <div className="form-group">
              <label>Rua / Avenida *</label>
              <input required placeholder="Rua das Vinhas"
                value={form.street} onChange={handle('street')} />
              {errors.street && <span className="error-msg"><AlertCircle size={12}/>{errors.street}</span>}
            </div>
            <div className="form-group">
              <label>Número *</label>
              <input required placeholder="42"
                value={form.number} onChange={handle('number')} />
              {errors.number && <span className="error-msg"><AlertCircle size={12}/>{errors.number}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Bairro *</label>
              <input required placeholder="Boa Viagem"
                value={form.neighborhood} onChange={handle('neighborhood')} />
              {errors.neighborhood && <span className="error-msg"><AlertCircle size={12}/>{errors.neighborhood}</span>}
            </div>
            <div className="form-group">
              <label>Cidade *</label>
              <input required placeholder="Recife"
                value={form.city} onChange={handle('city')} />
              {errors.city && <span className="error-msg"><AlertCircle size={12}/>{errors.city}</span>}
            </div>
          </div>

          <div className="form-row cep-row">
            <div className="form-group">
              <label>Estado *</label>
              <input required placeholder="PE" maxLength={2}
                value={form.state}
                onChange={e => setForm(p => ({ ...p, state: e.target.value.toUpperCase() }))} />
              {errors.state && <span className="error-msg"><AlertCircle size={12}/>{errors.state}</span>}
            </div>
            <div className="form-group">
              <label>CEP *</label>
              <input required placeholder="00000-000"
                value={form.zipcode} onChange={handle('zipcode', formatCEP)} />
              {errors.zipcode && <span className="error-msg"><AlertCircle size={12}/>{errors.zipcode}</span>}
            </div>
          </div>

          <div className="form-section-label">Senha</div>

          <div className="form-row">
            <div className="form-group">
              <label>Senha *</label>
              <div className="password-field">
                <input type={showPw ? 'text' : 'password'} required
                  autoComplete="new-password" placeholder="Mínimo 6 caracteres"
                  value={form.password} onChange={handle('password')} />
                <button type="button" onClick={() => setShowPw(v => !v)}>
                  {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
              {errors.password && <span className="error-msg"><AlertCircle size={12}/>{errors.password}</span>}
            </div>
            <div className="form-group">
              <label>Confirmar Senha *</label>
              <input type="password" required placeholder="Repita a senha"
                value={form.confirm} onChange={handle('confirm')} />
              {errors.confirm && <span className="error-msg"><AlertCircle size={12}/>{errors.confirm}</span>}
            </div>
          </div>

          <button type="submit" className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>

        <p className="auth-footer">Já tem conta? <Link to="/login">Entrar</Link></p>
        <Link to="/" className="back-link">← Voltar ao site</Link>
      </div>

      <div className="auth-visual">
        <div className="auth-visual-content">
          <div className="auth-quote">"O vinho é uma conversa que nunca acaba."</div>
          <div className="auth-quote-author">— Anônimo</div>
        </div>
      </div>
    </div>
  );
}
