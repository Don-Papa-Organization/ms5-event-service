import { Router } from "express";
import { PromocionEventoDiaController } from "../controllers/promocionEventoDiaController";

const router = Router();
const promocionEventoDiaController = new PromocionEventoDiaController();

router.get('/evento-dia/:idEventoDiaSemana', promocionEventoDiaController.getByEventoDiaSemana.bind(promocionEventoDiaController));
router.get('/', promocionEventoDiaController.getAll.bind(promocionEventoDiaController));
router.get('/:id', promocionEventoDiaController.getById.bind(promocionEventoDiaController));
router.post('/', promocionEventoDiaController.create.bind(promocionEventoDiaController));
router.put('/:id', promocionEventoDiaController.update.bind(promocionEventoDiaController));
router.delete('/:id', promocionEventoDiaController.delete.bind(promocionEventoDiaController));

export default router;
