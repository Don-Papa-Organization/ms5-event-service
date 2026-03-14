import { Evento } from "../entities";
import { Op } from "sequelize";

export class EventoRepository {
  constructor() {
    // Inicialización si es necesaria
  }

  async findAll(): Promise<Evento[]> {
    return Evento.findAll();
  }

  async findById(idEvento: number): Promise<Evento | null> {
    return Evento.findByPk(idEvento);
  }

  async findByNombre(nombre: string): Promise<Evento[]> {
    const termino = nombre.trim();

    return Evento.findAll({
      where: {
        [Op.or]: [
          { nombre: { [Op.like]: `%${termino}%` } },
          { descripcion: { [Op.like]: `%${termino}%` } }
        ]
      }
    });
  }

  async searchForAdmin(filtros?: { busqueda?: string }): Promise<Evento[]> {
    const termino = filtros?.busqueda?.trim();

    const where = termino
      ? {
          [Op.or]: [
            { nombre: { [Op.like]: `%${termino}%` } },
            { descripcion: { [Op.like]: `%${termino}%` } }
          ]
        }
      : undefined;

    return Evento.findAll({ where });
  }

  async create(data: Partial<Evento>): Promise<Evento> {
    return Evento.create(data);
  }

  async update(idEvento: number, data: Partial<Evento>): Promise<Evento | null> {
    const evento = await Evento.findByPk(idEvento);
    if (evento) {
      return evento.update(data);
    }
    return null;
  }

  async delete(idEvento: number): Promise<boolean> {
    const evento = await Evento.findByPk(idEvento);
    if (evento) {
      await evento.destroy();
      return true;
    }
    return false;
  }
}