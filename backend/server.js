require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const agendamentoRoutes = require("./routes/agendamentoRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
connectDB();

// Rotas
app.use("/api/auth", require("./routes/auth"));
app.use("/api/agendamentos", agendamentoRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
