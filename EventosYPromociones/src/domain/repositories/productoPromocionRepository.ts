import { ProductoPromocion } from "../entities";

export class ProductoPromocionRepository {
  constructor() {
    // Inicialización si es necesaria
  }

  async findAll(): Promise<ProductoPromocion[]> {
    return ProductoPromocion.findAll();
  }

  async findById(idProductoPromocion: number): Promise<ProductoPromocion | null> {
    return ProductoPromocion.findByPk(idProductoPromocion);
  }

  async findByPromocion(idPromocion: number): Promise<ProductoPromocion[]> {
    return ProductoPromocion.findAll({ where: { idPromocion } });
  }

  async create(data: Partial<ProductoPromocion>): Promise<ProductoPromocion> {
    return ProductoPromocion.create(data);
  }

  async update(idProductoPromocion: number, data: Partial<ProductoPromocion>): Promise<ProductoPromocion | null> {
    const productoPromocion = await ProductoPromocion.findByPk(idProductoPromocion);
    if (productoPromocion) {
      return productoPromocion.update(data);
    }
    return null;
  }

  async delete(idProductoPromocion: number): Promise<boolean> {
    const productoPromocion = await ProductoPromocion.findByPk(idProductoPromocion);
    if (productoPromocion) {
      await productoPromocion.destroy();
      return true;
    }
    return false;
  }
}