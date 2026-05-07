import { Wine, Instagram, Facebook, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner container">
        <div className="footer-brand">
          <div className="footer-logo"><Wine size={32} /><span>Adega Barrique</span></div>
          <p>Seleção premium de vinhos, espumantes e cervejas artesanais para os verdadeiros apreciadores.</p>
          <div className="footer-social">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={20} /></a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={20} /></a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Navegação</h4>
          <ul>
            <li><a href="#cardapio">Cardápio</a></li>
            <li><a href="#mostruario">Mostruário</a></li>
            <li><a href="#localizacao">Localização</a></li>
            <li><a href="#contato">Contato</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Conta</h4>
          <ul>
            <li><Link to="/login">Entrar</Link></li>
            <li><Link to="/cadastro">Cadastrar</Link></li>
            <li><Link to="/cliente/pedidos">Meus Pedidos</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contato</h4>
          <ul className="footer-contact">
            <li><Phone size={15} /><a href="tel:+5581999999999">(81) 9 9999-9999</a></li>
            <li><Mail size={15} /><a href="mailto:contato@adegabarrique.com.br">contato@adegabarrique.com.br</a></li>
            <li><MapPin size={15} /><span>Rua das Vinhas, 42 — Boa Viagem, Recife/PE</span></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <span>© {new Date().getFullYear()} Adega Barrique. Todos os direitos reservados.</span>
          <span className="footer-legal">Venda de bebidas alcoólicas proibida para menores de 18 anos. Beba com moderação.</span>
        </div>
      </div>
    </footer>
  );
}
