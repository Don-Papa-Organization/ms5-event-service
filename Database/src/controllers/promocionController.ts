import { Request, Response } from 'express';
import { BaseController } from './baseController';
import { Promocion } from '../models';
import { PromocionRepository } from '../repositories/promocionRepository';

export class PromocionController extends BaseController<Promocion> {
    private promocionRepository: PromocionRepository;

    constructor() {
        const promocionRepo = new PromocionRepository();
        super(promocionRepo);
        this.promocionRepository = promocionRepo;
    }

    async getActivas(req: Request, res: Response): Promise<any> {
        try {
            const { activas } = req.params
            const activasBoolean = activas === "true" ? true : activas === "false" ? false : null 

            if(activasBoolean === null){
                return res.status(400).json({ message: "Activo debe ser true o false" })
            }

            const promociones = await this.promocionRepository.findActive(activasBoolean);
            
            promociones.length > 0
                ? res.json({ success: true, data: promociones })
                : res.status(404).json({
                    success: false,
                    error: 'No hay promociones activas'
                });
        } catch (error) {
            this.handleError(error, res, 'Error al buscar promociones activas');
        }
    }
}