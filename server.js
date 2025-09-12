import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware CORS seguro
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET"],
  allowedHeaders: ["Content-Type"]
}));

// Cache de cotización
let cache = { value: null, timestamp: 0 };

app.get("/api/cotizacion-cache", async (req, res) => {
  const ahora = Date.now();

  // Si no hay cache o pasaron 30 minutos
  if (!cache.value || ahora - cache.timestamp > 30 * 60 * 1000) {
    try {
      const response = await fetch("https://dolarapi.com/v1/cotizaciones/brl");
      const data = await response.json();

      cache.value = Math.floor(data.venta); // 🔥 solo enteros
      cache.timestamp = ahora;
    } catch (err) {
      console.error("❌ Error al obtener la cotización:", err);

      if (cache.value) {
        return res.json({ cotizacion: cache.value, cache: true });
      }

      return res.status(503).json({ error: "No se pudo obtener la cotización" });
    }
  }

  res.json({ cotizacion: cache.value, cache: false });
});

app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
