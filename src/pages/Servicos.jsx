import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../pages/css/Servicos.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun, faBars, faXmark } from '@fortawesome/free-solid-svg-icons';

const Servicos = () => {
  const [darkTheme, setDarkTheme] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setDarkTheme(savedTheme === 'dark');
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark-theme', darkTheme);
    localStorage.setItem('theme', darkTheme ? 'dark' : 'light');
  }, [darkTheme]);

  const toggleTheme = () => setDarkTheme(prev => !prev);
  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);

  return (
    <div className="home-page">
      <section className="header-section">
        <div className="header-logo">
          <p>
            Consultório <span>Saúde+</span>
          </p>
        </div>
        <div className="header-nav">
          <div className="mobile-nav-icon" onClick={toggleMobileMenu}>
            <FontAwesomeIcon icon={mobileMenuOpen ? faXmark : faBars} />
          </div>

          <ul className={`header-nav-list ${mobileMenuOpen ? 'active' : ''}`}>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li className="active">
              <Link to="/servicos">Serviços</Link>
            </li>
            <li>
              <Link to="/sobre">Sobre Nós</Link>
            </li>
            <li>
              <Link to="/contato">Contato</Link>
            </li>
          </ul>

          <div className="theme-change" onClick={toggleTheme}>
            <FontAwesomeIcon icon={darkTheme ? faSun : faMoon} />
          </div>
        </div>
      </section>

      <div className="content-container">
        <section id="our-services" className="mb-4">
          <h2>Nossos Serviços</h2>
          <p>Oferecemos uma variedade de serviços médicos para atender suas necessidades:</p>
          <ul>
            <li>Consulta Geral - Dr. João Silva</li>
            <li>Pediatria - Dra. Maria Oliveira</li>
            <li>Cardiologia - Dr. Carlos Mendes</li>
            <li>Dermatologia - Dra. Ana Souza</li>
          </ul>
        </section>

        <section id="service-hours" className="mb-4">
          <h2>Serviços e Horários</h2>
          <p>Confira nossos serviços e horários de funcionamento:</p>
          <ul>
            <li>Dr. João Silva (Consulta Geral) - Segunda a Sexta: 8h às 12h</li>
            <li>Dra. Maria Oliveira (Pediatria) - Segunda a Sexta: 13h às 17h</li>
            <li>Dr. Carlos Mendes (Cardiologia) - Terça e Quinta: 9h às 15h</li>
            <li>Dra. Ana Souza (Dermatologia) - Quarta e Sexta: 10h às 16h</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Servicos;
