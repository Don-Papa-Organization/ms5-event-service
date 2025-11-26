import { Request, Response } from 'express';
import { BaseController } from './baseController';
import { PromocionEventoDia } from '../models';
import { PromocionEventoDiaRepository } from '../repositories/promocionEventoDiaRepository';

export class PromocionEventoDiaController extends BaseController<PromocionEventoDia> {
    private promocionEventoDiaRepository: PromocionEventoDiaRepository;

    constructor() {
        const promocionEventoDiaRepo = new PromocionEventoDiaRepository();
        super(promocionEventoDiaRepo);
        this.promocionEventoDiaRepository = promocionEventoDiaRepo;
    }

    async getByEventoDiaSemana(req: Request, res: Response): Promise<void> {
        try {
            const idEventoDiaSemana = this.validateId(req.params.idEventoDiaSemana);
            
            if (!idEventoDiaSemana) {
                res.status(400).json({
                    success: false,
                    error: 'ID de evento del día inválido'
                });
                return;
            }

            const promociones = await this.promocionEventoDiaRepository.findByEventoDiaSemana(idEventoDiaSemana);
            
            promociones.length > 0
                ? res.json({ success: true, data: promociones })
                : res.status(404).json({
                    success: false,
                    error: 'No se encontraron promociones para este evento del día'
                });
        } catch (error) {
            this.handleError(error, res, 'Error al buscar promociones del evento');
        }
    }
}