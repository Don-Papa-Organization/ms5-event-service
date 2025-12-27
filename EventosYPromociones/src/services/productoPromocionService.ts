import { ProductoPromocionRepository } from "../domain/repositories/productoPromocionRepository";
import { PromocionRepository } from "../domain/repositories/promocionRepository";
import { InventoryService } from "./apis/inventoryService";
import { ProductoPromocion } from "../domain/entities";
import { ProductoPromocionDto } from "../domain/dto/productoPromocionDto";

export class ProductoPromocionService {
  private productoPromocionRepository: ProductoPromocionRepository;
  private promocionRepository: PromocionRepository;
  private inventoryService: InventoryService;

  constructor() {
    this.productoPromocionRepository = new ProductoPromocionRepository();
    this.promocionRepository = new PromocionRepository();
    this.inventoryService = new InventoryService();
  }

  /**
   * Obtener todos los productos de promociones
   */
  async getAllProductosPromocion(): Promise<ProductoPromocion[]> {
    return this.productoPromocionRepository.findAll();
  }

  /**
   * Obtener producto de promoción por ID
   */
  async getProductoPromocionById(idProductoPromocion: number): Promise<ProductoPromocion | null> {
    return this.productoPromocionRepository.findById(idProductoPromocion);
  }

  /**
   * Obtener productos de una promoción específica
   * @param idPromocion ID de la promoción
   * @returns Array de ProductoPromocion con detalles del inventario
   */
  async getProductosByPromocion(idPromocion: number, accessToken?: string): Promise<any[]> {
    // Validar que la promoción existe
    const promocion = await this.promocionRepository.findById(idPromocion);
    if (!promocion) {
      throw new Error(`Promoción con ID ${idPromocion} no encontrada`);
    }

    // Obtener productos de la promoción
    const productosPromocion = await this.productoPromocionRepository.findByPromocion(idPromocion);

    // Enriquecer con detalles del inventario
    const productosEnriquecidos = await Promise.all(
      productosPromocion.map(async (pp) => {
        try {
          const detalleProducto = await this.inventoryService.getProductoById(pp.idProducto, accessToken);
          return {
            ...pp.toJSON(),
            detalleProducto,
          };
        } catch {
          // Si no se puede obtener el detalle, devolver solo el producto de promoción
          return pp.toJSON();
        }
      })
    );

    return productosEnriquecidos;
  }

  /**
   * Crear producto de promoción con validación de inventario
   * @param data DTO del producto promoción
   * @returns ProductoPromocion creado
   */
  async createProductoPromocion(data: ProductoPromocionDto, accessToken?: string): Promise<ProductoPromocion> {
    // Validar campos obligatorios
    if (!data.idProducto || !data.idPromocion || !data.cantidadMinima) {
      throw new Error("Campos obligatorios: idProducto, idPromocion, cantidadMinima");
    }

    // Validar que la promoción existe
    const promocion = await this.promocionRepository.findById(data.idPromocion);
    if (!promocion) {
      throw new Error(`Promoción con ID ${data.idPromocion} no encontrada`);
    }

    // Validar que el producto existe en inventario
    const productoExiste = await this.inventoryService.productoExists(data.idProducto, accessToken);
    if (!productoExiste) {
      throw new Error(`Producto con ID ${data.idProducto} no existe en inventario`);
    }

    // Validar cantidadMinima
    if (data.cantidadMinima <= 0) {
      throw new Error("La cantidad mínima debe ser mayor a 0");
    }

    // Validar que al menos uno de los descuentos está presente
    if (
      !data.precioPromocional &&
      (data.porcentajeDescuento === undefined || data.porcentajeDescuento === null)
    ) {
      throw new Error("Debe proporcionar precioPromocional o porcentajeDescuento");
    }

    // Validar porcentaje
    if (data.porcentajeDescuento !== undefined && data.porcentajeDescuento !== null) {
      if (data.porcentajeDescuento < 0 || data.porcentajeDescuento > 100) {
        throw new Error("El porcentaje de descuento debe estar entre 0 y 100");
      }
    }

    return this.productoPromocionRepository.create(data);
  }

