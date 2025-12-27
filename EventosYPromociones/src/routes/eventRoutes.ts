import { Router } from "express";
import {
  getEventos,
  getEventoById,
  getEventoDetalle,
  getEventosProximos,
  searchEventosByNombre,
  createEvento,
  updateEvento,
  deleteEvento,
} from "../controllers/eventController";
import { authenticateToken, requireUsuarioActivo, requireRoles } from "../middlewares/authMiddleware";
import { TipoUsuario } from "../types/express";

const router = Router();

router.use(authenticateToken, requireUsuarioActivo);

// Rutas para Eventos
/**
 * CU029 - Ver eventos próximos
 * Acceso: Todos los usuarios autenticados (Cliente, Empleado, Admin)
 */
router.get("/proximos", getEventosProximos);
router.get("/", requireRoles(TipoUsuario.administrador), getEventos);
router.get("/search", searchEventosByNombre);
router.get("/:id/detalle", getEventoDetalle);
router.get("/:id", requireRoles(TipoUsuario.administrador), getEventoById);
router.post("/", requireRoles(TipoUsuario.administrador), createEvento);
router.put("/:id", requireRoles(TipoUsuario.administrador), updateEvento);
router.delete("/:id", requireRoles(TipoUsuario.administrador), deleteEvento);

export default router;
