import { Request, Response } from 'express';
import { BaseController } from './baseController';
import { Evento } from '../models';
import { EventoRepository } from '../repositories/eventoRepository';

export class EventoController extends BaseController<Evento> {
    private eventoRepository: EventoRepository;

    constructor() {
        const eventoRepo = new EventoRepository();
        super(eventoRepo);
        this.eventoRepository = eventoRepo;
    }

    async getByNombre(req: Request, res: Response): Promise<void> {
        try {
            const { nombre } = req.params;
            
            if (!nombre || typeof nombre !== 'string') {
                res.status(400).json({
                    success: false,
                    error: 'Nombre es requerido y debe ser texto'
                });
                return;
            }

            const eventos = await this.eventoRepository.findByNombre(nombre);
            
            eventos.length > 0
                ? res.json({ success: true, data: eventos })
                : res.status(404).json({
                    success: false,
                    error: 'No se encontraron eventos con ese nombre'
                });
        } catch (error) {
            this.handleError(error, res, 'Error al buscar eventos por nombre');
        }
    }
}