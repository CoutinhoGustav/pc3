import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/css/Agendamento.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

const Agendamento = () => {
  const [nome, setNome] = useState("");
  const [consulta, setConsulta] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [darkTheme, setDarkTheme] = useState(false);
  const navigate = useNavigate();

  const BACKEND_URL = "https://pc3-t3lq.onrender.com/api/agendamentos";

  const tiposConsulta = [
    "Clínico Geral",
    "Pediatria",
    "Dermatologia",
    "Cardiologia",
    "Ortopedia",
    "Ginecologia",
    "Retorno",
  ];

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setDarkTheme(savedTheme === "dark");
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark-theme", darkTheme);
    localStorage.setItem("theme", darkTheme ? "dark" : "light");
  }, [darkTheme]);

  const toggleTheme = () => setDarkTheme(prev => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome || !consulta || !data || !hora) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, consulta, data, hora }),
      });

      const dataRes = await res.json();

      if (res.ok) {
        alert(dataRes.message);
        setNome("");
        setConsulta("");
        setData("");
        setHora("");
        navigate("/consultas"); 
      } else {
        alert(dataRes.message || "Erro ao criar agendamento");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão com o servidor");
    }
  };

  return (
    <div className="scheduling-page">
      <div className="top-bar">
        <button onClick={() => navigate("/dashboard")}>&#8592; Voltar</button>

        <div className="header-right">
          <div className="theme-change" onClick={toggleTheme}>
            <FontAwesomeIcon icon={darkTheme ? faSun : faMoon} />
          </div>
        </div>
      </div>

      <div className="agendamento-card">
        <h2>Agendamento de Consultas</h2>

        <form className="agendamento-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Nome:</label>
            <input 
              type="text"
              value={nome}
              onChange={e => setNome(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Consulta:</label>
            <select 
              value={consulta}
              onChange={e => setConsulta(e.target.value)}
              required
            >
              <option value="">Selecione...</option>
              {tiposConsulta.map((tipo, index) => (
                <option key={index} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Data:</label>
            <input 
              type="date"
              value={data}
              onChange={e => setData(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Hora:</label>
            <input 
              type="time"
              value={hora}
              onChange={e => setHora(e.target.value)}
              required
            />
          </div>

          <button type="submit">Agendar</button>
        </form>
      </div>
    </div>
  );
};

export default Agendamento;
