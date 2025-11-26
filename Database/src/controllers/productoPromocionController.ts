import { Request, Response } from 'express';
import { BaseController } from './baseController';
import { ProductoPromocion } from '../models';
import { ProductoPromocionRepository } from '../repositories/productoPromocionRepository';

export class ProductoPromocionController extends BaseController<ProductoPromocion> {
    private productoPromocionRepository: ProductoPromocionRepository;

    constructor() {
        const productoPromocionRepo = new ProductoPromocionRepository();
        super(productoPromocionRepo);
        this.productoPromocionRepository = productoPromocionRepo;
    }

    async getByPromocion(req: Request, res: Response): Promise<void> {
        try {
            const idPromocion = this.validateId(req.params.idPromocion);
            
            if (!idPromocion) {
                res.status(400).json({
                    success: false,
                    error: 'ID de promoción inválido'
                });
                return;
            }

            const productos = await this.productoPromocionRepository.findByPromocion(idPromocion);
            
            productos.length > 0
                ? res.json({ success: true, data: productos })
                : res.status(404).json({
                    success: false,
                    error: 'No se encontraron productos en esta promoción'
                });
        } catch (error) {
            this.handleError(error, res, 'Error al buscar productos de la promoción');
        }
    }
}