import { ProductoPromocionRepository } from "../domain/repositories/productoPromocionRepository";
import { PromocionRepository } from "../domain/repositories/promocionRepository";
import { InventoryService } from "./apis/inventoryService";
import { ProductoPromocion } from "../domain/entities";
import { ProductoPromocionDto } from "../domain/dtos/productoPromocionDto";
import { AppError } from "../middlewares/error.middleware";

export class ProductoPromocionService {
  private productoPromocionRepository: ProductoPromocionRepository;
  private promocionRepository: PromocionRepository;
  private inventoryService: InventoryService;

  constructor() {
    this.productoPromocionRepository = new ProductoPromocionRepository();
    this.promocionRepository = new PromocionRepository();
    this.inventoryService = new InventoryService();
  }

  private resolvePrecioProducto(detalleProducto: any): number | null {
    const posiblesCampos = ["precio", "price", "precioUnitario", "valor", "valorUnitario"];
    for (const campo of posiblesCampos) {
      const valor = detalleProducto?.[campo];
      if (typeof valor === "number" && !Number.isNaN(valor)) {
        return valor;
      }
    }
    return null;
  }

  private calcularPrecioPromocional(precioBase: number, porcentaje: number): number {
    const factor = 1 - porcentaje / 100;
    const precio = precioBase * factor;
    return Math.max(0, Math.round(precio * 100) / 100);
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
      throw new AppError(`Promoción con ID ${idPromocion} no encontrada`, 404);
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
      throw new AppError("Campos obligatorios: idProducto, idPromocion, cantidadMinima", 400);
    }

    // Validar que la promoción existe
    const promocion = await this.promocionRepository.findById(data.idPromocion);
    if (!promocion) {
      throw new AppError(`Promoción con ID ${data.idPromocion} no encontrada`, 404);
    }

    // Validar que el producto existe en inventario
    const productoExiste = await this.inventoryService.productoExists(data.idProducto, accessToken);
    if (!productoExiste) {
      throw new AppError(`Producto con ID ${data.idProducto} no existe en inventario`, 404);
    }

    // Validar cantidadMinima
    if (data.cantidadMinima <= 0) {
      throw new AppError("La cantidad mínima debe ser mayor a 0", 400);
    }

    // Validar que al menos uno de los descuentos está presente
    if (
      (data.precioPromocional === undefined || data.precioPromocional === null) &&
      (data.porcentajeDescuento === undefined || data.porcentajeDescuento === null)
    ) {
      throw new AppError("Debe proporcionar precioPromocional o porcentajeDescuento", 400);
    }

    // No permitir ambos al mismo tiempo
    if (
      data.precioPromocional !== undefined &&
      data.precioPromocional !== null &&
      data.porcentajeDescuento !== undefined &&
      data.porcentajeDescuento !== null
    ) {
      throw new AppError("No puede enviar precioPromocional y porcentajeDescuento al mismo tiempo", 400);
    }

    // Validar porcentaje
    if (data.porcentajeDescuento !== undefined && data.porcentajeDescuento !== null) {
      if (data.porcentajeDescuento < 0 || data.porcentajeDescuento > 100) {
        throw new AppError("El porcentaje de descuento debe estar entre 0 y 100", 400);
      }
    }

    // Si viene porcentaje, calcular precioPromocional usando precio del producto
    if (data.porcentajeDescuento !== undefined && data.porcentajeDescuento !== null) {
      const detalleProducto = await this.inventoryService.getProductoById(data.idProducto, accessToken);
      if (!detalleProducto) {
        throw new AppError(`Producto con ID ${data.idProducto} no existe en inventario`, 404);
      }
      const precioBase = this.resolvePrecioProducto(detalleProducto);
      if (precioBase === null) {
        throw new AppError("No se pudo obtener el precio del producto desde inventario", 400);
      }
      data.precioPromocional = this.calcularPrecioPromocional(precioBase, data.porcentajeDescuento);
    } else if (data.precioPromocional !== undefined && data.precioPromocional !== null) {
      // Si SOLO viene precioPromocional, forzar porcentajeDescuento a 0
      data.porcentajeDescuento = 0;
    }

