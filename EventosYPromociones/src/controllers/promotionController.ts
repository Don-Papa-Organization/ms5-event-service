import { Request, Response } from "express";
import { PromocionService } from "../services/promocionService";
import { PromocionDto } from "../domain/dto/promocionDto";
import { TipoUsuario } from "../types/express";

const promocionService = new PromocionService();


export const getPromocionesActivas = async (req: Request, res: Response): Promise<any> => {
    try {
        const activas = req.params.activas === "true";
        const promociones = await promocionService.getPromocionesActivas(activas);

        if (!promociones || promociones.length === 0) {
            return res.json({ message: "No hay promociones disponibles", data: [] });
        }

        res.json(promociones);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener promociones activas", error });
    }
};

/**
 * Obtener todas las promociones (admin y empleados)
 */
export const getPromociones = async (req: Request, res: Response): Promise<any> => {
    try {
        const promociones = await promocionService.getAllPromociones();
        res.json(promociones);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener promociones", error });
    }
};

/**
 * Obtener una promoción por ID (admin y empleados)
 */
export const getPromocionById = async (req: Request, res: Response): Promise<any> => {
    try {
        const promocion = await promocionService.getPromocionById(parseInt(req.params.id));
        if (!promocion) {
            return res.status(404).json({ message: "Promoción no encontrada" });
        }

        res.json(promocion);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la promoción", error });
    }
};


export const createPromocion = async (req: Request, res: Response): Promise<any> => {
    try {
        const { nombre, descripcion, fechaInicio, fechaFin, tipoPromocion, activo } = req.body;

        const promocionData: PromocionDto = {
            nombre,
            descripcion,
            fechaInicio,
            fechaFin,
            tipoPromocion,
            activo: activo !== undefined ? activo : true
        };

        const promocionGuardada = await promocionService.createPromocion(promocionData);
        res.status(201).json({
            message: "Promoción creada exitosamente",
            data: promocionGuardada
        });
    } catch (error: any) {
        res.status(400).json({ message: "Error al crear la promoción", error: error.message });
    }
};


export const updatePromocion = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = parseInt(req.params.id);
        const { nombre, descripcion, fechaInicio, fechaFin, tipoPromocion, activo } = req.body;

        const promocionData: Partial<PromocionDto> = {
            ...(nombre && { nombre }),
            ...(descripcion && { descripcion }),
            ...(fechaInicio && { fechaInicio }),
            ...(fechaFin && { fechaFin }),
            ...(tipoPromocion && { tipoPromocion }),
            ...(activo !== undefined && { activo })
        };

        const promocionResult = await promocionService.updatePromocion(id, promocionData);

        if (!promocionResult) {
            return res.status(404).json({ message: "Promoción no encontrada" });
        }

        res.json({
            message: "Promoción actualizada exitosamente",
            data: promocionResult
        });
    } catch (error: any) {
        res.status(400).json({ message: "Error al actualizar la promoción", error: error.message });
    }
};


export const deletePromocion = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = parseInt(req.params.id);
        const deleted = await promocionService.deletePromocion(id);

        if (!deleted) {
            return res.status(404).json({ message: "Promoción no encontrada" });
        }

        res.json({ message: "Promoción eliminada correctamente" });
    } catch (error: any) {
        res.status(500).json({ message: "Error al eliminar la promoción", error: error.message });
    }
};

/**
 * Cambiar estado activo de una promoción
 * Acceso: Solo Administrador
 */
export const togglePromocionActiva = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = parseInt(req.params.id);
        const { activo } = req.body;

        if (activo === undefined || typeof activo !== 'boolean') {
            return res.status(400).json({ message: "El campo 'activo' es requerido y debe ser boolean" });
        }

        const promocionActualizada = await promocionService.togglePromocionActiva(id, activo);

        if (!promocionActualizada) {
            return res.status(404).json({ message: "Promoción no encontrada" });
        }

        res.json({
            message: `Promoción ${activo ? 'activada' : 'desactivada'} exitosamente`,
            data: promocionActualizada
        });
    } catch (error: any) {
        res.status(400).json({ message: "Error al cambiar estado de la promoción", error: error.message });
    }
};

