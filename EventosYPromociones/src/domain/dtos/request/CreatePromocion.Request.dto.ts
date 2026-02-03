/**
 * DTO para crear una nueva promoción
 */
export class CreatePromocionRequestDto {
  nombre!: string;
  descripcion!: string;
  fechaInicio!: Date;
  fechaFin!: Date;
  tipoPromocion!: 'porcentaje' | 'precio_fijo';
}
