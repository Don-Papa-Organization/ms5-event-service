import { Router } from "express";
import {
  getPromocionEventoDias,
  getPromocionEventoDiaById,
  getPromocionesXEventoDiaSemana,
  createPromocionEventoDia,
  updatePromocionEventoDia,
  deletePromocionEventoDia,
} from "../controllers/promocionEventoDiaController";
import { authenticateToken, requireUsuarioActivo, requireRoles } from "../middlewares/authMiddleware";
import { TipoUsuario } from "../types/express";

const router = Router();

// Aplicar middleware de autenticación, usuario activo y solo administrador
router.use(authenticateToken, requireUsuarioActivo, requireRoles(TipoUsuario.administrador));

/**
 * Obtener todas las relaciones de promoción con evento día semana
 * Acceso: Solo Administrador
 */
router.get("/", getPromocionEventoDias);

/**
 * Obtener promociones de un evento día semana específico
 * Acceso: Solo Administrador
 * NOTA: Esta ruta debe ir ANTES de /:id para evitar conflictos de enrutamiento
 */
router.get("/evento-dia/:idEventoDiaSemana", getPromocionesXEventoDiaSemana);

/**
 * Obtener una relación por ID
 * Acceso: Solo Administrador
 */
router.get("/:id", getPromocionEventoDiaById);

/**
 * Crear nueva relación promoción-evento día semana
 * Acceso: Solo Administrador
 */
router.post("/", createPromocionEventoDia);

/**
 * Actualizar relación
 * Acceso: Solo Administrador
 */
router.put("/:id", updatePromocionEventoDia);

/**
 * Eliminar relación
 * Acceso: Solo Administrador
 */
router.delete("/:id", deletePromocionEventoDia);

export default router;
