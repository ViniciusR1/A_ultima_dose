import { supabaseAdmin } from '../config/supabase.js';

const periodFilter = (query, period) => {
  if (!period) return query;
  const now = new Date();
  let from;
  if (period === 'daily') {
    from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else if (period === 'weekly') {
    const day = now.getDay();
    from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day);
  } else if (period === 'monthly') {
    from = new Date(now.getFullYear(), now.getMonth(), 1);
  }
  if (from) {
    query = query.gte('created_at', from.toISOString());
  }
  return query;
};

const validateAddress = (address) => {
  return address && address.street && address.number && address.neighborhood && address.city && address.state && address.zipcode;
};

export const createOrder = async (req, res) => {
  try {
    const { items, address, payment_method } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Carrinho vazio' });
    }
    if (!validateAddress(address)) {
      return res.status(400).json({ error: 'Endereço de entrega incompleto' });
    }
    if (!['pix', 'cartao', 'dinheiro'].includes(payment_method)) {
      return res.status(400).json({ error: 'Método de pagamento inválido' });
    }

    const productIds = items.map((item) => item.id);
    const { data: products, error: productsError } = await supabaseAdmin
      .from('products')
      .select('*')
      .in('id', productIds);

    if (productsError) throw productsError;
    if (!products || products.length === 0) {
      return res.status(400).json({ error: 'Nenhum produto válido encontrado no carrinho' });
    }

    const productMap = new Map(products.map((product) => [product.id, product]));
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = productMap.get(item.id);
      if (!product) {
        return res.status(400).json({ error: `Produto não encontrado: ${item.id}` });
      }
      if (typeof item.qty !== 'number' || item.qty <= 0 || !Number.isInteger(item.qty)) {
        return res.status(400).json({ error: 'Quantidade inválida em um item' });
      }
      if (product.stock < item.qty) {
        return res.status(400).json({ error: `Estoque insuficiente para ${product.name}` });
      }
      const itemTotal = Number(product.price) * item.qty;
      total += itemTotal;
      orderItems.push({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        qty: item.qty,
        image_url: product.image_url,
        category: product.category,
      });
    }

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .insert([{
        user_id: req.user.id,
        items: orderItems,
        address,
        total,
        status: 'pending',
        payment_method,
        payment_status: 'pending',
      }])
      .select()
      .single();

    if (error) throw error;

    // Atualizar estoque produto por produto (evita upsert com conflito)
    for (const item of orderItems) {
      const currentStock = productMap.get(item.id).stock - item.qty;
      const { error: stockError } = await supabaseAdmin
        .from('products')
        .update({ stock: currentStock })
        .eq('id', item.id);
      if (stockError) {
        console.error('Falha ao atualizar estoque de', item.name, ':', stockError.message);
      }
    }

    res.status(201).json(order);
  } catch (err) {
    console.error('Erro ao criar pedido:', err.message, err);
    res.status(500).json({ error: err.message || 'Erro ao criar pedido. Tente novamente.' });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const { period } = req.query;
    let query = supabaseAdmin
      .from('orders')
      .select('*')
      .eq('user_id', req.user.id);
    query = periodFilter(query, period);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Erro ao buscar pedidos do usuário:', err.message, err);
    res.status(500).json({ error: 'Erro ao buscar pedidos. Tente novamente.' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { period, status } = req.query;

    // 1. Buscar pedidos sem join
    let query = supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);
    query = periodFilter(query, period);

    const { data: orders, error: ordersError } = await query;
    if (ordersError) throw ordersError;

    if (!orders || orders.length === 0) {
      return res.json([]);
    }

    // 2. Buscar perfis dos usuários separadamente
    const userIds = [...new Set(orders.map((o) => o.user_id))];
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, email, cpf')
      .in('id', userIds);

    if (profilesError) {
      console.error('Erro ao buscar perfis:', profilesError.message);
      // Retorna pedidos sem dados de perfil ao invés de falhar
      return res.json(orders.map((o) => ({ ...o, profiles: null })));
    }

    // 3. Fazer o join manualmente
    const profileMap = new Map((profiles || []).map((p) => [p.id, p]));
    const ordersWithProfiles = orders.map((o) => ({
      ...o,
      profiles: profileMap.get(o.user_id) || null,
    }));

    res.json(ordersWithProfiles);
  } catch (err) {
    console.error('Erro ao buscar todos os pedidos:', err.message, err);
    res.status(500).json({ error: 'Erro ao buscar pedidos. Tente novamente.' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status é obrigatório' });
    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ status })
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Erro ao atualizar status do pedido:', err.message, err);
    res.status(500).json({ error: 'Erro ao atualizar status do pedido' });
  }
};
