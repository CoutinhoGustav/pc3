import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "../pages/css/Consultas.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

const Consultas = () => {
  const navigate = useNavigate();
  const [darkTheme, setDarkTheme] = useState(false);
  const [consultas, setConsultas] = useState([]);

  const BACKEND_URL = "https://pc3-t3lq.onrender.com/api/agendamentos";

  // Função para buscar agendamentos do backend
  const fetchConsultas = async () => {
    try {
      const res = await fetch(BACKEND_URL);
      const data = await res.json();
      setConsultas(data);
    } catch (err) {
      console.error("Erro ao buscar agendamentos:", err);
    }
  };

  // Carregar tema e lista ao montar componente
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setDarkTheme(savedTheme === "dark");
    fetchConsultas();
  }, []);

  // Aplicar tema dark/light
  useEffect(() => {
    document.body.classList.toggle("dark-theme", darkTheme);
    localStorage.setItem("theme", darkTheme ? "dark" : "light");
  }, [darkTheme]);

  const toggleTheme = () => setDarkTheme((prev) => !prev);

  const handleLogout = () => navigate("/login");

  // Gerar PDF
  const gerarPDF = (consulta) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Confirmação de Consulta", 20, 20);
    doc.setFontSize(12);
    doc.text(`Nome: ${consulta.nome}`, 20, 40);
    doc.text(`Consulta: ${consulta.consulta}`, 20, 50);
    doc.text(`Data: ${consulta.data}`, 20, 60);
    doc.text(`Horário: ${consulta.hora}`, 20, 70);
    doc.save(`Consulta-${consulta._id}.pdf`);
  };

  // Excluir agendamento
  const excluirConsulta = async (id) => {
  if (!window.confirm("Tem certeza que deseja excluir esta consulta?")) return;

  try {
    const res = await fetch(`${BACKEND_URL}/${id}`, { method: "DELETE" });

    if (res.ok) {
      setConsultas((prev) => prev.filter((c) => c._id !== id));
      alert("Consulta excluída com sucesso!");
    } else {
      const data = await res.json();
      alert(data.message || "Erro ao excluir consulta.");
    }
  } catch (err) {
    console.error("Erro ao excluir consulta:", err);
    alert("Erro de conexão com o servidor.");
  }
};

  return (
    <div className="card-dashboard">
      <aside className="sidebar">
        <h2>Menu</h2>
         {/* Ícone de tema */}
                  <div className="header-right">
                    <div className="theme-change" onClick={toggleTheme}>
                      <FontAwesomeIcon icon={darkTheme ? faSun : faMoon} />
                    </div>
                  </div>
        <nav>
          <ul>
            <li><Link to="/perfil">Perfil</Link></li>
            <li><Link to="/consultas">Consultas</Link></li>
            <li><Link to="/agendamento">Agendamento</Link></li>
            <li>
              <button onClick={handleLogout} type="button" className="logout-button">
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="container-card">
        <div className="cards-wrapper">
          {consultas.length === 0 ? (
            <p>Nenhuma consulta agendada.</p>
          ) : (
            consultas.map((consulta) => (
              <div key={consulta._id} className="consulta-card">
                <div className="card-header">
                  <span className="data">{consulta.data}</span>
                  <span className="horario">{consulta.hora}</span>
                </div>
                <div className="card-body">
                  <h3>{consulta.nome}</h3>
                  <p>{consulta.consulta}</p>
                  <div className="card-buttons">
                    <button
                      className="pdf-button"
                      onClick={() => gerarPDF(consulta)}
                    >
                      Gerar PDF
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => excluirConsulta(consulta._id)}
                    >
                      <i className="fa-solid fa-trash">Excluir</i>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Consultas;
