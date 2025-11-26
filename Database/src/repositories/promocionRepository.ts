import { BaseRepository } from "./baseRepository";
import { Promocion } from "../models";

export class PromocionRepository extends BaseRepository<Promocion> {
    constructor() {
        super(Promocion);
    }

    async findActive(activo: boolean): Promise<Promocion[]> {
        return this.model.findAll({ where: { activo: activo } });
    }
}
