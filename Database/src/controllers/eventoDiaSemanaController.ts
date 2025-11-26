import { Request, Response } from 'express';
import { BaseController } from './baseController';
import { EventoDiaSemana } from '../models';
import { EventoDiaSemanaRepository } from '../repositories/eventoDiaSemanaRepository';

export class EventoDiaSemanaController extends BaseController<EventoDiaSemana> {
    private eventoDiaSemanaRepository: EventoDiaSemanaRepository;

    constructor() {
        const eventoDiaSemanaRepo = new EventoDiaSemanaRepository();
        super(eventoDiaSemanaRepo);
        this.eventoDiaSemanaRepository = eventoDiaSemanaRepo;
    }

    async getByFecha(req: Request, res: Response): Promise<void> {
        try {
            const { fecha } = req.body;
            
            if (!fecha || isNaN(Date.parse(fecha))) {
                res.status(400).json({
                    success: false,
                    error: 'Fecha es requerida y debe ser válida'
                });
                return;
            }

            const eventos = await this.eventoDiaSemanaRepository.findByFecha(new Date(fecha));
            
            eventos.length > 0
                ? res.json({ success: true, data: eventos })
                : res.status(404).json({
                    success: false,
                    error: 'No se encontraron eventos para esa fecha'
                });
        } catch (error) {
            this.handleError(error, res, 'Error al buscar eventos por fecha');
        }
    }
}