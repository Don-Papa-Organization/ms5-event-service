export interface ProductoPromocionDto {
  idProductoPromocion?: number;
  precioPromocional?: number;
  porcentajeDescuento?: number;
  cantidadMinima: number;
  idProducto: number;
  idPromocion: number;
}