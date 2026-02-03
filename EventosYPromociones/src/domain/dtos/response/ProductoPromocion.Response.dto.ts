/**
 * DTO de respuesta para Producto Promoción
 */
export class ProductoPromocionResponseDto {
  idProductoPromocion!: number;
  precioPromocional?: number;
  porcentajeDescuento?: number;
  cantidadMinima!: number;
  idProducto!: number;
  idPromocion!: number;
  createdAt?: string;
  updatedAt?: string;
}
