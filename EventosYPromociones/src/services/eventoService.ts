import { EventoRepository } from "../domain/repositories/eventoRepository";
import { EventoDiaSemanaRepository } from "../domain/repositories/eventoDiaSemanaRepository";
import { PromocionEventoDiaRepository } from "../domain/repositories/promocionEventoDiaRepository";
import { PromocionRepository } from "../domain/repositories/promocionRepository";
import { Evento } from "../domain/entities";
import { EventoDto } from "../domain/dtos/eventoDto";
import { AppError } from "../middlewares/error.middleware";

export class EventoService {
  private eventoRepository: EventoRepository;
  private eventoDiaSemanaRepository: EventoDiaSemanaRepository;
  private promocionEventoDiaRepository: PromocionEventoDiaRepository;
  private promocionRepository: PromocionRepository;

  constructor() {
    this.eventoRepository = new EventoRepository();
    this.eventoDiaSemanaRepository = new EventoDiaSemanaRepository();
    this.promocionEventoDiaRepository = new PromocionEventoDiaRepository();
    this.promocionRepository = new PromocionRepository();
  }

  /**
   * Obtener todos los eventos
   */
  async getAllEventos(filtros?: { busqueda?: string }): Promise<Evento[]> {
    return this.eventoRepository.searchForAdmin(filtros);
  }

  /**
   * Obtener evento por ID
   */
  async getEventoById(idEvento: number): Promise<Evento | null> {
    return this.eventoRepository.findById(idEvento);
  }

  /**
   * Buscar eventos por nombre
   */
  async searchEventosByNombre(nombre: string): Promise<Evento[]> {
    return this.eventoRepository.findByNombre(nombre);
  }

  /**
   * Crear nuevo evento
   * @param data DTO del evento
   * @returns Evento creado
   */
  async createEvento(data: EventoDto): Promise<Evento> {
    // Validar campos obligatorios
    if (!data.nombre || !data.descripcion) {
      throw new AppError("Nombre y descripción son campos obligatorios", 400);
    }

    return this.eventoRepository.create(data);
  }

  /**
   * Actualizar evento
   */
  async updateEvento(idEvento: number, data: Partial<EventoDto>): Promise<Evento | null> {
    const eventoExiste = await this.eventoRepository.findById(idEvento);
    if (!eventoExiste) {
      throw new AppError(`Evento con ID ${idEvento} no encontrado`, 404);
    }

    return this.eventoRepository.update(idEvento, data);
  }

  /**
   * Eliminar evento y sus registros de días de semana
   * @param idEvento ID del evento a eliminar
   */
  async deleteEvento(idEvento: number): Promise<boolean> {
    const eventoExiste = await this.eventoRepository.findById(idEvento);
    if (!eventoExiste) {
      throw new AppError(`Evento con ID ${idEvento} no encontrado`, 404);
    }

    // Eliminar registros de eventoDiaSemana asociados
    const eventoDiaSemanas = await this.eventoDiaSemanaRepository.findByIdEvento(idEvento);
    for (const eda of eventoDiaSemanas) {
      await this.eventoDiaSemanaRepository.delete(eda.idEventoSemana);
    }

    return this.eventoRepository.delete(idEvento);
  }

  /**
   * CU030 - Obtener detalle completo de un evento
   * Incluye horarios (días) y promociones asociadas a cada día
   */
  async getEventoDetalle(idEvento: number): Promise<any | null> {
    const evento = await this.eventoRepository.findById(idEvento);
    if (!evento) {
      return null;
    }

    const dias = await this.eventoDiaSemanaRepository.findByIdEvento(idEvento);

    const diasConPromos = await Promise.all(
      dias.map(async (dia) => {
        const promosEventoDia = await this.promocionEventoDiaRepository.findByEventoDiaSemana(dia.idEventoSemana!);
        const promociones = await Promise.all(
          promosEventoDia.map(async (ped) => {
            const promo = await this.promocionRepository.findById(ped.idPromocion);
            return promo ? promo.toJSON() : null;
          })
        );

        return {
          idEventoSemana: dia.idEventoSemana,
          fecha: dia.fecha,
          horaInicio: dia.horaInicio,
          horaFin: dia.horaFin,
          promociones: promociones.filter((p) => p !== null),
        };
      })
    );

    return {
      idEvento: evento.idEvento,
      nombre: evento.nombre,
      descripcion: evento.descripcion,
      horarios: diasConPromos,
      precio: null,
      restricciones: null,
    };
  }
}
