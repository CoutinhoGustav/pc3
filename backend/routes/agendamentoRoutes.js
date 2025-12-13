const express = require("express");
const router = express.Router();
const Agendamento = require("../models/Agendamento");


// =====================
// CREATE - Criar agendamento
// =====================
router.post("/", async (req, res) => {
  try {
    const { nome, consulta, data, hora } = req.body;

    if (!nome || !consulta || !data || !hora) {
      return res.status(400).json({ message: "Preencha todos os campos." });
    }

    const novoAgendamento = new Agendamento({
      nome,
      consulta,
      data,
      hora
    });

    await novoAgendamento.save();

    res.status(201).json({
      message: "Agendamento criado com sucesso!",
      agendamento: novoAgendamento
    });
  } catch (err) {
    console.error("🔥 ERRO NO AGENDAMENTO:", err);
    res.status(500).json({ message: "Erro ao criar agendamento." });
  }
});


// =====================
// READ - Listar todos
// =====================
router.get("/", async (req, res) => {
  try {
    const agendamentos = await Agendamento.find().sort({ criadoEm: -1 });
    res.status(200).json(agendamentos);
  } catch (err) {
    console.error("🔥 ERRO AO LISTAR AGENDAMENTOS:", err);
    res.status(500).json({ message: "Erro ao listar agendamentos." });
  }
});


// =====================
// READ - Buscar por ID
// =====================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const agendamento = await Agendamento.findById(id);

    if (!agendamento) {
      return res.status(404).json({ message: "Agendamento não encontrado." });
    }

    res.status(200).json(agendamento);
  } catch (err) {
    console.error("🔥 ERRO AO BUSCAR AGENDAMENTO:", err);
    res.status(500).json({ message: "Erro ao buscar agendamento." });
  }
});


// =====================
// UPDATE - Atualizar agendamento
// =====================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, consulta, data, hora } = req.body;

    const agendamentoAtualizado = await Agendamento.findByIdAndUpdate(
      id,
      { nome, consulta, data, hora },
      { new: true }
    );

    if (!agendamentoAtualizado) {
      return res.status(404).json({ message: "Agendamento não encontrado." });
    }

    res.status(200).json({
      message: "Agendamento atualizado com sucesso!",
      agendamento: agendamentoAtualizado
    });
  } catch (err) {
    console.error("🔥 ERRO AO ATUALIZAR AGENDAMENTO:", err);
    res.status(500).json({ message: "Erro ao atualizar agendamento." });
  }
});


// =====================
// DELETE - Deletar agendamento
// =====================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Agendamento.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Agendamento não encontrado." });
    }

    res.status(200).json({ message: "Agendamento excluído com sucesso." });
  } catch (err) {
    console.error("🔥 ERRO AO EXCLUIR AGENDAMENTO:", err);
    res.status(500).json({ message: "Erro ao excluir agendamento." });
  }
});

module.exports = router;
