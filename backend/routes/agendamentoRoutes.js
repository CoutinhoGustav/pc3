const express = require("express");
const router = express.Router();
const Agendamento = require("../models/Agendamento");

// Criar agendamento
router.post("/", async (req, res) => {
  try {
    const { nome, consulta, data, hora } = req.body;

    const novoAgendamento = new Agendamento({ nome, consulta, data, hora });
    await novoAgendamento.save();

    res.status(201).json({ message: "Agendamento criado com sucesso!" });
  } catch (err) {
    console.error("🔥 ERRO NO AGENDAMENTO:", err);
    res.status(500).json({ message: "Erro ao criar agendamento." });
  }
});

// Listar todos os agendamentos
router.get("/", async (req, res) => {
  try {
    const agendamentos = await Agendamento.find();
    res.json(agendamentos);
  } catch (err) {
    console.error("🔥 ERRO AO LISTAR AGENDAMENTOS:", err);
    res.status(500).json({ message: "Erro ao listar agendamentos." });
  }
});

// Deletar agendamento
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Agendamento.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Agendamento não encontrado" });
    res.json({ message: "Agendamento excluído com sucesso" });
  } catch (err) {
    console.error("Erro ao excluir agendamento:", err);
    res.status(500).json({ message: "Erro ao excluir agendamento" });
  }
});

module.exports = router;
