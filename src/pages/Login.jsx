import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import '../pages/css/Login.css';

const Login = () => {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [darkTheme, setDarkTheme] = useState(false);
  const navigate = useNavigate();

  // Inicializa o tema
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setDarkTheme(savedTheme === 'dark');
    if (savedTheme === 'dark') document.body.classList.add('dark-theme');
  }, []);

  const toggleTheme = () => {
    setDarkTheme(prev => {
      const newTheme = !prev;
      if (newTheme) {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
      }
      return newTheme;
    });
  };

  const formatCpf = (value) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 11);
    return cleaned
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const handleCpfChange = (e) => setCpf(formatCpf(e.target.value));

  const handleLogin = async (e) => {
    e.preventDefault();
    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) return alert("Digite um CPF válido!");
    if (!senha) return alert("Digite sua senha!");

    try {
      const response = await fetch('https://pc3-t3lq.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpf: cpfLimpo, senha }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        alert('✅ Login efetuado com sucesso!');
        navigate('/dashboard');
      } else {
        alert(data.message || '❌ CPF ou senha inválidos!');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      alert('Erro ao conectar ao servidor.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        {/* Top Bar com Voltar e Tema */}
        <div className="top-bar">
          {/* Botão voltar apenas mobile */}
          <Link to="/" className="back-link mobile-only">
            <FontAwesomeIcon icon={faArrowLeft} /> Voltar
          </Link>

          {/* Ícone de tema */}
          <div className="header-right">
            <div className="theme-change" onClick={toggleTheme}>
              <FontAwesomeIcon icon={darkTheme ? faSun : faMoon} />
            </div>
          </div>
        </div>

        <form onSubmit={handleLogin}>
          <h2>Login</h2>

          <div className="input-group">
            <label htmlFor="cpf">CPF</label>
            <input
              type="text"
              id="cpf"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={handleCpfChange}
              maxLength="14"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button type="submit">Entrar</button>

          <p className="signup-link">
            Ainda não tem conta? <Link to="/cadastro">Cadastre-se aqui</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
