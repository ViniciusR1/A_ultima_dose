import { supabaseAdmin } from '../config/supabase.js';

export const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = supabaseAdmin.from('products').select('*').eq('active', true);
    if (category) query = query.eq('category', category);
    if (search) query = query.ilike('name', `%${search}%`);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Erro ao buscar produtos:', err.message);
    res.status(500).json({ error: 'Erro ao buscar produtos. Tente novamente.' });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.from('products').select('*').eq('id', req.params.id).single();
    if (error || !data) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(data);
  } catch (err) {
    console.error('Erro ao buscar produto:', err.message);
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, category, stock } = req.body;
    if (!name || !price || !category || stock === undefined) {
      return res.status(400).json({ error: 'Nome, preço, categoria e estoque são obrigatórios' });
    }
    if (isNaN(price) || price < 0) return res.status(400).json({ error: 'Preço deve ser um número válido' });
    if (stock < 0 || !Number.isInteger(stock)) return res.status(400).json({ error: 'Estoque deve ser um número inteiro válido' });
    
    const { data, error } = await supabaseAdmin.from('products').insert([{ ...req.body, active: true }]).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error('Erro ao criar produto:', err.message);
    res.status(400).json({ error: err.message || 'Erro ao criar produto' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { price, stock } = req.body;
    if (price !== undefined && (isNaN(price) || price < 0)) return res.status(400).json({ error: 'Preço inválido' });
    if (stock !== undefined && (stock < 0 || !Number.isInteger(stock))) return res.status(400).json({ error: 'Estoque inválido' });
    
    const { data, error } = await supabaseAdmin.from('products').update(req.body).eq('id', req.params.id).select().single();
    if (error || !data) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(data);
  } catch (err) {
    console.error('Erro ao atualizar produto:', err.message);
    res.status(400).json({ error: err.message || 'Erro ao atualizar produto' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.from('products').update({ active: false }).eq('id', req.params.id).select().single();
    if (error || !data) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json({ message: 'Produto removido com sucesso' });
  } catch (err) {
    console.error('Erro ao remover produto:', err.message);
    res.status(500).json({ error: 'Erro ao remover produto' });
  }
};
