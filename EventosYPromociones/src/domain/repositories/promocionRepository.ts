import { Promocion } from "../entities";
import { Op } from "sequelize";

export class PromocionRepository {
  constructor() {
    // Inicialización si es necesaria
  }

  async findAll(): Promise<Promocion[]> {
    return Promocion.findAll();
  }

  async searchForAdmin(filtros?: {
    busqueda?: string;
    activo?: boolean;
    fechaInicio?: string;
    fechaFin?: string;
  }): Promise<Promocion[]> {
    const where: any = {};
    const termino = filtros?.busqueda?.trim();

    if (termino) {
      where[Op.or] = [
        { nombre: { [Op.like]: `%${termino}%` } },
        { descripcion: { [Op.like]: `%${termino}%` } }
      ];
    }

    if (filtros?.activo !== undefined) {
      where.activo = filtros.activo;
    }

    if (filtros?.fechaInicio) {
      where.fechaInicio = { [Op.gte]: new Date(filtros.fechaInicio) };
    }

    if (filtros?.fechaFin) {
      where.fechaFin = { [Op.lte]: new Date(filtros.fechaFin) };
    }

    return Promocion.findAll({ where });
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