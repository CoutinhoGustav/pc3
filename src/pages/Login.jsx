import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../pages/css/Login.css';

const Login = () => {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  // 🎨 Controle do modo escuro
  useEffect(() => {
    const themeChangeIcon = document.getElementById("themeChangeIcon");

    const applyTheme = (theme) => {
      if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        themeChangeIcon.classList.replace('fa-moon', 'fa-sun');
      } else {
        document.body.classList.remove('dark-theme');
        themeChangeIcon.classList.replace('fa-sun', 'fa-moon');
      }
    };

    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    const handleThemeChange = () => {
      let theme = 'light';
      if (document.body.classList.toggle('dark-theme')) {
        theme = 'dark';
        themeChangeIcon.classList.replace('fa-moon', 'fa-sun');
      } else {
        themeChangeIcon.classList.replace('fa-sun', 'fa-moon');
      }
      localStorage.setItem('theme', theme);
    };

    themeChangeIcon.addEventListener('click', handleThemeChange);
    return () => themeChangeIcon.removeEventListener('click', handleThemeChange);
  }, []);

  // 🧮 Máscara de CPF
  const formatCpf = (value) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 11);
    return cleaned
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const handleCpfChange = (e) => setCpf(formatCpf(e.target.value));

  // 🔐 Função de login conectada ao backend
  const handleLogin = async (e) => {
    e.preventDefault();

    const cpfSemFormatacao = cpf.replace(/\D/g, '');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpf: cpfSemFormatacao, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ Login efetuado com sucesso!');
        // opcional: salvar token ou usuário no localStorage futuramente
        navigate('/dashboard');
      } else {
        alert(data.message || '❌ CPF ou senha inválidos!');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      alert('Erro ao conectar ao servidor. Verifique se o backend está rodando.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <form onSubmit={handleLogin}>
          <div className="theme-change">
            <i className="fa-solid fa-moon" id="themeChangeIcon"></i>
          </div>

          <div className="back-button">
            <Link to="/">
              <i className="fa-solid fa-arrow-left"></i>
            </Link>
          </div>

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
