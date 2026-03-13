import { PromocionDto } from "../promocionDto";
import { EventoDiaSemanaDto } from "../eventoDiaSemanaDto";

export interface PromocionEventoDiaResponseDto {
  idPromocionEventoDia: number;
  idPromocion: number;
  idEventoDiaSemana: number;
  promocion?: PromocionDto;
  eventoDiaSemana?: EventoDiaSemanaDto;
}
