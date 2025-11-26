import { Router } from "express";
import { PromocionController } from "../controllers/promocionController";

const router = Router();
const promocionController = new PromocionController();

router.get('/activas/:activas', promocionController.getActivas.bind(promocionController));
router.get('/', promocionController.getAll.bind(promocionController));
router.get('/:id', promocionController.getById.bind(promocionController));
router.post('/', promocionController.create.bind(promocionController));
router.put('/:id', promocionController.update.bind(promocionController));
router.delete('/:id', promocionController.delete.bind(promocionController));

export default router;
