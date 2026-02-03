/**
 * DTO de respuesta para Promoción
 */
export class PromocionResponseDto {
  idPromocion!: number;
  nombre!: string;
  descripcion!: string;
  fechaInicio!: string;
  fechaFin!: string;
  tipoPromocion!: 'porcentaje' | 'precio_fijo';
  activo!: boolean;
  createdAt?: string;
  updatedAt?: string;
}
