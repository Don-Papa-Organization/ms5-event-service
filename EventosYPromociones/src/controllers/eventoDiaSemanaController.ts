import { Request, Response, NextFunction } from "express";
import { EventoService } from "../services/eventoService";
import { EventoDiaSemanaService } from "../services/eventoDiaSemanaService";
import { CreateEventoDiaSemanaRequestDto } from "../domain/dtos/request/CreateEventoDiaSemana.Request.dto";
import { UpdateEventoDiaSemanaRequestDto } from "../domain/dtos/request/UpdateEventoDiaSemana.Request.dto";
import { ApiResponse } from "../types";
import { AppError } from "../middlewares/error.middleware";

const eventoService = new EventoService();
const eventoDiaSemanaService = new EventoDiaSemanaService();

/**
 * Obtener días de semana de un evento
 */
export const getEventoDiaSemanaByEvento = async (req: Request, res: Response, next: NextFunction) => {
  const idEvento = parseInt(req.params.idEvento);
  const eventoExists = await eventoService.getEventoById(idEvento);
  
  if (!eventoExists) {
    throw new AppError("Evento no encontrado", 404);
  }

  const diasDelEvento = await eventoDiaSemanaService.getByEvento(idEvento);
  
  const response: ApiResponse<any> = {
    success: true,
    data: diasDelEvento,
    message: "Días de semana obtenidos correctamente",
    timestamp: new Date().toISOString()
  };
  
  res.status(200).json(response);
};

/**
 * Crear día de semana para un evento
 */
export const createEventoDiaSemana = async (req: Request, res: Response, next: NextFunction) => {
  const { idEvento, horaInicio, horaFin, fecha }: CreateEventoDiaSemanaRequestDto = req.body;

  const eventoDiaSemanaData = {
    idEvento,
    horaInicio,
    horaFin,
    fecha,
  };

  const eventoDiaSemanaCreado = await eventoDiaSemanaService.createEventoDiaSemana(eventoDiaSemanaData);
  
  const response: ApiResponse<any> = {
    success: true,
    data: eventoDiaSemanaCreado,
    message: "Día de evento creado exitosamente",
    timestamp: new Date().toISOString()
  };
  
  res.status(201).json(response);
};

/**
 * Actualizar día de semana de un evento
 */
export const updateEventoDiaSemana = async (req: Request, res: Response, next: NextFunction) => {
  const idEventoSemana = parseInt(req.params.idEventoSemana);
  const { horaInicio, horaFin, fecha }: UpdateEventoDiaSemanaRequestDto = req.body;

  const eventoDiaSemanaData: Partial<any> = {
    ...(horaInicio && { horaInicio }),
    ...(horaFin && { horaFin }),
    ...(fecha && { fecha }),
  };

  const eventoDiaSemanaActualizado = await eventoDiaSemanaService.updateEventoDiaSemana(
    idEventoSemana,
    eventoDiaSemanaData
  );

  if (!eventoDiaSemanaActualizado) {
    throw new AppError("Día de evento no encontrado", 404);
  }

  const response: ApiResponse<any> = {
    success: true,
    data: eventoDiaSemanaActualizado,
    message: "Día de evento actualizado exitosamente",
    timestamp: new Date().toISOString()
  };
  
  res.status(200).json(response);
};

/**
 * Eliminar día de semana de un evento
 */
export const deleteEventoDiaSemana = async (req: Request, res: Response, next: NextFunction) => {
  const idEventoSemana = parseInt(req.params.idEventoSemana);
  const deleted = await eventoDiaSemanaService.deleteEventoDiaSemana(idEventoSemana);

  if (!deleted) {
    throw new AppError("Día de evento no encontrado", 404);
  }

  const response: ApiResponse<null> = {
    success: true,
    data: null,
    message: "Día de evento eliminado exitosamente",
    timestamp: new Date().toISOString()
  };
  
  res.status(200).json(response);
};
