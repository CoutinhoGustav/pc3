import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './css/Login.css';

const Cadastro = () => {
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [genero, setGenero] = useState('');
  const [senha, setSenha] = useState('');
  const [darkTheme, setDarkTheme] = useState(false);

  const navigate = useNavigate();

  // Inicializa tema
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

  // Máscara CPF
  const formatCpf = (value) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 11);
    return cleaned
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };
  const handleCpfChange = (e) => setCpf(formatCpf(e.target.value));

  // Máscara dinâmica para telefone
  const handleTelefoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length <= 10) {
      value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
    } else {
      value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
    }
    setTelefone(value);
  };

  // Função de cadastro
  const handleCadastro = async (e) => {
    e.preventDefault();
    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) return alert("Digite um CPF válido.");
    if (!email.includes('@')) return alert("Digite um e-mail válido.");
    if (senha.length < 4) return alert("A senha deve ter pelo menos 4 caracteres.");

    try {
      const res = await fetch('https://pc3-t3lq.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpf: cpfLimpo, email, telefone, dataNascimento, genero, senha }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ Cadastro realizado com sucesso!');
        navigate('/login');
      } else {
        alert(data.message || 'Erro ao cadastrar.');
      }
    } catch (error) {
      console.error('Erro no cadastro:', error);
      alert('Erro de conexão com o servidor.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        {/* Top Bar com Voltar e Tema */}
        <div className="top-bar">
          <Link to="/login" className="back-link mobile-only">
            <FontAwesomeIcon icon={faArrowLeft} /> Voltar
          </Link>

          {/* Ícones: theme */}
          <div className="header-right">
            <div className="theme-change" onClick={toggleTheme}>
              <FontAwesomeIcon icon={darkTheme ? faSun : faMoon} />
            </div>
          </div>
        </div>

        <form onSubmit={handleCadastro}>
          <h2>Cadastro</h2>

          <div className="input-group">
            <label htmlFor="cpf">CPF</label>
            <input type="text" id="cpf" placeholder="000.000.000-00" value={cpf} onChange={handleCpfChange} maxLength="14" required />
          </div>

          <div className="input-group">
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" placeholder="joao.silva@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="input-group">
            <label htmlFor="telefone">Telefone</label>
            <input type="text" id="telefone" placeholder="(61) 99999-9999" value={telefone} onChange={handleTelefoneChange} maxLength="15" />
          </div>

          <div className="input-group">
            <label htmlFor="dataNascimento">Data de Nascimento</label>
            <input type="date" id="dataNascimento" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} />
          </div>

          <div className="input-group">
            <label htmlFor="genero">Gênero</label>
            <select id="genero" value={genero} onChange={(e) => setGenero(e.target.value)}>
              <option value="">Selecione</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="senha">Senha</label>
            <input type="password" id="senha" placeholder="Digite sua senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
          </div>

          <button type="submit">Cadastrar</button>
        </form>
      </div>
    </div>
  );
};

export default Cadastro;
