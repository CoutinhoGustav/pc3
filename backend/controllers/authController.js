const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

exports.registerUser = async (req, res) => {
  const { cpf, senha } = req.body;

  try {
    const userExists = await User.findOne({ cpf });
    if (userExists) {
      return res.status(400).json({ message: "CPF já cadastrado." });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const user = await User.create({
      cpf,
      senha: hashedPassword,
    });

    return res.status(201).json({
      message: "Usuário registrado com sucesso!",
    });
  } catch (error) {
    return res.status(500).json({ message: "Erro no servidor.", error });
  }
};

exports.loginUser = async (req, res) => {
  const { cpf, senha } = req.body;

  try {
    const user = await User.findOne({ cpf });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) {
      return res.status(400).json({ message: "Senha incorreta." });
    }

    return res.json({
      message: "Login realizado!",
      token: generateToken(user._id),
      user: {
        id: user._id,
        cpf: user.cpf,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Erro no servidor." });
  }
};
