const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("🔌 Tentando conectar ao MongoDB...");
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✔ MongoDB conectado com sucesso!");
  } catch (err) {
    console.error("❌ Erro ao conectar ao MongoDB:", err.message);
  }
};

module.exports = connectDB;
