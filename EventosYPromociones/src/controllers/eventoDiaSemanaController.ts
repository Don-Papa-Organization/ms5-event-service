import { Request, Response } from "express";
import { EventoService } from "../services/eventoService";
import { EventoDiaSemanaService } from "../services/eventoDiaSemanaService";
import { EventoDiaSemanaDto } from "../domain/dto/eventoDiaSemanaDto";

const eventoService = new EventoService();
const eventoDiaSemanaService = new EventoDiaSemanaService();

/**
 * Obtener días de semana de un evento
 */
export const getEventoDiaSemanaByEvento = async (req: Request, res: Response): Promise<any> => {
  try {
    const idEvento = parseInt(req.params.idEvento);
    const eventoExists = await eventoService.getEventoById(idEvento);
    if (!eventoExists) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    const diasDelEvento = await eventoDiaSemanaService.getByEvento(idEvento);
    res.json(diasDelEvento);
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener días de semana", error: error.message });
  }
};

/**
 * Crear día de semana para un evento
 */
export const createEventoDiaSemana = async (req: Request, res: Response): Promise<any> => {
  try {
    const { idEvento, horaInicio, horaFin, fecha } = req.body;

    const eventoDiaSemanaData: EventoDiaSemanaDto = {
      idEvento,
      horaInicio,
      horaFin,
      fecha,
    };

    const eventoDiaSemanaCreado = await eventoDiaSemanaService.createEventoDiaSemana(eventoDiaSemanaData);
    res.status(201).json({
      message: "Día de evento creado exitosamente",
      data: eventoDiaSemanaCreado,
    });
  } catch (error: any) {
    res.status(400).json({ message: "Error al crear día de evento", error: error.message });
  }
};

/**
 * Actualizar día de semana de un evento
 */
export const updateEventoDiaSemana = async (req: Request, res: Response): Promise<any> => {
  try {
    const idEventoSemana = parseInt(req.params.idEventoSemana);
    const { horaInicio, horaFin, fecha } = req.body;

    const eventoDiaSemanaData: Partial<EventoDiaSemanaDto> = {
      ...(horaInicio && { horaInicio }),
      ...(horaFin && { horaFin }),
      ...(fecha && { fecha }),
    };

    const eventoDiaSemanaActualizado = await eventoDiaSemanaService.updateEventoDiaSemana(
      idEventoSemana,
      eventoDiaSemanaData
    );

    if (!eventoDiaSemanaActualizado) {
      return res.status(404).json({ message: "Día de evento no encontrado" });
    }

    res.json({
      message: "Día de evento actualizado exitosamente",
      data: eventoDiaSemanaActualizado,
    });
  } catch (error: any) {
    res.status(400).json({ message: "Error al actualizar día de evento", error: error.message });
  }
};

/**
 * Eliminar día de semana de un evento
 */
export const deleteEventoDiaSemana = async (req: Request, res: Response): Promise<any> => {
  try {
    const idEventoSemana = parseInt(req.params.idEventoSemana);
    const deleted = await eventoDiaSemanaService.deleteEventoDiaSemana(idEventoSemana);

    if (!deleted) {
      return res.status(404).json({ message: "Día de evento no encontrado" });
    }

    res.json({ message: "Día de evento eliminado exitosamente" });
  } catch (error: any) {
    res.status(500).json({ message: "Error al eliminar día de evento", error: error.message });
  }
};
