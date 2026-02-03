/**
 * DTO para crear un producto promoción
 */
export class CreateProductoPromocionRequestDto {
  precioPromocional?: number;
  porcentajeDescuento?: number;
  cantidadMinima!: number;
  idProducto!: number;
  idPromocion!: number;
}
