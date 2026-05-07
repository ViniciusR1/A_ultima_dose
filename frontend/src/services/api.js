import { supabase } from './supabase';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const getHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    'Content-Type': 'application/json',
    ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` })
  };
};

export const api = {
  get: async (path) => {
    const res = await fetch(`${API_URL}${path}`, { headers: await getHeaders() });
    if (!res.ok) throw await res.json();
    return res.json();
  },
  post: async (path, body) => {
    const res = await fetch(`${API_URL}${path}`, { method: 'POST', headers: await getHeaders(), body: JSON.stringify(body) });
    if (!res.ok) throw await res.json();
    return res.json();
  },
  put: async (path, body) => {
    const res = await fetch(`${API_URL}${path}`, { method: 'PUT', headers: await getHeaders(), body: JSON.stringify(body) });
    if (!res.ok) throw await res.json();
    return res.json();
  },
  patch: async (path, body) => {
    const res = await fetch(`${API_URL}${path}`, { method: 'PATCH', headers: await getHeaders(), body: JSON.stringify(body) });
    if (!res.ok) throw await res.json();
    return res.json();
  },
  delete: async (path) => {
    const res = await fetch(`${API_URL}${path}`, { method: 'DELETE', headers: await getHeaders() });
    if (!res.ok) throw await res.json();
    return res.json();
  }
};
