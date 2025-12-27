import { Request, Response } from "express";
import { extractToken } from "../middlewares/authMiddleware";
import { ProductoPromocionService } from "../services/productoPromocionService";
import { ProductoPromocionDto } from "../domain/dto/productoPromocionDto";
import { TipoUsuario } from "../types/express";

const productoPromocionService = new ProductoPromocionService();

/**
 * Obtener todos los productos de promociones
 */
export const getAllProductosPromocion = async (req: Request, res: Response): Promise<any> => {
  try {
    const productos = await productoPromocionService.getAllProductosPromocion();
    res.json(productos);
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener productos de promociones", error: error.message });
  }
};

/**
 * Obtener producto de promoción por ID
 */
export const getProductoPromocionById = async (req: Request, res: Response): Promise<any> => {
  try {
    const producto = await productoPromocionService.getProductoPromocionById(parseInt(req.params.id));
    if (!producto) {
      return res.status(404).json({ message: "Producto de promoción no encontrado" });
    }

    res.json(producto);
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener producto de promoción", error: error.message });
  }
};

/**
 * Obtener productos de una promoción específica con detalles del inventario
 */
export const getProductosByPromocion = async (req: Request, res: Response): Promise<any> => {
  try {
    const idPromocion = parseInt(req.params.idPromocion);
    const accessToken = extractToken(req);
    
    if (!accessToken) {
      return res.status(401).json({ message: "Token de autenticación no proporcionado" });
    }
    
    const productos = await productoPromocionService.getProductosByPromocion(idPromocion, accessToken);

    res.json({
      idPromocion,
      totalProductos: productos.length,
      productos,
    });
  } catch (error: any) {
    res.status(400).json({ message: "Error al obtener productos de promoción", error: error.message });
  }
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
export const createProductoPromocion = async (req: Request, res: Response): Promise<any> => {
  try {
    const { idPromocion, idProducto, cantidadMinima, precioPromocional, porcentajeDescuento } = req.body;

    const productoData: ProductoPromocionDto = {
      idPromocion,
      idProducto,
      cantidadMinima,
      precioPromocional,
      porcentajeDescuento,
    };

    const accessToken = extractToken(req);
    
    if (!accessToken) {
      return res.status(401).json({ message: "Token de autenticación no proporcionado" });
    }
    
    const productoCreado = await productoPromocionService.createProductoPromocion(productoData, accessToken);
    res.status(201).json({
      message: "Producto agregado a la promoción exitosamente",
      data: productoCreado,
    });
  } catch (error: any) {
    res.status(400).json({ message: "Error al crear producto de promoción", error: error.message });
  }
};

/**
 * Actualizar producto de promoción
 * Solo administradores
 */
export const updateProductoPromocion = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = parseInt(req.params.id);
    const { idProducto, cantidadMinima, precioPromocional, porcentajeDescuento } = req.body;

    const productoData: Partial<ProductoPromocionDto> = {
      ...(idProducto && { idProducto }),
      ...(cantidadMinima && { cantidadMinima }),
      ...(precioPromocional !== undefined && { precioPromocional }),
      ...(porcentajeDescuento !== undefined && { porcentajeDescuento }),
    };

    const accessToken = extractToken(req);
    
    if (!accessToken) {
      return res.status(401).json({ message: "Token de autenticación no proporcionado" });
    }
    
    const productoActualizado = await productoPromocionService.updateProductoPromocion(id, productoData, accessToken);
    if (!productoActualizado) {
      return res.status(404).json({ message: "Producto de promoción no encontrado" });
    }

    res.json({
      message: "Producto de promoción actualizado exitosamente",
      data: productoActualizado,
    });
  } catch (error: any) {
    res.status(400).json({ message: "Error al actualizar producto de promoción", error: error.message });
  }
};

/**
 * Eliminar producto de promoción
 * Solo administradores
 */
export const deleteProductoPromocion = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await productoPromocionService.deleteProductoPromocion(id);

    if (!deleted) {
      return res.status(404).json({ message: "Producto de promoción no encontrado" });
    }

    res.json({ message: "Producto de promoción eliminado exitosamente" });
  } catch (error: any) {
    res.status(500).json({ message: "Error al eliminar producto de promoción", error: error.message });
  }
};

/**
 * Obtener productos de promoción enriquecidos (con detalles de inventario)
 */
export const getProductosPromocionEnriquecidos = async (req: Request, res: Response): Promise<any> => {
  try {
    const idPromocion = parseInt(req.params.idPromocion);
    const accessToken = extractToken(req);
    
    if (!accessToken) {
      return res.status(401).json({ message: "Token de autenticación no proporcionado" });
    }
    
    const data = await productoPromocionService.getProductosPromocionEnriquecidos(idPromocion, accessToken);

    res.json(data);
  } catch (error: any) {
    res.status(400).json({ message: "Error al obtener datos enriquecidos", error: error.message });
  }
};

/**
 * Obtener todas las promociones de un producto
 */
export const getPromocionesDeProducto = async (req: Request, res: Response): Promise<any> => {
  try {
    const idProducto = parseInt(req.params.idProducto);
    const accessToken = extractToken(req);
    
    if (!accessToken) {
      return res.status(401).json({ message: "Token de autenticación no proporcionado" });
    }
    
    const promociones = await productoPromocionService.getPromocionesDeProducto(idProducto, accessToken);

    res.json({
      idProducto,
      totalPromociones: promociones.length,
      promociones,
    });
  } catch (error: any) {
    res.status(400).json({ message: "Error al obtener promociones del producto", error: error.message });
  }
};


