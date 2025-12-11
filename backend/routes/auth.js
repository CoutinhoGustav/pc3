const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User"); // <= IMPORTANTE

// Rota de cadastro
router.post("/register", async (req, res) => {
  try {
    const { cpf, senha } = req.body;
    console.log("Dados recebidos no backend:", req.body);

    // Verificar se o usuário já existe
    const existingUser = await User.findOne({ cpf });
    if (existingUser) {
      return res.status(400).json({ message: "Usuário já existe." });
    }

    // Criptografar senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);

    // Criar novo usuário
    const user = new User({
      cpf,
      senha: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
  } catch (error) {
    console.error("🔥 ERRO REAL NO CADASTRO:", error);
    res.status(500).json({ message: "Erro ao cadastrar usuário." });
  }
});

// Rota de login
router.post("/login", async (req, res) => {
  try {
    const { cpf, senha } = req.body;

    const user = await User.findOne({ cpf });
    if (!user) {
      return res.status(400).json({ message: "CPF ou senha incorretos." });
    }

    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) {
      return res.status(400).json({ message: "CPF ou senha incorretos." });
    }

    res.json({ message: "Login realizado com sucesso!" });
  } catch (error) {
    console.error("🔥 ERRO REAL NO LOGIN:", error);
    res.status(500).json({ message: "Erro no servidor." });
  }
});

module.exports = router;
