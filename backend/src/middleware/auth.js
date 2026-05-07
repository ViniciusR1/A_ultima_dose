import { supabaseAdmin } from '../config/supabase.js';
export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Token inválido' });
  req.user = user;
  next();
};
export const requireAdmin = async (req, res, next) => {
  const { data, error } = await supabaseAdmin.from('profiles').select('role').eq('id', req.user.id).single();
  if (error || data?.role !== 'admin') return res.status(403).json({ error: 'Acesso negado' });
  next();
};
