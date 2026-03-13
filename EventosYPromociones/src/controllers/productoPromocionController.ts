import { Request, Response, NextFunction } from "express";
import { extractToken } from "../middlewares/authMiddleware";
import { ProductoPromocionService } from "../services/productoPromocionService";
import { CreateProductoPromocionRequestDto } from "../domain/dtos/request/CreateProductoPromocion.Request.dto";
import { UpdateProductoPromocionRequestDto } from "../domain/dtos/request/UpdateProductoPromocion.Request.dto";
import { ApiResponse } from "../types";
import { AppError } from "../middlewares/error.middleware";
import { TipoUsuario } from "../types/express";

const productoPromocionService = new ProductoPromocionService();

/**
 * Obtener todos los productos de promociones
 */
export const getAllProductosPromocion = async (req: Request, res: Response, next: NextFunction) => {
  const productos = await productoPromocionService.getAllProductosPromocion();

  const response: ApiResponse<any> = {
    success: true,
    data: productos,
    message: "Productos de promociones obtenidos correctamente",
    timestamp: new Date().toISOString()
  };

  res.status(200).json(response);
};

/**
 * Obtener producto de promoción por ID
 */
export const getProductoPromocionById = async (req: Request, res: Response, next: NextFunction) => {
  const producto = await productoPromocionService.getProductoPromocionById(parseInt(req.params.id));

  if (!producto) {
    throw new AppError("Producto de promoción no encontrado", 404);
  }

  const response: ApiResponse<any> = {
    success: true,
    data: producto,
    message: "Producto de promoción obtenido correctamente",
    timestamp: new Date().toISOString()
  };

  res.status(200).json(response);
};

/**
 * Obtener productos de una promoción específica con detalles del inventario
 */
export const getProductosByPromocion = async (req: Request, res: Response, next: NextFunction) => {
  const idPromocion = parseInt(req.params.idPromocion);
  const accessToken = extractToken(req);

  if (!accessToken) {
    throw new AppError("Token de autenticación no proporcionado", 401);
  }

  const productos = await productoPromocionService.getProductosByPromocion(idPromocion, accessToken);

  const response: ApiResponse<any> = {
    success: true,
    data: {
      idPromocion,
      totalProductos: productos.length,
      productos,
    },
    message: "Productos de la promoción obtenidos correctamente",
    timestamp: new Date().toISOString()
  };

  res.status(200).json(response);
};

/**
 * Crear producto de promoción
 * Solo administradores
 * Validaciones:
 * - Producto debe existir en inventario
 * - Promoción debe existir
 * - Cantidad mínima > 0
 * - Al menos un descuento presente
 */
export const createProductoPromocion = async (req: Request, res: Response, next: NextFunction) => {
  const { idPromocion, idProducto, cantidadMinima, precioPromocional, porcentajeDescuento }: CreateProductoPromocionRequestDto = req.body;

  const productoData = {
    idPromocion,
    idProducto,
    cantidadMinima,
    precioPromocional,
    porcentajeDescuento,
  };

  const accessToken = extractToken(req);

  if (!accessToken) {
    throw new AppError("Token de autenticación no proporcionado", 401);
  }

  const productoCreado = await productoPromocionService.createProductoPromocion(productoData, accessToken);

  const response: ApiResponse<any> = {
    success: true,
    data: productoCreado,
    message: "Producto agregado a la promoción exitosamente",
    timestamp: new Date().toISOString()
  };

  res.status(201).json(response);
};

/**
 * Actualizar producto de promoción
 * Solo administradores
 */
export const updateProductoPromocion = async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id);
  const { idProducto, cantidadMinima, precioPromocional, porcentajeDescuento }: UpdateProductoPromocionRequestDto = req.body;

  const productoData: Partial<any> = {
    ...(idProducto && { idProducto }),
    ...(cantidadMinima && { cantidadMinima }),
    ...(precioPromocional !== undefined && { precioPromocional }),
    ...(porcentajeDescuento !== undefined && { porcentajeDescuento }),
  };

  const accessToken = extractToken(req);

  if (!accessToken) {
    throw new AppError("Token de autenticación no proporcionado", 401);
  }

  const productoActualizado = await productoPromocionService.updateProductoPromocion(id, productoData, accessToken);

  if (!productoActualizado) {
    throw new AppError("Producto de promoción no encontrado", 404);
  }

  const response: ApiResponse<any> = {
    success: true,
    data: productoActualizado,
    message: "Producto de promoción actualizado exitosamente",
    timestamp: new Date().toISOString()
  };

  res.status(200).json(response);
};

/**
 * Eliminar producto de promoción
 * Solo administradores
 */
export const deleteProductoPromocion = async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id);
  const deleted = await productoPromocionService.deleteProductoPromocion(id);

  if (!deleted) {
    throw new AppError("Producto de promoción no encontrado", 404);
  }

  const response: ApiResponse<null> = {
    success: true,
    data: null,
    message: "Producto de promoción eliminado exitosamente",
    timestamp: new Date().toISOString()
  };

  res.status(200).json(response);
};

/**
 * Obtener productos de promoción enriquecidos (con detalles de inventario)
 */
export const getProductosPromocionEnriquecidos = async (req: Request, res: Response, next: NextFunction) => {
  const idPromocion = parseInt(req.params.idPromocion);
  const accessToken = extractToken(req);

  if (!accessToken) {
    throw new AppError("Token de autenticación no proporcionado", 401);
  }

  const data = await productoPromocionService.getProductosPromocionEnriquecidos(idPromocion, accessToken);

  const response: ApiResponse<any> = {
    success: true,
    data: data,
    message: "Datos enriquecidos obtenidos correctamente",
    timestamp: new Date().toISOString()
  };

  res.status(200).json(response);
};

/**
 * Obtener todas las promociones de un producto
 */
export const getPromocionesDeProducto = async (req: Request, res: Response, next: NextFunction) => {
  const idProducto = parseInt(req.params.idProducto);
  const accessToken = extractToken(req);

  if (!accessToken) {
    throw new AppError("Token de autenticación no proporcionado", 401);
  }

  const promociones = await productoPromocionService.getPromocionesDeProducto(idProducto, accessToken);

  const response: ApiResponse<any> = {
    success: true,
    data: {
      idProducto,
      totalPromociones: promociones.length,
      promociones,
    },
    message: "Promociones del producto obtenidas correctamente",
    timestamp: new Date().toISOString()
  };

  res.status(200).json(response);
};

/**
   * Verificar si un producto tiene promoción activa
   */
export const checkProductoPromocionActiva = async (req: Request, res: Response, next: NextFunction) => {
  const idProducto = parseInt(req.params.idProducto);
  const result = await productoPromocionService.checkProductoPromocionActiva(idProducto);

  const response: ApiResponse<any> = {
    success: true,
    data: result,
    message: "Verificación de promoción completada",
    timestamp: new Date().toISOString()
  };

  res.status(200).json(response);
};

/**
 * Obtener todos los productos con promoción activa
 */
export const getActiveProductosPromocion = async (req: Request, res: Response, next: NextFunction) => {
  const result = await productoPromocionService.getActiveProductosPromocion();

  const response: ApiResponse<any> = {
    success: true,
    data: result,
    message: "Productos con promoción activa obtenidos correctamente",
    timestamp: new Date().toISOString()
  };

  res.status(200).json(response);
};


