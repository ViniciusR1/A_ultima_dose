import { supabaseAdmin } from '../config/supabase.js';

const normalizeCpf = (value) => (value || '').toString().replace(/\D/g, '');
const isValidCpfFormat = (cpf) => {
  const digits = normalizeCpf(cpf);
  return digits.length === 11 && !/^(\d)\1{10}$/.test(digits);
};

export const getProfile = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.from('profiles').select('*').eq('id', req.user.id).single();
    if (error) return res.status(404).json({ error: 'Perfil não encontrado' });
    res.json(data);
  } catch (err) {
    console.error('Erro ao buscar perfil:', err.message, err);
    res.status(500).json({ error: 'Erro ao buscar perfil. Tente novamente.' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { full_name, phone, cpf, addresses } = req.body;
    if (cpf && !isValidCpfFormat(cpf)) {
      return res.status(400).json({ error: 'CPF inválido' });
    }
    if (addresses && !Array.isArray(addresses)) {
      return res.status(400).json({ error: 'Endereços devem ser um array' });
    }
    const payload = { full_name, phone, cpf: normalizeCpf(cpf), addresses };
    const { data, error } = await supabaseAdmin.from('profiles').update(payload).eq('id', req.user.id).select().single();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    console.error('Erro ao atualizar perfil:', err.message, err);
    res.status(500).json({ error: 'Erro ao atualizar perfil. Tente novamente.' });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.from('profiles').select('id, full_name, email, phone, cpf, role, addresses, created_at').order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Erro ao buscar usuários:', err.message, err);
    res.status(500).json({ error: 'Erro ao buscar usuários. Tente novamente.' });
  }
};

export const getUser = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.from('profiles').select('id, full_name, email, phone, cpf, role, addresses, created_at').eq('id', req.params.id).single();
    if (error) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(data);
  } catch (err) {
    console.error('Erro ao buscar usuário:', err.message, err);
    res.status(500).json({ error: 'Erro ao buscar usuário. Tente novamente.' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { full_name, phone, cpf, role, addresses } = req.body;
    if (cpf && !isValidCpfFormat(cpf)) {
      return res.status(400).json({ error: 'CPF inválido' });
    }
    if (addresses && !Array.isArray(addresses)) {
      return res.status(400).json({ error: 'Endereços devem ser um array' });
    }
    const payload = { full_name, phone, cpf: normalizeCpf(cpf), role, addresses };
    const { data, error } = await supabaseAdmin.from('profiles').update(payload).eq('id', req.params.id).select().single();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    console.error('Erro ao atualizar usuário:', err.message, err);
    res.status(500).json({ error: 'Erro ao atualizar usuário. Tente novamente.' });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const [products, orders, users] = await Promise.all([
      supabaseAdmin.from('products').select('id', { count: 'exact' }).eq('active', true),
      supabaseAdmin.from('orders').select('id, total, status', { count: 'exact' }),
      supabaseAdmin.from('profiles').select('id', { count: 'exact' }),
    ]);

    if (products.error || orders.error || users.error) {
      const error = products.error || orders.error || users.error;
      throw error;
    }

    const totalRevenue = orders.data?.filter((o) => o.status !== 'cancelled').reduce((acc, o) => acc + (o.total || 0), 0) || 0;
    res.json({
      totalProducts: products.count || 0,
      totalOrders: orders.count || 0,
      totalUsers: users.count || 0,
      totalRevenue,
      pendingOrders: orders.data?.filter((o) => o.status === 'pending').length || 0,
    });
  } catch (err) {
    console.error('Erro ao buscar estatísticas do admin:', err.message, err);
    res.status(500).json({ error: 'Erro ao carregar estatísticas. Tente novamente.' });
  }
};
