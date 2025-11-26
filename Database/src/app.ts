import express, { Express } from "express";
import {
	eventoRoutes,
	eventoDiaSemanaRoutes,
	promocionRoutes,
	productoPromocionRoutes,
	promocionEventoDiaRoutes,
} from './routes';

const app: Express = express();

app.use(express.json());

app.use('/db/eventos', eventoRoutes);
app.use('/db/eventos-dia-semana', eventoDiaSemanaRoutes);
app.use('/db/promociones', promocionRoutes);
app.use('/db/productos-promocion', productoPromocionRoutes);
app.use('/db/promociones-evento-dia', promocionEventoDiaRoutes);

export default app;