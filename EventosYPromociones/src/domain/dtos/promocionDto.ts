export interface PromocionDto {
  idPromocion?: number;
  nombre: string;
  descripcion: string;
  fechaInicio: Date;
  fechaFin: Date;
  tipoPromocion: 'porcentaje' | 'precio_fijo';
  activo: boolean;
}