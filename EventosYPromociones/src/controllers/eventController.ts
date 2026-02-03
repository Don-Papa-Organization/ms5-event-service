import { Request, Response, NextFunction } from "express";
import { EventoService } from "../services/eventoService";
import { EventoDiaSemanaService } from "../services/eventoDiaSemanaService";
import { CreateEventoRequestDto } from "../domain/dtos/request/CreateEvento.Request.dto";
import { UpdateEventoRequestDto } from "../domain/dtos/request/UpdateEvento.Request.dto";
import { ApiResponse } from "../types";
import { AppError } from "../middlewares/error.middleware";
import { TipoUsuario } from "../types/express";

const eventoService = new EventoService();
const eventoDiaSemanaService = new EventoDiaSemanaService();

/**
 * CU013 - Obtener todos los eventos
 * Solo administradores pueden ver todos los eventos
 */
export const getEventos = async (req: Request, res: Response, next: NextFunction) => {
  const eventos = await eventoService.getAllEventos();
  
  const response: ApiResponse<any> = {
    success: true,
    data: eventos,
    message: "Eventos obtenidos correctamente",
    timestamp: new Date().toISOString()
  };
  
  res.status(200).json(response);
};

/**
 * CU013 - Obtener evento por ID
 * Solo administradores
 */
export const getEventoById = async (req: Request, res: Response, next: NextFunction) => {
  const evento = await eventoService.getEventoById(parseInt(req.params.id));
  
  if (!evento) {
    throw new AppError("Evento no encontrado", 404);
  }

  const response: ApiResponse<any> = {
    success: true,
    data: evento,
    message: "Evento obtenido correctamente",
    timestamp: new Date().toISOString()
  };
  
  res.status(200).json(response);
};

/**
 * CU030 - Ver detalle de evento
 * Acceso: Cualquier usuario autenticado (Cliente, Empleado, Admin)
 */
export const getEventoDetalle = async (req: Request, res: Response, next: NextFunction) => {
  const idEvento = parseInt(req.params.id);
  const detalle = await eventoService.getEventoDetalle(idEvento);

  if (!detalle) {
    throw new AppError("Evento no encontrado", 404);
  }

  const response: ApiResponse<any> = {
    success: true,
    data: detalle,
    message: "Detalle del evento obtenido correctamente",
    timestamp: new Date().toISOString()
  };
  
  res.status(200).json(response);
};

/**
 * CU029 - Ver listado de eventos próximos
 * Acceso: Cualquier usuario autenticado (Cliente, Empleado, Admin)
 * Retorna eventos futuros con nombre, descripción, fecha, hora y promociones asociadas
 */
export const getEventosProximos = async (req: Request, res: Response, next: NextFunction) => {
  const eventosProximos = await eventoDiaSemanaService.getEventosProximos();

  const response: ApiResponse<any> = {
    success: true,
    data: eventosProximos && eventosProximos.length > 0 ? eventosProximos : [],
    message: eventosProximos && eventosProximos.length > 0 
      ? `Eventos próximos encontrados (${eventosProximos.length} eventos)` 
      : "No hay eventos próximos disponibles",
    timestamp: new Date().toISOString()
  };
  
  res.status(200).json(response);
};

/**
 * CU013 - Buscar eventos por nombre
 * Acceso público (cualquier usuario autenticado)
 */
export const searchEventosByNombre = async (req: Request, res: Response, next: NextFunction) => {
  const nombre = req.query.nombre as string;
  
  if (!nombre || nombre.trim() === "") {
    throw new AppError("Parámetro 'nombre' es requerido", 400);
  }

  const eventos = await eventoService.searchEventosByNombre(nombre);
  
  const response: ApiResponse<any> = {
    success: true,
    data: eventos,
    message: "Búsqueda completada correctamente",
    timestamp: new Date().toISOString()
  };
  
  res.status(200).json(response);
};

/**
 * CU013 - Crear nuevo evento
 * Solo administradores pueden crear eventos
 * Validaciones:
 * - Nombre y descripción obligatorios
 */
export const createEvento = async (req: Request, res: Response, next: NextFunction) => {
  const { nombre, descripcion }: CreateEventoRequestDto = req.body;

  const eventoData = {
    nombre,
    descripcion,
  };

  const eventoCreado = await eventoService.createEvento(eventoData);
  
  const response: ApiResponse<any> = {
    success: true,
    data: eventoCreado,
    message: "Evento creado exitosamente",
    timestamp: new Date().toISOString()
  };
  
  res.status(201).json(response);
};

/**
 * CU013 - Actualizar evento
 * Solo administradores pueden actualizar eventos
 */
export const updateEvento = async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id);
  const { nombre, descripcion }: UpdateEventoRequestDto = req.body;

  const eventoData: Partial<any> = {
    ...(nombre && { nombre }),
    ...(descripcion && { descripcion }),
  };

  const eventoActualizado = await eventoService.updateEvento(id, eventoData);
  
  if (!eventoActualizado) {
    throw new AppError("Evento no encontrado", 404);
  }

  const response: ApiResponse<any> = {
    success: true,
    data: eventoActualizado,
    message: "Evento actualizado exitosamente",
    timestamp: new Date().toISOString()
  };
  
  res.status(200).json(response);
};

/**
 * CU013 - Eliminar evento
 * Solo administradores pueden eliminar eventos
 * Elimina en cascada los días de semana asociados
 */
export const deleteEvento = async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id);
  const deleted = await eventoService.deleteEvento(id);

  if (!deleted) {
    throw new AppError("Evento no encontrado", 404);
  }

  const response: ApiResponse<null> = {
    success: true,
    data: null,
    message: "Evento eliminado exitosamente",
    timestamp: new Date().toISOString()
  };
  
  res.status(200).json(response);
};

