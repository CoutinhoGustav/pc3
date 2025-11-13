import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../pages/css/Site.css';

export default function Site() {
  const [darkTheme, setDarkTheme] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Recupera o tema salvo
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setDarkTheme(savedTheme === 'dark');
  }, []);

  // Aplica o tema no body e salva
  useEffect(() => {
    document.body.classList.toggle('dark-theme', darkTheme);
    localStorage.setItem('theme', darkTheme ? 'dark' : 'light');
  }, [darkTheme]);

  const toggleTheme = () => setDarkTheme((prev) => !prev);
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const handleLinkClick = () => setMobileMenuOpen(false);

  return (
    <div className="home-page">
      {/* Cabeçalho */}
      <header className="header-section">
        {/* LOGO */}
        <div className="header-logo">
          <p>
            Consultório <span>Saúde+</span>
          </p>
        </div>

        {/* MENU */}
        <nav className="header-nav">
          <i class="bi bi-list"></i>
          <ul className={`header-nav-list ${mobileMenuOpen ? 'active' : ''}`}>
            <li>
              <Link to="/" onClick={handleLinkClick}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/servicos" onClick={handleLinkClick}>
                Serviços
              </Link>
            </li>
            <li>
              <Link to="/sobre" onClick={handleLinkClick}>
                Sobre
              </Link>
            </li>
            <li>
              <Link to="/contato" onClick={handleLinkClick}>
                Contato
              </Link>
            </li>
          </ul>

          {/* Ícones: theme e menu mobile */}
          <div className="header-right">
            {/* Theme change */}
            <div className="theme-change" onClick={toggleTheme}>
              <i className={`fa-solid ${darkTheme ? 'fa-sun' : 'fa-moon'}`}></i>
            </div>

            {/* Mobile menu icon */}
            <div className="mobile-nav-icon" onClick={toggleMobileMenu}>
              <i class="bi bi-list"></i>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <p className="content-header">Bem-vindo(a)</p>
          <p className="content-body">
            Nós somos o Consulta Saúde+ fundado desde 2025.
            <br />
            <span>
              Fazemos atendimentos de segunda a sexta, das 8h às 18h, e aos
              sábados, das 8h às 12h.
            </span>
            <br />
            <span>Deseja agendar uma consulta? Clique no botão abaixo.</span>
          </p>
          <div className="hero-btn">
            <Link to="/login">
              <button className="resume-btn">Agende sua Consulta</button>
            </Link>
          </div>
        </div>

        <div className="hero-image">
          <img
            src="https://raw.githubusercontent.com/CoutinhoGustav/pc3/main/src/assets/img/ImagemExemploConsultorio.jpg"
            alt="Imagem do Consultório Médico"
            className="main-img protected-image"
          />
        </div>
      </section>
    </div>
  );
}
