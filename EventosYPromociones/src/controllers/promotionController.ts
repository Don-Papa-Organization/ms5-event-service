import { Request, Response, NextFunction } from "express";
import { PromocionService } from "../services/promocionService";
import { CreatePromocionRequestDto } from "../domain/dtos/request/CreatePromocion.Request.dto";
import { UpdatePromocionRequestDto } from "../domain/dtos/request/UpdatePromocion.Request.dto";
import { ApiResponse } from "../types";
import { AppError } from "../middlewares/error.middleware";

const promocionService = new PromocionService();

export const getPromocionesActivas = async (req: Request, res: Response, next: NextFunction) => {
	const activas = req.params.activas === "true";
	const promociones = await promocionService.getPromocionesActivas(activas);

	const response: ApiResponse<any> = {
		success: true,
		data: promociones.length > 0 ? promociones : [],
		message: promociones.length > 0 ? "Promociones obtenidas correctamente" : "No hay promociones disponibles",
		timestamp: new Date().toISOString()
	};
	
	res.status(200).json(response);
};

/**
 * Obtener todas las promociones (admin y empleados)
 */
export const getPromociones = async (req: Request, res: Response, next: NextFunction) => {
	const promociones = await promocionService.getAllPromociones();
	
	const response: ApiResponse<any> = {
		success: true,
		data: promociones,
		message: "Promociones obtenidas correctamente",
		timestamp: new Date().toISOString()
	};
	
	res.status(200).json(response);
};

/**
 * Obtener una promoción por ID (admin y empleados)
 */
export const getPromocionById = async (req: Request, res: Response, next: NextFunction) => {
	const promocion = await promocionService.getPromocionById(parseInt(req.params.id));
	
	if (!promocion) {
		throw new AppError("Promoción no encontrada", 404);
	}

	const response: ApiResponse<any> = {
		success: true,
		data: promocion,
		message: "Promoción obtenida correctamente",
		timestamp: new Date().toISOString()
	};
	
	res.status(200).json(response);
};

export const createPromocion = async (req: Request, res: Response, next: NextFunction) => {
	const { nombre, descripcion, fechaInicio, fechaFin, tipoPromocion }: CreatePromocionRequestDto = req.body;

	const promocionData = {
		nombre,
		descripcion,
		fechaInicio,
		fechaFin,
		tipoPromocion,
		activo: true
	};

	const promocionGuardada = await promocionService.createPromocion(promocionData);
	
	const response: ApiResponse<any> = {
		success: true,
		data: promocionGuardada,
		message: "Promoción creada exitosamente",
		timestamp: new Date().toISOString()
	};
	
	res.status(201).json(response);
};

export const updatePromocion = async (req: Request, res: Response, next: NextFunction) => {
	const id = parseInt(req.params.id);
	const { nombre, descripcion, fechaInicio, fechaFin, tipoPromocion, activo }: UpdatePromocionRequestDto = req.body;

	const promocionData: Partial<any> = {
		...(nombre && { nombre }),
		...(descripcion && { descripcion }),
		...(fechaInicio && { fechaInicio }),
		...(fechaFin && { fechaFin }),
		...(tipoPromocion && { tipoPromocion }),
		...(activo !== undefined && { activo })
	};

	const promocionResult = await promocionService.updatePromocion(id, promocionData);

	if (!promocionResult) {
		throw new AppError("Promoción no encontrada", 404);
	}

	const response: ApiResponse<any> = {
		success: true,
		data: promocionResult,
		message: "Promoción actualizada exitosamente",
		timestamp: new Date().toISOString()
	};
	
	res.status(200).json(response);
};

export const deletePromocion = async (req: Request, res: Response, next: NextFunction) => {
	const id = parseInt(req.params.id);
	const deleted = await promocionService.deletePromocion(id);

	if (!deleted) {
		throw new AppError("Promoción no encontrada", 404);
	}

	const response: ApiResponse<null> = {
		success: true,
		data: null,
		message: "Promoción eliminada correctamente",
		timestamp: new Date().toISOString()
	};
	
	res.status(200).json(response);
};

/**
 * Cambiar estado activo de una promoción
 * Acceso: Solo Administrador
 */
export const togglePromocionActiva = async (req: Request, res: Response, next: NextFunction) => {
	const id = parseInt(req.params.id);
	const { activo } = req.body;

	if (activo === undefined || typeof activo !== 'boolean') {
		throw new AppError("El campo 'activo' es requerido y debe ser boolean", 400);
	}

	const promocionActualizada = await promocionService.togglePromocionActiva(id, activo);

	if (!promocionActualizada) {
		throw new AppError("Promoción no encontrada", 404);
	}

	const response: ApiResponse<any> = {
		success: true,
		data: promocionActualizada,
		message: `Promoción ${activo ? 'activada' : 'desactivada'} exitosamente`,
		timestamp: new Date().toISOString()
	};
	
	res.status(200).json(response);
};

