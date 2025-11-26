import { BaseRepository } from "./baseRepository";
import { EventoDiaSemana } from "../models";

export class EventoDiaSemanaRepository extends BaseRepository<EventoDiaSemana> {
    constructor() {
        super(EventoDiaSemana);
    }

    async findByFecha(fecha: Date): Promise<EventoDiaSemana[]> {
        return this.model.findAll({ where: { fecha } });
    }
}
