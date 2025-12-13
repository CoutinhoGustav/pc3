require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const agendamentoRoutes = require("./routes/agendamentoRoutes");
const authRoutes = require("./routes/auth");

const app = express();

// =====================
// Middlewares
// =====================
app.use(cors({
  origin: "*", // pode restringir depois
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(express.json());

// =====================
// Conexão com MongoDB
// =====================
connectDB();

// =====================
// Rotas
// =====================
app.use("/api/auth", authRoutes);
app.use("/api/agendamentos", agendamentoRoutes);

// Rota de teste (health check)
app.get("/", (req, res) => {
  res.status(200).json({ message: "API rodando com sucesso 🚀" });
});

// =====================
// Porta
// =====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
