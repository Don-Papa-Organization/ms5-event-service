/**
 * DTO para actualizar un producto promoción
 */
export class UpdateProductoPromocionRequestDto {
  precioPromocional?: number;
  porcentajeDescuento?: number;
  cantidadMinima?: number;
  idProducto?: number;
  idPromocion?: number;
}