    return this.productoPromocionRepository.create(data);
  }

  /**
   * Actualizar producto de promoción
   */
  async updateProductoPromocion(idProductoPromocion: number, data: Partial<ProductoPromocionDto>, accessToken?: string): Promise<ProductoPromocion | null> {
    const productoExiste = await this.productoPromocionRepository.findById(idProductoPromocion);
    if (!productoExiste) {
      throw new AppError(`Producto de promoción con ID ${idProductoPromocion} no encontrado`, 404);
    }

    // Si se intenta cambiar el producto, validar que existe en inventario
    if (data.idProducto) {
      const productoExisteEnInventario = await this.inventoryService.productoExists(data.idProducto, accessToken);
      if (!productoExisteEnInventario) {
        throw new AppError(`Producto con ID ${data.idProducto} no existe en inventario`, 404);
      }
    }

    // Validar cantidadMinima si se proporciona
    if (data.cantidadMinima !== undefined && data.cantidadMinima <= 0) {
      throw new AppError("La cantidad mínima debe ser mayor a 0", 400);
    }

    // Validar porcentaje si se proporciona
    if (data.porcentajeDescuento !== undefined && data.porcentajeDescuento !== null) {
      if (data.porcentajeDescuento < 0 || data.porcentajeDescuento > 100) {
        throw new AppError("El porcentaje de descuento debe estar entre 0 y 100", 400);
      }
    }

    // No permitir ambos al mismo tiempo
    if (
      data.precioPromocional !== undefined &&
      data.precioPromocional !== null &&
      data.porcentajeDescuento !== undefined &&
      data.porcentajeDescuento !== null
    ) {
      throw new AppError("No puede enviar precioPromocional y porcentajeDescuento al mismo tiempo", 400);
    }

    // Si viene porcentaje, calcular precioPromocional usando precio del producto
    if (data.porcentajeDescuento !== undefined && data.porcentajeDescuento !== null) {
      const idProducto = data.idProducto ?? productoExiste.idProducto;
      const detalleProducto = await this.inventoryService.getProductoById(idProducto, accessToken);
      if (!detalleProducto) {
        throw new AppError(`Producto con ID ${idProducto} no existe en inventario`, 404);
      }
      const precioBase = this.resolvePrecioProducto(detalleProducto);
      if (precioBase === null) {
        throw new AppError("No se pudo obtener el precio del producto desde inventario", 400);
      }
      data.precioPromocional = this.calcularPrecioPromocional(precioBase, data.porcentajeDescuento);
    } else if (data.precioPromocional !== undefined && data.precioPromocional !== null) {
      // Si SOLO viene precioPromocional, forzar porcentajeDescuento a 0
      data.porcentajeDescuento = 0;
    }

    return this.productoPromocionRepository.update(idProductoPromocion, data);
  }

  /**
   * Eliminar producto de promoción
   */
  async deleteProductoPromocion(idProductoPromocion: number): Promise<boolean> {
    const productoExiste = await this.productoPromocionRepository.findById(idProductoPromocion);
    if (!productoExiste) {
      throw new AppError(`Producto de promoción con ID ${idProductoPromocion} no encontrado`, 404);
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
      throw new AppError(`Promoción con ID ${idPromocion} no encontrada`, 404);
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
        throw new AppError(`Producto con ID ${idProducto} no existe en inventario`, 404);
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

  /**
   * Verificar si un producto específico tiene promoción activa
   * @param idProducto ID del producto
   * @returns Datos de la promoción si existe, o null
   */
  async checkProductoPromocionActiva(idProducto: number): Promise<any> {
    try {
      const productosPromocion = await this.productoPromocionRepository.findAll();
      const productosDelProducto = productosPromocion.filter(pp => pp.idProducto === idProducto);

      const ahora = new Date();

      for (const pp of productosDelProducto) {
        const promo = await this.promocionRepository.findById(pp.idPromocion);
        if (promo && promo.activo) {
          const fechaInicio = new Date(promo.fechaInicio);
          const fechaFin = new Date(promo.fechaFin);

          if (ahora >= fechaInicio && ahora <= fechaFin) {
            return {
              hasPromotion: true,
              promotion: {
                id: promo.idPromocion,
                nombre: promo.nombre,
                tipo: promo.tipoPromocion,
                valor: pp.precioPromocional ?? pp.porcentajeDescuento,
                cantidad_minima: pp.cantidadMinima,
                fecha_inicio: promo.fechaInicio,
                fecha_fin: promo.fechaFin
              }
            };
          }
        }
      }

      return { hasPromotion: false, promotion: null };
    } catch (error: any) {
      console.error(`Error al verificar promoción activa del producto ${idProducto}:`, error.message);
      throw error;
    }
  }

  /**
   * Obtener todos los IDs de productos con promoción activa
   * @returns Array de productos con promoción asociada
   */
  async getActiveProductosPromocion(): Promise<any> {
    try {
      const productosPromocion = await this.productoPromocionRepository.findAll();
      const ahora = new Date();

      const activeProducts: any[] = [];

      for (const pp of productosPromocion) {
        const promo = await this.promocionRepository.findById(pp.idPromocion);
        if (promo && promo.activo) {
          const fechaInicio = new Date(promo.fechaInicio);
          const fechaFin = new Date(promo.fechaFin);

          if (ahora >= fechaInicio && ahora <= fechaFin) {
            activeProducts.push({
              productId: pp.idProducto,
              promotionId: promo.idPromocion,
              cantidad_minima: pp.cantidadMinima,
              valor_descuento: pp.precioPromocional ?? pp.porcentajeDescuento,
              tipo_descuento: promo.tipoPromocion
            });
          }
        }
      }

      return { products: activeProducts };
    } catch (error: any) {
      console.error(`Error al obtener productos con promoción activa:`, error.message);
      throw error;
    }
  }
}
