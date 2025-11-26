import { Router } from "express";
import { ProductoPromocionController } from "../controllers/productoPromocionController";

const router = Router();
const productoPromocionController = new ProductoPromocionController();

router.get('/promocion/:idPromocion', productoPromocionController.getByPromocion.bind(productoPromocionController));
router.get('/', productoPromocionController.getAll.bind(productoPromocionController));
router.get('/:id', productoPromocionController.getById.bind(productoPromocionController));
router.post('/', productoPromocionController.create.bind(productoPromocionController));
router.put('/:id', productoPromocionController.update.bind(productoPromocionController));
router.delete('/:id', productoPromocionController.delete.bind(productoPromocionController));

export default router;
