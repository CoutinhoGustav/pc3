const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// 📩 Rota de cadastro
router.post('/register', async (req, res) => {
  try {
    const { cpf, senha } = req.body;

    const userExists = await User.findOne({ cpf });
    if (userExists) return res.status(400).json({ message: 'Usuário já existe' });

    const hashedPassword = await bcrypt.hash(senha, 10);

    const newUser = new User({ cpf, senha: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error });
  }
});

// 🔐 Rota de login
router.post('/login', async (req, res) => {
  try {
    const { cpf, senha } = req.body;
    const user = await User.findOne({ cpf });

    if (!user) return res.status(400).json({ message: 'Usuário não encontrado' });

    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) return res.status(400).json({ message: 'Senha incorreta' });

    res.status(200).json({ message: 'Login bem-sucedido!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error });
  }
});

module.exports = router;
