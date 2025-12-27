import { Router } from "express";
import {
  getAllProductosPromocion,
  getProductoPromocionById,
  getProductosByPromocion,
  createProductoPromocion,
  updateProductoPromocion,
  deleteProductoPromocion,
  getProductosPromocionEnriquecidos,
  getPromocionesDeProducto,
} from "../controllers/productoPromocionController";
import { authenticateToken, requireUsuarioActivo, requireRoles } from "../middlewares/authMiddleware";
import { TipoUsuario } from "../types/express";

const router = Router();

router.use(authenticateToken, requireUsuarioActivo);

// Rutas para ProductoPromocion
router.get("/", getAllProductosPromocion);

// Rutas específicas primero para evitar conflictos con ":id"
router.get("/promocion/:idPromocion/enriquecido", getProductosPromocionEnriquecidos);
router.get("/promocion/:idPromocion", getProductosByPromocion);
router.get("/producto/:idProducto/promociones", getPromocionesDeProducto);

// CRUD base
router.get("/:id", getProductoPromocionById);
router.post("/", requireRoles(TipoUsuario.administrador), createProductoPromocion);
router.put("/:id", requireRoles(TipoUsuario.administrador), updateProductoPromocion);
router.delete("/:id", requireRoles(TipoUsuario.administrador), deleteProductoPromocion);

export default router;
