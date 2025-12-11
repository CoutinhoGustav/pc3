const mongoose = require("mongoose");

const AgendamentoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  consulta: { type: String, required: true },
  data: { type: String, required: true },
  hora: { type: String, required: true },
  criadoEm: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Agendamento", AgendamentoSchema);
