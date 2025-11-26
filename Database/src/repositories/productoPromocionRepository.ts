import { BaseRepository } from "./baseRepository";
import { ProductoPromocion } from "../models";

export class ProductoPromocionRepository extends BaseRepository<ProductoPromocion> {
    constructor() {
        super(ProductoPromocion);
    }

    async findByPromocion(idPromocion: number): Promise<ProductoPromocion[]> {
        return this.model.findAll({ where: { idPromocion } });
    }
}
