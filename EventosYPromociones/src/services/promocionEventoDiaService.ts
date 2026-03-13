import { PromocionEventoDiaRepository } from "../domain/repositories/promocionEventoDiaRepository";
import { PromocionRepository } from "../domain/repositories/promocionRepository";
import { EventoDiaSemanaRepository } from "../domain/repositories/eventoDiaSemanaRepository";
import { PromocionEventoDia } from "../domain/entities";
import { PromocionEventoDiaDto } from "../domain/dtos/promocionEventoDiaDto";
import { AppError } from "../middlewares/error.middleware";

export class PromocionEventoDiaService {
  private promocionEventoDiaRepository: PromocionEventoDiaRepository;
  private promocionRepository: PromocionRepository;
  private eventoDiaSemanaRepository: EventoDiaSemanaRepository;

  constructor() {
    this.promocionEventoDiaRepository = new PromocionEventoDiaRepository();
    this.promocionRepository = new PromocionRepository();
    this.eventoDiaSemanaRepository = new EventoDiaSemanaRepository();
  }

  /**
   * Obtener todas las relaciones de promoción con evento día semana
   */
  async getAllPromocionEventoDias(): Promise<PromocionEventoDia[]> {
    return this.promocionEventoDiaRepository.findAll();
  }

  /**
   * Obtener relación por ID
   */
  async getPromocionEventoDiaById(idPromocionEventoDia: number): Promise<PromocionEventoDia | null> {
    return this.promocionEventoDiaRepository.findById(idPromocionEventoDia);
  }

  /**
   * Obtener promociones de un evento día semana específico con detalles enriquecidos
   */
  async getPromocionesXEventoDiaSemana(idEventoDiaSemana: number): Promise<any[]> {
    const eventoDiaSemana = await this.eventoDiaSemanaRepository.findById(idEventoDiaSemana);
    if (!eventoDiaSemana) {
      throw new AppError(`Evento día semana con ID ${idEventoDiaSemana} no encontrado`, 404);
    }

    const promocionesEventoDia = await this.promocionEventoDiaRepository.findByEventoDiaSemana(idEventoDiaSemana);
    
    // Enriquecer cada relación con los detalles de la promoción
    const promocionesEnriquecidas = await Promise.all(
      promocionesEventoDia.map(async (ped) => {
        const promocion = await this.promocionRepository.findById(ped.idPromocion);
        return {
          idPromocionEventoDia: ped.idPromocionEventoDia,
          idPromocion: ped.idPromocion,
          idEventoDiaSemana: ped.idEventoDiaSemana,
          detallePromocion: promocion ? {
            idPromocion: promocion.idPromocion,
            nombre: promocion.nombre,
            descripcion: promocion.descripcion,
            porcentajeDescuento: (promocion as any).porcentajeDescuento,
            precioFijo: (promocion as any).precioFijo,
            tipoPromocion: promocion.tipoPromocion,
            fechainicio: promocion.fechaInicio,
            fechafin: promocion.fechaFin,
            activo: promocion.activo
          } : null
        };
      })
    );

    return promocionesEnriquecidas;
  }

  /**
   * Crear nueva relación promoción-evento día semana
   * Validaciones:
   * - Campos obligatorios
   * - Promoción existe
   * - Evento día semana existe
   * - No hay duplicados
   */
  async createPromocionEventoDia(data: PromocionEventoDiaDto): Promise<PromocionEventoDia> {
    // Validar campos obligatorios
    if (!data.idPromocion || !data.idEventoDiaSemana) {
      throw new AppError("Campos obligatorios: idPromocion, idEventoDiaSemana", 400);
    }

    // Validar que la promoción existe
    const promocion = await this.promocionRepository.findById(data.idPromocion);
    if (!promocion) {
      throw new AppError(`Promoción con ID ${data.idPromocion} no encontrada`, 404);
    }

    // Validar que el evento día semana existe
    const eventoDiaSemana = await this.eventoDiaSemanaRepository.findById(data.idEventoDiaSemana);
    if (!eventoDiaSemana) {
      throw new AppError(`Evento día semana con ID ${data.idEventoDiaSemana} no encontrado`, 404);
    }

    return this.promocionEventoDiaRepository.create(data);
  }

  /**
   * Actualizar relación promoción-evento día semana
   */
  async updatePromocionEventoDia(
    idPromocionEventoDia: number,
    data: Partial<PromocionEventoDiaDto>
  ): Promise<PromocionEventoDia | null> {
    const promocionEventoDiaExiste = await this.promocionEventoDiaRepository.findById(idPromocionEventoDia);
    if (!promocionEventoDiaExiste) {
      throw new AppError(`Relación promoción-evento día semana con ID ${idPromocionEventoDia} no encontrada`, 404);
    }

    // Validar que la promoción existe si se proporciona
    if (data.idPromocion) {
      const promocion = await this.promocionRepository.findById(data.idPromocion);
      if (!promocion) {
        throw new AppError(`Promoción con ID ${data.idPromocion} no encontrada`, 404);
      }
    }

    // Validar que el evento día semana existe si se proporciona
    if (data.idEventoDiaSemana) {
      const eventoDiaSemana = await this.eventoDiaSemanaRepository.findById(data.idEventoDiaSemana);
      if (!eventoDiaSemana) {
        throw new AppError(`Evento día semana con ID ${data.idEventoDiaSemana} no encontrada`, 404);
      }
    }

    return this.promocionEventoDiaRepository.update(idPromocionEventoDia, data);
  }

  /**
   * Eliminar relación
   */
  async deletePromocionEventoDia(idPromocionEventoDia: number): Promise<boolean> {
    const existe = await this.promocionEventoDiaRepository.findById(idPromocionEventoDia);
    if (!existe) {
      throw new AppError(`Relación promoción-evento día semana con ID ${idPromocionEventoDia} no encontrada`, 404);
    }

    return this.promocionEventoDiaRepository.delete(idPromocionEventoDia);
  }
}
