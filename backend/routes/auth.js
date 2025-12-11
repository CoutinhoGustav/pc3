const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware de autenticação
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "Token não fornecido." });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secreto123");
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido." });
  }
};

// Cadastro
router.post("/register", async (req, res) => {
  try {
    const { cpf, senha, nome, email, telefone, dataNascimento, genero } =
      req.body;

    const existingUser = await User.findOne({ cpf });
    if (existingUser)
      return res.status(400).json({ message: "Usuário já existe." });

    const hashedPassword = await bcrypt.hash(senha, 10);

    const user = new User({
      cpf,
      senha: hashedPassword,
      nome,
      email,
      telefone,
      dataNascimento,
      genero,
    });

    await user.save();
    res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
  } catch (err) {
    console.error("🔥 ERRO NO CADASTRO:", err);
    res.status(500).json({ message: "Erro ao cadastrar usuário." });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { cpf, senha } = req.body;
    const user = await User.findOne({ cpf });
    if (!user)
      return res.status(400).json({ message: "CPF ou senha incorretos." });

    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch)
      return res.status(400).json({ message: "CPF ou senha incorretos." });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secreto123",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login realizado com sucesso!",
      token,
      user: {
        nome: user.nome,
        email: user.email,
        telefone: user.telefone,
        cpf: user.cpf,
        dataNascimento: user.dataNascimento,
        genero: user.genero,
        fotoPerfil: user.fotoPerfil,
      },
    });
  } catch (err) {
    console.error("🔥 ERRO NO LOGIN:", err);
    res.status(500).json({ message: "Erro no servidor." });
  }
});

// Rota protegida - Buscar dados do usuário
router.get("/user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-senha");
    if (!user) return res.status(404).json({ message: "Usuário não encontrado." });
    res.json(user);
  } catch (err) {
    console.error("🔥 ERRO AO BUSCAR USUÁRIO:", err);
    res.status(500).json({ message: "Erro ao buscar usuário." });
  }
});

module.exports = router;
