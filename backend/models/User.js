const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
 nome: { type: String, required: true },
  email: { type: String, required: true },
  telefone: { type: String, required: true },
  convenio: { type: String, required: true },
  numeroPlano: { type: String }, 
  cpf: { type: String, required: true, unique: true },
  senha: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);
