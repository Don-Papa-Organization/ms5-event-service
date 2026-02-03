import { PromocionRepository } from "../domain/repositories/promocionRepository";
import { ProductoPromocionService } from "./productoPromocionService";
import { Promocion } from "../domain/entities";
import { PromocionDto } from "../domain/dtos/promocionDto";
import { ProductoPromocionDto } from "../domain/dtos/productoPromocionDto";

export class PromocionService {
  private promocionRepository: PromocionRepository;
  private productoPromocionService: ProductoPromocionService;

  constructor() {
    this.promocionRepository = new PromocionRepository();
    this.productoPromocionService = new ProductoPromocionService();
  }

  /**
   * Obtener todas las promociones
   */
  async getAllPromociones(): Promise<Promocion[]> {
    return this.promocionRepository.findAll();
  }

  /**
   * Obtener promoción por ID
   */
  async getPromocionById(idPromocion: number): Promise<Promocion | null> {
    return this.promocionRepository.findById(idPromocion);
  }

  /**
   * Obtener promociones activas o inactivas
   */
  async getPromocionesActivas(activo: boolean): Promise<Promocion[]> {
    return this.promocionRepository.findActive(activo);
  }

  /**
   * Crear nueva promoción
   * Validaciones:
   * - Campos obligatorios
   * - Fecha fin > fecha inicio
   * - Tipo de promoción válido
   */
  async createPromocion(data: PromocionDto): Promise<Promocion> {
    // Validar campos obligatorios
    if (!data.nombre || !data.descripcion || !data.fechaInicio || !data.fechaFin || !data.tipoPromocion) {
      throw new Error("Campos obligatorios: nombre, descripcion, fechaInicio, fechaFin, tipoPromocion");
    }

    // Validar tipo de promoción
    const tiposValidos = ["porcentaje", "precio_fijo"];
    if (!tiposValidos.includes(data.tipoPromocion)) {
      throw new Error(`Tipo de promoción inválido. Válidos: ${tiposValidos.join(", ")}`);
    }

    // Validar fechas
    const inicio = new Date(data.fechaInicio);
    const fin = new Date(data.fechaFin);

    if (fin <= inicio) {
      throw new Error("La fecha de fin debe ser posterior a la fecha de inicio");
    }

    return this.promocionRepository.create(data);
  }

  /**
   * Actualizar promoción
   */
  async updatePromocion(idPromocion: number, data: Partial<PromocionDto>): Promise<Promocion | null> {
    const promocionExiste = await this.promocionRepository.findById(idPromocion);
    if (!promocionExiste) {
      throw new Error(`Promoción con ID ${idPromocion} no encontrada`);
    }

    // Validar fechas si se proporcionan
    if (data.fechaInicio && data.fechaFin) {
      const inicio = new Date(data.fechaInicio);
      const fin = new Date(data.fechaFin);
      if (fin <= inicio) {
        throw new Error("La fecha de fin debe ser posterior a la fecha de inicio");
      }
    }

    // Validar tipo de promoción si se proporciona
    if (data.tipoPromocion) {
      const tiposValidos = ["porcentaje", "precio_fijo"];
      if (!tiposValidos.includes(data.tipoPromocion)) {
        throw new Error(`Tipo de promoción inválido. Válidos: ${tiposValidos.join(", ")}`);
      }
    }

    return this.promocionRepository.update(idPromocion, data);
  }

  /**
   * Eliminar promoción y sus productos asociados
   */
  async deletePromocion(idPromocion: number): Promise<boolean> {
    const promocionExiste = await this.promocionRepository.findById(idPromocion);
    if (!promocionExiste) {
      throw new Error(`Promoción con ID ${idPromocion} no encontrada`);
    }

    // Eliminar productos de la promoción usando el servicio
    const productosPromocion = await this.productoPromocionService.getProductosByPromocion(idPromocion);
    for (const producto of productosPromocion) {
      await this.productoPromocionService.deleteProductoPromocion(producto.idProductoPromocion);
    }

    return this.promocionRepository.delete(idPromocion);
  }

  /**
   * Agregar producto a una promoción
   */
  async agregarProductoAPromocion(data: ProductoPromocionDto): Promise<any> {
    return this.productoPromocionService.createProductoPromocion(data);
  }

  /**
   * Obtener productos de una promoción
   */
  async getProductosDePromocion(idPromocion: number): Promise<any[]> {
    return this.productoPromocionService.getProductosByPromocion(idPromocion);
  }

  /**
   * Actualizar producto de una promoción
   */
  async updateProductoPromocion(idProductoPromocion: number, data: Partial<ProductoPromocionDto>): Promise<any | null> {
    return this.productoPromocionService.updateProductoPromocion(idProductoPromocion, data);
  }

  /**
   * Remover producto de una promoción
   */
  async removerProductoDePromocion(idProductoPromocion: number): Promise<boolean> {
    return this.productoPromocionService.deleteProductoPromocion(idProductoPromocion);
  }

  /**
   * Cambiar estado activo de una promoción
   * @param idPromocion ID de la promoción
   * @param activo Nuevo estado (true/false)
   * @returns Promoción actualizada
   */
  async togglePromocionActiva(idPromocion: number, activo: boolean): Promise<Promocion | null> {
    const promocionExiste = await this.promocionRepository.findById(idPromocion);
    if (!promocionExiste) {
      throw new Error(`Promoción con ID ${idPromocion} no encontrada`);
    }

    return this.promocionRepository.update(idPromocion, { activo });
  }
}
