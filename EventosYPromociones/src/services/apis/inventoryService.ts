import axios, { AxiosInstance } from 'axios';
import { Request, Response } from 'express';
/**
 * Servicio para consumir la API de Inventario
 * Realiza llamadas HTTP al microservicio de inventario para obtener y gestionar productos
 */




export class InventoryService {
  private axiosInstance: AxiosInstance;
  private inventoryBaseUrl: string;
  private internalToken?: string;

  constructor() {
    this.inventoryBaseUrl = process.env.INVENTORY_SERVICE_URL || 'http://inventory-service-app:4001/api';
    this.internalToken = process.env.INTERNAL_SERVICE_TOKEN;

    const headers: any = {
      'Content-Type': 'application/json',
    };

    // Solo agregar x-internal-token si está configurado
    if (this.internalToken) {
      headers['x-internal-token'] = this.internalToken;
    }

    this.axiosInstance = axios.create({
      baseURL: this.inventoryBaseUrl,
      timeout: 10000, // 10 segundos
      headers,
    });
  }

  /**
   * Obtener todos los productos
   */
  async getAllProductos(accessToken?: string): Promise<any[]> {
    try {
      const headers: any = { ...this.axiosInstance.defaults.headers };
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
      const response = await this.axiosInstance.get('/products', { headers });
      return response.data;
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
      const headers: any = { ...this.axiosInstance.defaults.headers };
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
      const response = await this.axiosInstance.get(`/products/${idProducto}`, { headers });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error(`Inventario rechazó la solicitud (auth requerida para producto ${idProducto})`);
      }
      console.error(`Error al obtener producto ${idProducto}:`, error.message);
      throw new Error(`No se pudo obtener el producto: ${error.message}`);
    }
  }

  /**
   * Obtener múltiples productos por IDs
   */
  async getProductosByIds(ids: number[], accessToken?: string): Promise<any[]> {
    try {
      const requests = ids.map(id => this.getProductoById(id, accessToken));
      const resultados = await Promise.all(requests);
      return resultados.filter(p => p !== null);
    } catch (error: any) {
      console.error('Error al obtener múltiples productos:', error.message);
      throw new Error(`No se pudo obtener los productos: ${error.message}`);
    }
  }

  /**
   * Validar si un producto existe
   */
  async productoExists(idProducto: number, accessToken?: string): Promise<boolean> {
    try {
      const producto = await this.getProductoById(idProducto, accessToken);
      return producto !== null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener detalles de productos para una promoción
   */
  async getProductosForPromocion(productosIds: number[], accessToken?: string): Promise<any[]> {
    try {
      return await this.getProductosByIds(productosIds, accessToken);
    } catch (error: any) {
      console.error('Error al obtener productos para promoción:', error.message);
      throw error;
    }
  }
}
