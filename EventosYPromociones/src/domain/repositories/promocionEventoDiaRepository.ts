import { PromocionEventoDia } from "../entities";

export class PromocionEventoDiaRepository {
  constructor() {
    // Inicialización si es necesaria
  }

  async findAll(): Promise<PromocionEventoDia[]> {
    return PromocionEventoDia.findAll();
  }

  async findById(idPromocionEventoDia: number): Promise<PromocionEventoDia | null> {
    return PromocionEventoDia.findByPk(idPromocionEventoDia);
  }

  async findByEventoDiaSemana(idEventoDiaSemana: number): Promise<PromocionEventoDia[]> {
    return PromocionEventoDia.findAll({ where: { idEventoDiaSemana } });
  }

  async create(data: Partial<PromocionEventoDia>): Promise<PromocionEventoDia> {
    return PromocionEventoDia.create(data);
  }

  async update(idPromocionEventoDia: number, data: Partial<PromocionEventoDia>): Promise<PromocionEventoDia | null> {
    const promocionEventoDia = await PromocionEventoDia.findByPk(idPromocionEventoDia);
    if (promocionEventoDia) {
      return promocionEventoDia.update(data);
    }
    return null;
  }

  async delete(idPromocionEventoDia: number): Promise<boolean> {
    const promocionEventoDia = await PromocionEventoDia.findByPk(idPromocionEventoDia);
    if (promocionEventoDia) {
      await promocionEventoDia.destroy();
      return true;
    }
    return false;
  }
}