  /**
   * Actualizar producto de promoción
   */
  async updateProductoPromocion(idProductoPromocion: number, data: Partial<ProductoPromocionDto>, accessToken?: string): Promise<ProductoPromocion | null> {
    const productoExiste = await this.productoPromocionRepository.findById(idProductoPromocion);
    if (!productoExiste) {
      throw new Error(`Producto de promoción con ID ${idProductoPromocion} no encontrado`);
    }

    // Si se intenta cambiar el producto, validar que existe en inventario
    if (data.idProducto) {
      const productoExisteEnInventario = await this.inventoryService.productoExists(data.idProducto, accessToken);
      if (!productoExisteEnInventario) {
        throw new Error(`Producto con ID ${data.idProducto} no existe en inventario`);
      }
    }

    // Validar cantidadMinima si se proporciona
    if (data.cantidadMinima !== undefined && data.cantidadMinima <= 0) {
      throw new Error("La cantidad mínima debe ser mayor a 0");
    }

    // Validar porcentaje si se proporciona
    if (data.porcentajeDescuento !== undefined && data.porcentajeDescuento !== null) {
      if (data.porcentajeDescuento < 0 || data.porcentajeDescuento > 100) {
        throw new Error("El porcentaje de descuento debe estar entre 0 y 100");
      }
    }

    return this.productoPromocionRepository.update(idProductoPromocion, data);
  }

  /**
   * Eliminar producto de promoción
   */
  async deleteProductoPromocion(idProductoPromocion: number): Promise<boolean> {
    const productoExiste = await this.productoPromocionRepository.findById(idProductoPromocion);
    if (!productoExiste) {
      throw new Error(`Producto de promoción con ID ${idProductoPromocion} no encontrado`);
    }

    return this.productoPromocionRepository.delete(idProductoPromocion);
  }

  /**
   * Obtener productos de promoción con información enriquecida del inventario
   * @param idPromocion ID de la promoción
   * @returns Array con detalles de productos y promoción
   */
  async getProductosPromocionEnriquecidos(idPromocion: number, accessToken?: string): Promise<any> {
    const promocion = await this.promocionRepository.findById(idPromocion);
    if (!promocion) {
      throw new Error(`Promoción con ID ${idPromocion} no encontrada`);
    }

    const productosPromocion = await this.getProductosByPromocion(idPromocion, accessToken);

    return {
      promocion: promocion.toJSON(),
      productos: productosPromocion,
      totalProductos: productosPromocion.length,
    };
  }

  /**
   * Obtener todas las promociones de un producto
   * @param idProducto ID del producto
   * @returns Array de promociones que incluyen este producto
   */
  async getPromocionesDeProducto(idProducto: number, accessToken?: string): Promise<any[]> {
    try {
      // Validar que el producto existe en inventario
      const producto = await this.inventoryService.getProductoById(idProducto, accessToken);
      if (!producto) {
        throw new Error(`Producto con ID ${idProducto} no existe en inventario`);
      }

      // Obtener todos los productos de promoción con este ID
      const productosPromocion = await this.productoPromocionRepository.findAll();
      const productosDelProducto = productosPromocion.filter(pp => pp.idProducto === idProducto);

      // Obtener detalles de las promociones
      const promociones = await Promise.all(
        productosDelProducto.map(async (pp) => {
          const promo = await this.promocionRepository.findById(pp.idPromocion);
          return {
            ...pp.toJSON(),
            detallePromocion: promo?.toJSON(),
          };
        })
      );

      return promociones;
    } catch (error: any) {
      console.error(`Error al obtener promociones del producto ${idProducto}:`, error.message);
      throw error;
    }
  }
}


