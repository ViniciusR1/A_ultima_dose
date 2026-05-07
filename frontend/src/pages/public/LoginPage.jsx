import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Wine, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import './AuthPages.css';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(form.email, form.password);
      toast.success('Bem-vindo(a) de volta!');
      const profile = await api.get('/profiles/me');
      navigate(profile?.role === 'admin' ? '/admin' : '/cliente', { replace: true });
    } catch (err) {
      toast.error(err.message || err.error || 'E-mail ou senha incorretos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">
          <Wine size={28} /><span>Adega Barrique</span>
        </Link>
        <h1>Bem-vindo(a) de volta</h1>
        <p className="auth-sub">Entre na sua conta para continuar</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>E-mail</label>
            <input
              type="email" required autoComplete="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label>Senha</label>
            <div className="password-field">
              <input
                type={showPw ? 'text' : 'password'} required
                autoComplete="current-password" placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              />
              <button type="button" onClick={() => setShowPw(!showPw)}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="auth-footer">
          Não tem conta? <Link to="/cadastro">Cadastre-se gratuitamente</Link>
        </p>
        <Link to="/" className="back-link">← Voltar ao site</Link>
      </div>

      <div className="auth-visual">
        <div className="auth-visual-content">
          <div className="auth-quote">"O vinho é a poesia da terra."</div>
          <div className="auth-quote-author">— Mario Soldati</div>
        </div>
      </div>
    </div>
  );
}
