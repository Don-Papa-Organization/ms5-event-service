import axios, { AxiosInstance } from 'axios';

/**
 * Servicio para consumir la API de Inventario
 * Realiza llamadas HTTP al microservicio de inventario para obtener y gestionar productos
 */
export class InventoryService {
  private axiosInstance: AxiosInstance;
  private inventoryBaseUrl: string;

  constructor() {
    this.inventoryBaseUrl = process.env.INVENTORY_SERVICE_URL || 'http://inventory-service-app:4001/api';

    this.axiosInstance = axios.create({
      baseURL: this.inventoryBaseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Obtener todos los productos
   */
  async getAllProductos(accessToken?: string): Promise<any[]> {
    try {
      const headers: any = { ...this.axiosInstance.defaults.headers };
      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }
      const response = await this.axiosInstance.get('/products', { headers });
      const payload = response.data?.data ?? response.data;
      return payload?.productos ?? payload ?? [];
    } catch (error: any) {
      console.error('Error al obtener productos:', error.message);
      throw new Error(`No se pudo conectar con el servicio de inventario: ${error.message}`);
    }
  }

  /**
   * Obtener producto por ID
   */
  async getProductoById(idProducto: number, accessToken?: string): Promise<any> {
    try {
      // Primero consulta el catálogo público para evitar errores por permisos de rol.
      const publicResponse = await this.axiosInstance.get(`/catalogo/${idProducto}`);
      return publicResponse.data?.data ?? publicResponse.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }

      try {
        const headers: any = { ...this.axiosInstance.defaults.headers };
        if (accessToken) {
          headers.Authorization = `Bearer ${accessToken}`;
        }

        const protectedResponse = await this.axiosInstance.get(`/products/${idProducto}`, { headers });
        return protectedResponse.data?.data ?? protectedResponse.data;
      } catch (fallbackError: any) {
        if (fallbackError.response?.status === 404) {
          return null;
        }
        if (fallbackError.response?.status === 401 || fallbackError.response?.status === 403) {
          throw new Error(`Inventario rechazó la solicitud (auth requerida para producto ${idProducto})`);
        }
        console.error(`Error al obtener producto ${idProducto}:`, fallbackError.message);
        throw new Error(`No se pudo obtener el producto: ${fallbackError.message}`);
      }
    }
  }

  /**
   * Obtener múltiples productos por IDs
   */
  async getProductosByIds(ids: number[], accessToken?: string): Promise<any[]> {
    try {
      const requests = ids.map((id) => this.getProductoById(id, accessToken));
      const resultados = await Promise.all(requests);
      return resultados.filter((p) => p !== null);
    } catch (error: any) {
      console.error('Error al obtener múltiples productos:', error.message);
      throw new Error(`No se pudo obtener los productos: ${error.message}`);
    }
  }

  /**
   * Validar si un producto existe
   */
  async productoExists(idProducto: number, accessToken?: string): Promise<boolean> {
    const producto = await this.getProductoById(idProducto, accessToken);
    return producto !== null;
  }

  /**
   * Obtener detalles de productos para una promoción
   */
  async getProductosForPromocion(productosIds: number[], accessToken?: string): Promise<any[]> {
    return this.getProductosByIds(productosIds, accessToken);
  }
}
