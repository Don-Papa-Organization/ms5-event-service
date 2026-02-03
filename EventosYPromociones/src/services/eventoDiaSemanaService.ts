import { EventoDiaSemanaRepository } from "../domain/repositories/eventoDiaSemanaRepository";
import { PromocionEventoDiaRepository } from "../domain/repositories/promocionEventoDiaRepository";
import { EventoRepository } from "../domain/repositories/eventoRepository";
import { PromocionRepository } from "../domain/repositories/promocionRepository";
import { EventoDiaSemana } from "../domain/entities";
import { EventoDiaSemanaDto } from "../domain/dtos/eventoDiaSemanaDto";
import { PromocionEventoDiaDto } from "../domain/dtos/promocionEventoDiaDto";

export class EventoDiaSemanaService {
  private eventoDiaSemanaRepository: EventoDiaSemanaRepository;
  private promocionEventoDiaRepository: PromocionEventoDiaRepository;
  private eventoRepository: EventoRepository;
  private promocionRepository: PromocionRepository;

  constructor() {
    this.eventoDiaSemanaRepository = new EventoDiaSemanaRepository();
    this.promocionEventoDiaRepository = new PromocionEventoDiaRepository();
    this.eventoRepository = new EventoRepository();
    this.promocionRepository = new PromocionRepository();
  }

  /**
   * Obtener todos los eventos de días de semana
   */
  async getAllEventosDiaSemana(): Promise<EventoDiaSemana[]> {
    return this.eventoDiaSemanaRepository.findAll();
  }

  /**
   * Obtener días de semana de un evento específico
   */
  async getByEvento(idEvento: number): Promise<EventoDiaSemana[]> {
    return this.eventoDiaSemanaRepository.findByIdEvento(idEvento);
  }

  /**
   * Obtener evento de día de semana por ID
   */
  async getEventoDiaSemanaById(idEventoSemana: number): Promise<EventoDiaSemana | null> {
    return this.eventoDiaSemanaRepository.findById(idEventoSemana);
  }

  /**
   * Obtener eventos de una fecha específica
   */
  async getEventosByFecha(fecha: Date): Promise<EventoDiaSemana[]> {
    return this.eventoDiaSemanaRepository.findByFecha(fecha);
  }

  /**
   * CU029 - Obtener eventos próximos (futuros) con información completa
   * Incluye: nombre del evento, descripción, fecha, hora, promociones asociadas
   */
  async getEventosProximos(): Promise<any[]> {
    const eventosFuturos = await this.eventoDiaSemanaRepository.findEventosFuturos();

    if (!eventosFuturos || eventosFuturos.length === 0) {
      return [];
    }

    // Enriquecer con información del evento y promociones
    const eventosEnriquecidos = await Promise.all(
      eventosFuturos.map(async (eventoDia) => {
        const evento = await this.eventoRepository.findById(eventoDia.idEvento);
        
        // Obtener promociones asociadas a este día de evento
        const promocionesEventoDia = await this.promocionEventoDiaRepository.findByEventoDiaSemana(eventoDia.idEventoSemana!);
        
        const promociones = await Promise.all(
          promocionesEventoDia.map(async (pe) => {
            const promo = await this.promocionRepository.findById(pe.idPromocion);
            return promo ? promo.toJSON() : null;
          })
        );

        return {
          idEventoSemana: eventoDia.idEventoSemana,
          fecha: eventoDia.fecha,
          horaInicio: eventoDia.horaInicio,
          horaFin: eventoDia.horaFin,
          evento: evento ? {
            idEvento: evento.idEvento,
            nombre: evento.nombre,
            descripcion: evento.descripcion
          } : null,
          promociones: promociones.filter(p => p !== null)
        };
      })
    );

    return eventosEnriquecidos;
  }

  /**
   * Crear nuevo evento de día de semana
   * Validaciones:
   * - Hora inicio < hora fin
   */
  async createEventoDiaSemana(data: EventoDiaSemanaDto): Promise<EventoDiaSemana> {
    // Validar campos obligatorios
    if (!data.horaInicio || !data.horaFin || !data.fecha || !data.idEvento) {
      throw new Error("Campos obligatorios: horaInicio, horaFin, fecha, idEvento");
    }

    // Validar que horaInicio < horaFin
    if (data.horaInicio >= data.horaFin) {
      throw new Error("La hora de inicio debe ser menor a la hora de fin");
    }

    return this.eventoDiaSemanaRepository.create(data);
  }

  /**
   * Actualizar evento de día de semana
   */
  async updateEventoDiaSemana(idEventoSemana: number, data: Partial<EventoDiaSemanaDto>): Promise<EventoDiaSemana | null> {
    const eventoExiste = await this.eventoDiaSemanaRepository.findById(idEventoSemana);
    if (!eventoExiste) {
      throw new Error(`Evento de día de semana con ID ${idEventoSemana} no encontrado`);
    }

    // Validar horas si se proporcionan
    if (data.horaInicio && data.horaFin && data.horaInicio >= data.horaFin) {
      throw new Error("La hora de inicio debe ser menor a la hora de fin");
    }

    return this.eventoDiaSemanaRepository.update(idEventoSemana, data);
  }

  /**
   * Eliminar evento de día de semana y sus asociaciones con promociones
   */
  async deleteEventoDiaSemana(idEventoSemana: number): Promise<boolean> {
    const eventoExiste = await this.eventoDiaSemanaRepository.findById(idEventoSemana);
    if (!eventoExiste) {
      throw new Error(`Evento de día de semana con ID ${idEventoSemana} no encontrado`);
    }

    // Eliminar relaciones con promociones
    const promocionesAsociadas = await this.promocionEventoDiaRepository.findByEventoDiaSemana(idEventoSemana);
    for (const promo of promocionesAsociadas) {
      await this.promocionEventoDiaRepository.delete(promo.idPromocionEventoDia);
    }

    return this.eventoDiaSemanaRepository.delete(idEventoSemana);
  }

  /**
   * Asociar una promoción con un evento de día de semana
   */
  async asociarPromocionAEventoDia(data: PromocionEventoDiaDto): Promise<any> {
    // Validar que el evento de día de semana existe
    const eventoDia = await this.eventoDiaSemanaRepository.findById(data.idEventoDiaSemana);
    if (!eventoDia) {
      throw new Error(`Evento de día de semana con ID ${data.idEventoDiaSemana} no encontrado`);
    }

    return this.promocionEventoDiaRepository.create(data);
  }

  /**
   * Obtener promociones asociadas a un evento de día de semana
   */
  async getPromocionesDeEventoDia(idEventoDiaSemana: number): Promise<any[]> {
    const eventoDia = await this.eventoDiaSemanaRepository.findById(idEventoDiaSemana);
    if (!eventoDia) {
      throw new Error(`Evento de día de semana con ID ${idEventoDiaSemana} no encontrado`);
    }

    return this.promocionEventoDiaRepository.findByEventoDiaSemana(idEventoDiaSemana);
  }

  /**
   * Desasociar una promoción de un evento de día de semana
   */
  async desasociarPromocionDeEventoDia(idPromocionEventoDia: number): Promise<boolean> {
    return this.promocionEventoDiaRepository.delete(idPromocionEventoDia);
  }
}
