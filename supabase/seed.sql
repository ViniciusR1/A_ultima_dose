-- ============================================================
-- ADEGA BARRIQUE — Dados de Exemplo (Seed)
-- Execute APÓS o schema.sql
-- ============================================================

INSERT INTO public.products
  (name, description, price, category, image_url, stock, alcohol_content, volume, active)
VALUES
-- Vinhos Tintos
('Bodegas Norton Malbec Reserva',
 'Elegante Malbec argentino com notas de ameixa, chocolate amargo e tabaco. Taninos macios e final longo.',
 89.90, 'wine_red',
 'https://images.vivino.com/thumbs/mAlDKTCl-Oqp3WyEsVCkrA_300x400.jpg',
 24, 14.0, 750, true),

('Casillero del Diablo Cabernet Sauvignon',
 'Clássico chileno com aromas intensos de frutas negras, menta e especiarias. Estruturado e versátil.',
 59.90, 'wine_red',
 'https://images.vivino.com/thumbs/gxjkWxb3CrU7Z5LZVVj9zA_300x400.jpg',
 36, 13.5, 750, true),

('Don Melchor Cabernet Sauvignon',
 'Ícone chileno produzido com uvas do vale do Maipo. Complexo, elegante e com grande potencial de guarda.',
 349.00, 'wine_red', NULL,
 8, 14.5, 750, true),

('Quinta do Crasto LBV Porto',
 'Late Bottled Vintage português com notas de frutas maduras, chocolate e especiarias doces.',
 129.00, 'wine_red', NULL,
 15, 19.0, 750, true),

-- Vinhos Brancos
('Santa Helena Sauvignon Blanc',
 'Fresco e aromático com notas cítricas, maracujá e ervas finas. Ideal para frutos do mar.',
 49.90, 'wine_white', NULL,
 28, 12.5, 750, true),

('Miolo Chablis Premier Cru',
 'Chardonnay borgonhês com mineralidade marcante, notas de frutas brancas e amadeirado sutil.',
 219.00, 'wine_white', NULL,
 10, 12.5, 750, true),

('Vermentino Sardinia IGT',
 'Branco italiano fresco com aromas florais, amêndoa e toque de sal marinho. Perfeito como aperitivo.',
 79.90, 'wine_white', NULL,
 18, 13.0, 750, true),

-- Vinhos Rosé
('Whispering Angel Provence Rosé',
 'O rosé mais famoso do mundo. Pálido e delicado com notas de pêssego branco, grapefruit e florais.',
 189.00, 'wine_rose', NULL,
 12, 13.0, 750, true),

('Ramón Bilbao Rosado',
 'Rosé espanhol vibrante com cor salmão intensa. Notas de morango, framboesa e flor de laranjeira.',
 69.90, 'wine_rose', NULL,
 20, 13.5, 750, true),

-- Espumantes
('Chandon Brut Rosé',
 'Espumante brasileiro pelo método champenoise. Delicado, com finas borbulhas e notas de frutas vermelhas.',
 89.90, 'sparkling', NULL,
 30, 12.0, 750, true),

('Perrier-Jouët Grand Brut Champagne',
 'Champagne da famosa maison de Épernay. Elegante, com bollhas persistentes e notas de torrada e frutas brancas.',
 399.00, 'sparkling', NULL,
 6, 12.0, 750, true),

('Cave Geisse Blanc de Blancs',
 'O melhor espumante brasileiro, produzido na Serra Gaúcha. Premiado internacionalmente. Fresco e mineral.',
 149.00, 'sparkling', NULL,
 14, 12.0, 750, true),

-- Cervejas Artesanais
('Dogma American IPA',
 'IPA refrescante com lúpulos americanos que oferecem notas de pinho, frutas tropicais e maracujá. Amargor agradável.',
 18.90, 'craft_beer', NULL,
 48, 6.5, 500, true),

('Bodebrown Bohemian Pilsner',
 'Pilsner estilo boêmio com maltes nobres e lúpulo Saaz. Leve, refrescante e com amargor delicado.',
 14.90, 'craft_beer', NULL,
 60, 4.8, 500, true),

('Wäls Quadruppel',
 'Strong Ale belga de alta fermentação com 11% de álcool. Complexa, com notas de uvas passas, tâmaras e especiarias.',
 32.90, 'craft_beer', NULL,
 24, 11.0, 500, true),

('Seasons Nectarine Sour',
 'Cerveja azeda estilo Berliner Weisse com pêssego nectarina. Refrescante, frutada e levemente ácida.',
 24.90, 'craft_beer', NULL,
 36, 4.2, 500, true),

('Tupiniquim Coffee Stout',
 'Stout encorpada com adição de café especial. Notas de chocolate amargo, café torrado e caramelo.',
 22.90, 'craft_beer', NULL,
 30, 5.8, 500, true),

('Colorado Appia',
 'Cerveja brasileira com mel e extrato de guaraná. Dourada, aromática, com dulçor equilibrado e refrescante.',
 16.90, 'craft_beer', NULL,
 42, 4.8, 600, true);

-- ============================================================
-- Para criar um usuário ADMIN:
-- 1. Registre normalmente pelo site
-- 2. Execute o UPDATE abaixo substituindo o e-mail:
--
-- UPDATE public.profiles
-- SET role = 'admin'
-- WHERE email = 'admin@adegabarrique.com.br';
-- ============================================================
