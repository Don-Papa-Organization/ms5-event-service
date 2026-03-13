import express, { Express, Request, Response } from "express";
import promotionRoutes from "./routes/promotionRoutes";
import eventRoutes from "./routes/eventRoutes";
import eventoDiaSemanaRoutes from "./routes/eventoDiaSemanaRoutes";
import productoPromocionRoutes from "./routes/productoPromocionRoutes";
import promocionEventoDiaRoutes from "./routes/promocionEventoDiaRoutes";
import { errorMiddleware } from "./middlewares/error.middleware";

const app: Express = express();

// Aumentar límite de body para JSON
app.use(express.json({ limit: '50mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use("/api/promotions", promotionRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/eventos-dias", eventoDiaSemanaRoutes);
app.use("/api/productos-promocion", productoPromocionRoutes);
app.use("/api/promocion-evento-dia", promocionEventoDiaRoutes);

// Middleware de manejo de errores - DEBE IR AL FINAL
app.use(errorMiddleware);

export default app;