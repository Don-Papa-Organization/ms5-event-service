import { BaseRepository } from "./baseRepository";
import { Evento } from "../models";

export class EventoRepository extends BaseRepository<Evento> {
    constructor() {
        super(Evento);
    }

    async findByNombre(nombre: string): Promise<Evento[]> {
        return this.model.findAll({ where: { nombre } });
    }
}
