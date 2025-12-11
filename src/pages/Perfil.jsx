import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../pages/css/Perfil.css';

const Modal = ({ titulo, mensagem, onConfirm, onCancel }) => (
  <div
    className="modal-backdrop"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    tabIndex={-1}
  >
    <div className="modal-content">
      <h3 id="modal-title">{titulo}</h3>
      <p>{mensagem}</p>
      <div className="modal-buttons">
        <button className="btn-confirm" onClick={onConfirm}>
          Confirmar
        </button>
        <button className="btn-cancel" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </div>
  </div>
);

const Perfil = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState(null);
  const [editando, setEditando] = useState(false);
  const [modalSalvarAberto, setModalSalvarAberto] = useState(false);
  const [modalCancelarAberto, setModalCancelarAberto] = useState(false);

  // Tema dark/light
  const [darkTheme, setDarkTheme] = useState(false);
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setDarkTheme(savedTheme === 'dark');
  }, []);
  useEffect(() => {
    document.body.classList.toggle('dark-theme', darkTheme);
    localStorage.setItem('theme', darkTheme ? 'dark' : 'light');
  }, [darkTheme]);
  const toggleTheme = () => setDarkTheme(prev => !prev);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Limpa token
    navigate('/login');
  };

  // Carrega dados do usuário do backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token'); // token salvo após login
        if (!token) {
          navigate('/login'); // redireciona se não tiver token
          return;
        }

        const response = await fetch('http://localhost:5000/api/auth/user', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Erro ao buscar dados do usuário');

        const data = await response.json();
        setUser(data);
        setFormData(data);
      } catch (error) {
        console.error(error);
        alert('Erro ao carregar os dados do usuário. Faça login novamente.');
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  // Máscaras
  const formatarCPF = value => {
    const somenteDigitos = value.replace(/\D/g, '').slice(0, 11);
    if (somenteDigitos.length <= 3) return somenteDigitos;
    if (somenteDigitos.length <= 6) return `${somenteDigitos.slice(0,3)}.${somenteDigitos.slice(3)}`;
    if (somenteDigitos.length <= 9) return `${somenteDigitos.slice(0,3)}.${somenteDigitos.slice(3,6)}.${somenteDigitos.slice(6)}`;
    return `${somenteDigitos.slice(0,3)}.${somenteDigitos.slice(3,6)}.${somenteDigitos.slice(6,9)}-${somenteDigitos.slice(9,11)}`;
  };

  const formatarTelefone = value => {
    const somenteDigitos = value.replace(/\D/g, '').slice(0, 11);
    if (somenteDigitos.length <= 2) return `(${somenteDigitos}`;
    if (somenteDigitos.length <= 6) return `(${somenteDigitos.slice(0,2)}) ${somenteDigitos.slice(2)}`;
    if (somenteDigitos.length <= 10) return `(${somenteDigitos.slice(0,2)}) ${somenteDigitos.slice(2,3)} ${somenteDigitos.slice(3,7)}-${somenteDigitos.slice(7)}`;
    return `(${somenteDigitos.slice(0,2)}) ${somenteDigitos.slice(2,3)} ${somenteDigitos.slice(3,7)}-${somenteDigitos.slice(7,11)}`;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'cpf') setFormData(prev => ({ ...prev, cpf: formatarCPF(value) }));
    else if (name === 'telefone') setFormData(prev => ({ ...prev, telefone: formatarTelefone(value) }));
    else setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFotoChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setFormData(prev => ({ ...prev, fotoPerfil: reader.result }));
    reader.readAsDataURL(file);
  };

  const tentarSalvar = () => setModalSalvarAberto(true);
  const tentarCancelar = () => setModalCancelarAberto(true);

  const confirmarSalvar = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Erro ao atualizar perfil');
      const updatedData = await response.json();
      setUser(updatedData);
      setFormData(updatedData);
      setEditando(false);
      setModalSalvarAberto(false);
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar alterações.');
    }
  };

  const confirmarCancelar = () => {
    setFormData(user);
    setEditando(false);
    setModalCancelarAberto(false);
  };

  if (!formData) return <p>Carregando...</p>;

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>Menu</h2>
        <div
          className="theme-change"
          onClick={toggleTheme}
          role="button"
          tabIndex={0}
          aria-label="Alternar tema claro/escuro"
          onKeyDown={e => { if(e.key==='Enter'||e.key===' ') toggleTheme(); }}
        >
          <i className={`fa-solid ${darkTheme ? 'fa-sun' : 'fa-moon'}`} />
        </div>
        <nav>
          <ul>
            <li><Link to="/perfil">Perfil</Link></li>
            <li><Link to="/consultas">Consultas</Link></li>
            <li><Link to="/agendamento">Agendamento</Link></li>
            <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
          </ul>
        </nav>
      </aside>

      <main className="perfil-container">
        <div className="foto-container">
          <img src={formData.fotoPerfil || '/user-placeholder.png'} alt="Foto de perfil" className="foto-perfil" />
          {editando && <input type="file" accept="image/*" onChange={handleFotoChange} className="input-foto" />}
        </div>

        <div className="perfil-info">
          <label>Nome:
            <input type="text" name="nome" value={formData.nome} onChange={handleChange} disabled={!editando} />
          </label>

          <label>E-mail:
            <input type="email" name="email" value={formData.email} onChange={handleChange} disabled={!editando} />
          </label>

          <label>Telefone:
            <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} disabled={!editando} />
          </label>

          <label>CPF:
            <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} disabled={!editando} />
          </label>

          <label>Data de Nascimento:
            <input type="date" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} disabled={!editando} />
          </label>

          <label>Gênero:
            <select name="genero" value={formData.genero} onChange={handleChange} disabled={!editando}>
              <option>Masculino</option>
              <option>Feminino</option>
              <option>Outro</option>
              <option>Prefiro não dizer</option>
            </select>
          </label>
        </div>

        <div className="perfil-botoes">
          {editando ? (
            <>
              <button onClick={tentarSalvar} className="salvar">Salvar</button>
              <button onClick={tentarCancelar} className="cancelar">Cancelar</button>
            </>
          ) : (
            <button onClick={() => setEditando(true)} className="editar">Editar Perfil</button>
          )}
        </div>

        {modalSalvarAberto && <Modal titulo="Confirmar Alterações" mensagem="Deseja realmente salvar as alterações feitas no seu perfil?" onConfirm={confirmarSalvar} onCancel={() => setModalSalvarAberto(false)} />}
        {modalCancelarAberto && <Modal titulo="Descartar Alterações" mensagem="Tem certeza que deseja descartar as alterações feitas?" onConfirm={confirmarCancelar} onCancel={() => setModalCancelarAberto(false)} />}
      </main>
    </div>
  );
};

export default Perfil;
