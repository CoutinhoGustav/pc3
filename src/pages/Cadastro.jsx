import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/Login.css';
import { formatCpf, formatTelefone } from '../utils';

const Cadastro = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleCpfChange = (e) => setCpf(formatCpf(e.target.value));
  const handleTelefoneChange = (e) => setTelefone(formatTelefone(e.target.value));

  const handleCadastro = async (e) => {
    e.preventDefault();

    const cpfSemFormatacao = cpf.replace(/\D/g, '');

    const dadosUsusario = {
      cpf: cpfSemFormatacao,
      senha,
      nome,
      email,
      telefone,
    };

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dadosUsusario }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ Cadastro realizado com sucesso!');
        navigate('/login');
      } else {
        alert(data.message || 'Erro ao cadastrar.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro de conexão com o servidor.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <form onSubmit={handleCadastro}>
          <div className="back-button">
            <Link to="/login">
              <i className="fa-solid fa-arrow-left"></i>
            </Link>
          </div>

          <h2>Cadastro</h2>

          <div className="input-group">
            <label htmlFor="nome">Nome Completo</label>
            <input
              type="text"
              id="nome"
              placeholder="Digite seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

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
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="exemplo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="telefone">Telefone</label>
            <input
              type="text"
              id="telefone"
              placeholder="(00) 00000-0000"
              value={telefone}
              onChange={handleTelefoneChange}
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

          <button type="submit">Cadastrar</button>
        </form>
      </div>
    </div>
  );
};

export default Cadastro;
