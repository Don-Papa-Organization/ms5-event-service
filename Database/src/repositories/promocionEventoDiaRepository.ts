import { BaseRepository } from "./baseRepository";
import { PromocionEventoDia } from "../models";

export class PromocionEventoDiaRepository extends BaseRepository<PromocionEventoDia> {
    constructor() {
        super(PromocionEventoDia);
    }

    async findByEventoDiaSemana(idEventoDiaSemana: number): Promise<PromocionEventoDia[]> {
        return this.model.findAll({ where: { idEventoDiaSemana } });
    }
}
