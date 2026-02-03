/**
 * DTO para actualizar una promoción existente
 */
export class UpdatePromocionRequestDto {
  nombre?: string;
  descripcion?: string;
  fechaInicio?: Date;
  fechaFin?: Date;
  tipoPromocion?: 'porcentaje' | 'precio_fijo';
  activo?: boolean;
}
