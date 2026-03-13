import { Request, Response, NextFunction } from "express";
import { PromocionEventoDiaService } from "../services/promocionEventoDiaService";
import { CreatePromocionEventoDiaRequestDto } from "../domain/dtos/request/CreatePromocionEventoDia.Request.dto";
import { UpdatePromocionEventoDiaRequestDto } from "../domain/dtos/request/UpdatePromocionEventoDia.Request.dto";
import { ApiResponse } from "../types";
import { AppError } from "../middlewares/error.middleware";

const promocionEventoDiaService = new PromocionEventoDiaService();

/**
 * Obtener todas las relaciones de promoción con evento día semana
 */
export const getPromocionEventoDias = async (req: Request, res: Response, next: NextFunction) => {
  const promocionesEventoDias = await promocionEventoDiaService.getAllPromocionEventoDias();

  const response: ApiResponse<any> = {
    success: true,
    data: promocionesEventoDias.length > 0 ? promocionesEventoDias : [],
    message: promocionesEventoDias.length > 0 ? "Relaciones obtenidas correctamente" : "No hay relaciones disponibles",
    timestamp: new Date().toISOString()
  };

  res.status(200).json(response);
};

/**
 * Obtener una relación por ID
 */
export const getPromocionEventoDiaById = async (req: Request, res: Response, next: NextFunction) => {
  const promocionEventoDia = await promocionEventoDiaService.getPromocionEventoDiaById(parseInt(req.params.id));

  if (!promocionEventoDia) {
    throw new AppError("Relación no encontrada", 404);
  }

  const response: ApiResponse<any> = {
    success: true,
    data: promocionEventoDia,
    message: "Relación obtenida correctamente",
    timestamp: new Date().toISOString()
  };

  res.status(200).json(response);
};

/**
 * Obtener promociones de un evento día semana
 */
export const getPromocionesXEventoDiaSemana = async (req: Request, res: Response, next: NextFunction) => {
  const promociones = await promocionEventoDiaService.getPromocionesXEventoDiaSemana(parseInt(req.params.idEventoDiaSemana));

  const response: ApiResponse<any> = {
    success: true,
    data: promociones.length > 0 ? promociones : [],
    message: promociones.length > 0 ? "Promociones obtenidas correctamente" : "No hay promociones para este evento",
    timestamp: new Date().toISOString()
  };

  res.status(200).json(response);
};

/**
 * Crear nueva relación promoción-evento día semana
 */
export const createPromocionEventoDia = async (req: Request, res: Response, next: NextFunction) => {
  const data: CreatePromocionEventoDiaRequestDto = req.body;

  const promocionEventoDia = await promocionEventoDiaService.createPromocionEventoDia(data);

  const response: ApiResponse<any> = {
    success: true,
    data: promocionEventoDia,
    message: "Relación creada correctamente",
    timestamp: new Date().toISOString()
  };

  res.status(201).json(response);
};

/**
 * Actualizar relación
 */
export const updatePromocionEventoDia = async (req: Request, res: Response, next: NextFunction) => {
  const data: UpdatePromocionEventoDiaRequestDto = req.body;

  const promocionEventoDia = await promocionEventoDiaService.updatePromocionEventoDia(parseInt(req.params.id), data);

  const response: ApiResponse<any> = {
    success: true,
    data: promocionEventoDia,
    message: "Relación actualizada correctamente",
    timestamp: new Date().toISOString()
  };

  res.status(200).json(response);
};

/**
 * Eliminar relación
 */
export const deletePromocionEventoDia = async (req: Request, res: Response, next: NextFunction) => {
  await promocionEventoDiaService.deletePromocionEventoDia(parseInt(req.params.id));

  const response: ApiResponse<any> = {
    success: true,
    data: null,
    message: "Relación eliminada correctamente",
    timestamp: new Date().toISOString()
  };

  res.status(200).json(response);
};
