const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("🔌 Tentando conectar ao MongoDB...");

    const promise = mongoose.connect(process.env.MONGO_URL);

    // Timeout manual para testar ambiente StackBlitz
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("⏳ Timeout: sem resposta do MongoDB (StackBlitz bloqueou)")), 8000)
    );

    await Promise.race([promise, timeout]);

    console.log("✔ MongoDB conectado com sucesso!");
  } catch (err) {
    console.error("❌ Erro ao conectar ao MongoDB:", err.message);
  }
};

module.exports = connectDB;
