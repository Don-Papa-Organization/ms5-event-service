import { EventoDiaSemana } from "../entities";
import { Op } from "sequelize";

export class EventoDiaSemanaRepository {
  constructor() {
    // Inicialización si es necesaria
  }

  async findAll(): Promise<EventoDiaSemana[]> {
    return EventoDiaSemana.findAll();
  }

  /**
   * Obtener eventos con fechas futuras (mayores o iguales a hoy)
   */
  async findEventosFuturos(): Promise<EventoDiaSemana[]> {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    return EventoDiaSemana.findAll({
      where: {
        fecha: {
          [Op.gte]: hoy
        }
      },
      order: [['fecha', 'ASC'], ['horaInicio', 'ASC']]
    });
  }

  async findById(idEventoSemana: number): Promise<EventoDiaSemana | null> {
    return EventoDiaSemana.findByPk(idEventoSemana);
  }

  async findByFecha(fecha: Date): Promise<EventoDiaSemana[]> {
    return EventoDiaSemana.findAll({ where: { fecha } });
  }

  async findByIdEvento(idEvento: number): Promise<EventoDiaSemana[]> {
    return EventoDiaSemana.findAll({ where: { idEvento } });
  }

  async create(data: Partial<EventoDiaSemana>): Promise<EventoDiaSemana> {
    return EventoDiaSemana.create(data);
  }

  async update(idEventoSemana: number, data: Partial<EventoDiaSemana>): Promise<EventoDiaSemana | null> {
    const eventoDiaSemana = await EventoDiaSemana.findByPk(idEventoSemana);
    if (eventoDiaSemana) {
      return eventoDiaSemana.update(data);
    }
    return null;
  }

  async delete(idEventoSemana: number): Promise<boolean> {
    const eventoDiaSemana = await EventoDiaSemana.findByPk(idEventoSemana);
    if (eventoDiaSemana) {
      await eventoDiaSemana.destroy();
      return true;
    }
    return false;
  }
}