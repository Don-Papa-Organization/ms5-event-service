import { Promocion } from "../entities";

export class PromocionRepository {
  constructor() {
    // Inicialización si es necesaria
  }

  async findAll(): Promise<Promocion[]> {
    return Promocion.findAll();
  }

  async findById(idPromocion: number): Promise<Promocion | null> {
    return Promocion.findByPk(idPromocion);
  }

  async findActive(activo: boolean): Promise<Promocion[]> {
    return Promocion.findAll({ where: { activo } });
  }

  async create(data: Partial<Promocion>): Promise<Promocion> {
    return Promocion.create(data);
  }

  async update(idPromocion: number, data: Partial<Promocion>): Promise<Promocion | null> {
    const promocion = await Promocion.findByPk(idPromocion);
    if (promocion) {
      return promocion.update(data);
    }
    return null;
  }

  async delete(idPromocion: number): Promise<boolean> {
    const promocion = await Promocion.findByPk(idPromocion);
    if (promocion) {
      await promocion.destroy();
      return true;
    }
    return false;
  }
}