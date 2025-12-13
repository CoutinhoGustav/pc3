const Agendamento = require("../models/Agendamento");

// CREATE - Criar agendamento
exports.criarAgendamento = async (req, res) => {
  try {
    const novoAgendamento = await Agendamento.create(req.body);
    res.status(201).json(novoAgendamento);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};

// READ - Listar todos
exports.listarAgendamentos = async (req, res) => {
  try {
    const agendamentos = await Agendamento.find().sort({ criadoEm: -1 });
    res.status(200).json(agendamentos);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

// READ - Buscar por ID
exports.buscarAgendamento = async (req, res) => {
  try {
    const agendamento = await Agendamento.findById(req.params.id);

    if (!agendamento) {
      return res.status(404).json({ erro: "Agendamento não encontrado" });
    }

    res.status(200).json(agendamento);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

// UPDATE - Atualizar
exports.atualizarAgendamento = async (req, res) => {
  try {
    const agendamento = await Agendamento.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!agendamento) {
      return res.status(404).json({ erro: "Agendamento não encontrado" });
    }

    res.status(200).json(agendamento);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};

// DELETE - Deletar
exports.deletarAgendamento = async (req, res) => {
  try {
    const agendamento = await Agendamento.findByIdAndDelete(req.params.id);

    if (!agendamento) {
      return res.status(404).json({ erro: "Agendamento não encontrado" });
    }

    res.status(200).json({ mensagem: "Agendamento removido com sucesso" });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};
