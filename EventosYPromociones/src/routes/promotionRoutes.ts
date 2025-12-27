import { Router } from "express";
import {
    getPromocionesActivas,
    getPromociones,
    getPromocionById,
    createPromocion,
    updatePromocion,
    deletePromocion,
} from "../controllers/promotionController";
import { authenticateToken, requireUsuarioActivo, requireRoles } from "../middlewares/authMiddleware";
import { TipoUsuario } from "../types/express";

const router = Router();

// Aplicar middleware de autenticación y usuario activo a todas las rutas
router.use(authenticateToken, requireUsuarioActivo);

/**
 * CU031 - Ver promociones activas
 * Acceso: Todos los usuarios autenticados (Cliente, Empleado, Admin)
 * NOTA: Esta ruta debe ir ANTES de /:id para evitar conflictos de enrutamiento
 */
router.get("/activas/:activas", getPromocionesActivas);

/**
 * Obtener una promoción por ID
 * Acceso: Solo Empleado y Administrador
 */
router.get("/:id", requireRoles(TipoUsuario.empleado, TipoUsuario.administrador), getPromocionById);

/**
 * Obtener todas las promociones
 * Acceso: Solo Empleado y Administrador
 */
router.get("/", requireRoles(TipoUsuario.empleado, TipoUsuario.administrador), getPromociones);

/**
 * CU50 - Crear nueva promoción
 * Acceso: Solo Administrador
 */
router.post("/", requireRoles(TipoUsuario.administrador), createPromocion);

/**
 * CU51 - Actualizar promoción
 * Acceso: Solo Administrador
 */
router.put("/:id", requireRoles(TipoUsuario.administrador), updatePromocion);

/**
 * CU52 - Eliminar promoción
 * Acceso: Solo Administrador
 */
router.delete("/:id", requireRoles(TipoUsuario.administrador), deletePromocion);

export default router;
