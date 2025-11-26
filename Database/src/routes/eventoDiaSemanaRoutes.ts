import { Router } from "express";
import { EventoDiaSemanaController } from "../controllers/eventoDiaSemanaController";

const router = Router();
const eventoDiaSemanaController = new EventoDiaSemanaController();

router.get('/fecha', eventoDiaSemanaController.getByFecha.bind(eventoDiaSemanaController));
router.get('/', eventoDiaSemanaController.getAll.bind(eventoDiaSemanaController));
router.get('/:id', eventoDiaSemanaController.getById.bind(eventoDiaSemanaController));
router.post('/', eventoDiaSemanaController.create.bind(eventoDiaSemanaController));
router.put('/:id', eventoDiaSemanaController.update.bind(eventoDiaSemanaController));
router.delete('/:id', eventoDiaSemanaController.delete.bind(eventoDiaSemanaController));

export default router;
