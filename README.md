# 🍷 Adega Barrique — Sistema Completo

> Plataforma e-commerce para adega de vinhos e cervejas artesanais com área pública, painel do cliente e backoffice administrativo.

![Stack](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite) ![Node](https://img.shields.io/badge/Node.js-20-339933?logo=node.js) ![Supabase](https://img.shields.io/badge/Supabase-2-3ECF8E?logo=supabase)

---

## 📋 Índice

- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Configuração do Supabase](#configuração-do-supabase)
- [Instalação](#instalação)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Rodando o Projeto](#rodando-o-projeto)
- [Usuário Administrador](#usuário-administrador)
- [Rotas da API](#rotas-da-api)

---

## ✨ Funcionalidades

### 🌐 Área Pública (Landing Page)
- **Menu de navegação** com links âncora e botão de login
- **Carrossel de banners** rotativos com animação automática
- **Cardápio interativo** com filtro por categoria e busca
- **Carrinho lateral** (drawer) — montagem livre sem login
- **Mostruário** de categorias em galeria visual
- **Mapa** integrado via OpenStreetMap/Leaflet
- **Formulário de contato** + botão WhatsApp
- **Rodapé** com links, redes sociais e aviso de responsabilidade

### 👤 Área do Cliente (pós-login)
- **Dashboard** com estatísticas pessoais e atalhos
- **Catálogo completo** com carrinho e finalização de pedido
- **Histórico de pedidos** com expansão de detalhes e status
- **Perfil editável**: nome, telefone, múltiplos endereços de entrega
- **Troca de senha** integrada ao Supabase Auth

### 🔧 Área Admin (Backoffice)
- **Dashboard** com métricas: receita, pedidos, clientes, estoque
- **CRUD completo de produtos**: criar, editar, ativar/desativar, excluir
- **Gestão de pedidos**: visualização expandida, atualização de status
- **Perfil admin** editável com troca de senha

---

## 🛠 Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18 + Vite 5 |
| Roteamento | React Router v6 |
| Estilização | CSS Modules + variáveis globais |
| Ícones | Lucide React |
| Toast | React Hot Toast |
| Auth/DB | Supabase (Auth + PostgreSQL) |
| Backend | Node.js + Express 4 |
| Mapa | Leaflet / OpenStreetMap |
| Fontes | Playfair Display, Crimson Pro, Space Mono |

---

## 📁 Estrutura do Projeto

```
adega-project/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx       # Navbar pública com carrinho
│   │   │   │   ├── Footer.jsx       # Rodapé completo
│   │   │   │   ├── AdminLayout.jsx  # Sidebar admin colapsável
│   │   │   │   └── ClientLayout.jsx # Sidebar do cliente
│   │   │   └── ui/
│   │   │       ├── CartDrawer.jsx   # Carrinho lateral
│   │   │       ├── ProductCard.jsx  # Card de produto
│   │   │       ├── Modal.jsx        # Modal reutilizável
│   │   │       ├── StatCard.jsx     # Card de estatística
│   │   │       └── StatusBadge.jsx  # Badge de status de pedido
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Auth global (Supabase)
│   │   │   └── CartContext.jsx      # Carrinho (localStorage)
│   │   ├── pages/
│   │   │   ├── public/
│   │   │   │   ├── LandingPage.jsx  # Página principal completa
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   └── RegisterPage.jsx
│   │   │   ├── client/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Catalog.jsx      # Catálogo + finalizar pedido
│   │   │   │   ├── Orders.jsx
│   │   │   │   └── Profile.jsx      # Dados + endereços + senha
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx    # Métricas + pedidos recentes
│   │   │       ├── Products.jsx     # CRUD de produtos
│   │   │       ├── Orders.jsx       # Gestão de pedidos + status
│   │   │       └── Profile.jsx
│   │   ├── services/
│   │   │   ├── supabase.js          # Client Supabase
│   │   │   └── api.js               # Wrapper fetch para backend
│   │   ├── App.jsx                  # Rotas + providers
│   │   ├── main.jsx
│   │   └── index.css                # Design system global
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   └── src/
│       ├── config/
│       │   └── supabase.js          # Clients anon + admin
│       ├── middleware/
│       │   └── auth.js              # JWT via Supabase + role check
│       ├── controllers/
│       │   ├── products.js
│       │   ├── orders.js
│       │   └── profiles.js          # Inclui stats admin
│       ├── routes/
│       │   ├── products.js
│       │   ├── orders.js
│       │   └── profiles.js
│       └── server.js
│
├── supabase/
│   ├── schema.sql   # Tabelas, RLS, triggers, funções
│   └── seed.sql     # 18 produtos de exemplo
│
├── .gitignore
└── README.md
```

---

## ⚙️ Configuração do Supabase

### 1. Criar projeto
1. Acesse [supabase.com](https://supabase.com) e crie um projeto
2. Anote a **URL** e as chaves **anon** e **service_role**

### 2. Executar SQL
No **SQL Editor** do Supabase, execute na ordem:

```bash
# 1. Schema (tabelas, RLS, triggers, funções)
supabase/schema.sql

# 2. Dados de exemplo (opcional)
supabase/seed.sql
```

### 3. Configurar Auth
Em **Authentication → Settings**:
- **Site URL**: `http://localhost:5173`
- **Redirect URLs**: `http://localhost:5173/**`
- Ative **Email Confirmations** se desejar (ou desative para dev)

---

## 🚀 Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/adega-barrique.git
cd adega-barrique

# Instalar dependências do frontend
cd frontend
npm install

# Instalar dependências do backend
cd ../backend
npm install
```

---

## 🔐 Variáveis de Ambiente

### Frontend (`frontend/.env`)
```env
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key
VITE_API_URL=http://localhost:3001/api
```

### Backend (`backend/.env`)
```env
SUPABASE_URL=https://SEU_PROJETO.supabase.co
SUPABASE_ANON_KEY=sua_anon_key
SUPABASE_SERVICE_KEY=sua_service_role_key
PORT=3001
FRONTEND_URL=http://localhost:5173
```

---

## ▶️ Rodando o Projeto

```bash
# Terminal 1 — Backend
cd backend
npm run dev
# → API rodando em http://localhost:3001

# Terminal 2 — Frontend
cd frontend
npm run dev
# → App rodando em http://localhost:5173
```

---

## 👑 Usuário Administrador

Após registrar um usuário pelo site, promova-o a admin no Supabase:

```sql
-- No SQL Editor do Supabase:
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'seu-email@exemplo.com';
```

O admin terá acesso ao painel em `/admin` com todas as funcionalidades de gestão.

---

## 📡 Rotas da API

### Produtos (públicas + admin)
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/api/products` | ❌ | Listar produtos ativos |
| GET | `/api/products/:id` | ❌ | Detalhe do produto |
| POST | `/api/products` | Admin | Criar produto |
| PUT | `/api/products/:id` | Admin | Editar produto |
| DELETE | `/api/products/:id` | Admin | Desativar produto |

### Pedidos
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/api/orders` | Cliente | Criar pedido |
| GET | `/api/orders/my` | Cliente | Meus pedidos |
| GET | `/api/orders` | Admin | Todos os pedidos |
| PATCH | `/api/orders/:id/status` | Admin | Atualizar status |

### Perfis
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/api/profiles/me` | Logado | Meu perfil |
| PUT | `/api/profiles/me` | Logado | Atualizar perfil |
| GET | `/api/profiles/admin/stats` | Admin | Estatísticas do sistema |

---

## 🎨 Design System

O projeto usa um sistema de cores baseado em variáveis CSS:

| Variável | Cor | Uso |
|----------|-----|-----|
| `--burgundy` | `#6B1A2A` | Cor primária, botões, destaques |
| `--gold` | `#C9A84C` | Acentos, ícones, badges |
| `--cream` | `#F5EFE0` | Background principal |
| `--charcoal` | `#1C1C1E` | Navbar, sidebar admin, textos |

Fontes: **Playfair Display** (títulos) · **Crimson Pro** (corpo) · **Space Mono** (labels/mono)

---

## 📜 Licença

MIT © 2024 Adega Barrique
