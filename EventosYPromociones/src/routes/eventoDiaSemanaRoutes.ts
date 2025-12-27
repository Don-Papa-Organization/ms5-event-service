import { Router } from "express";
import {
  getEventoDiaSemanaByEvento,
  createEventoDiaSemana,
  updateEventoDiaSemana,
  deleteEventoDiaSemana,
} from "../controllers/eventoDiaSemanaController";
import { authenticateToken, requireUsuarioActivo, requireRoles } from "../middlewares/authMiddleware";
import { TipoUsuario } from "../types/express";

const router = Router();

router.use(authenticateToken, requireUsuarioActivo);

/**
 * Rutas para Días de Semana de Eventos
 * Base: /api/eventos-dias
 */
// Obtener días de un evento específico
router.get("/evento/:idEvento", getEventoDiaSemanaByEvento);

// Crear día de semana para un evento
router.post("/", requireRoles(TipoUsuario.administrador), createEventoDiaSemana);

// Actualizar día de semana
router.put("/:idEventoSemana", requireRoles(TipoUsuario.administrador), updateEventoDiaSemana);

// Eliminar día de semana
router.delete("/:idEventoSemana", requireRoles(TipoUsuario.administrador), deleteEventoDiaSemana);

export default router;
