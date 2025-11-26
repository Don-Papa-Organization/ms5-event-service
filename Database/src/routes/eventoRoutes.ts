import { Router } from "express";
import { EventoController } from "../controllers/eventoController";

const router = Router();
const eventoController = new EventoController();

router.get('/nombre/:nombre', eventoController.getByNombre.bind(eventoController));
router.get('/', eventoController.getAll.bind(eventoController));
router.get('/:id', eventoController.getById.bind(eventoController));
router.post('/', eventoController.create.bind(eventoController));
router.put('/:id', eventoController.update.bind(eventoController));
router.delete('/:id', eventoController.delete.bind(eventoController));

export default router;
