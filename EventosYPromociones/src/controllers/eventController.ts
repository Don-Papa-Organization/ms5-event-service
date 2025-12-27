import { Request, Response } from "express";
import { EventoService } from "../services/eventoService";
import { EventoDiaSemanaService } from "../services/eventoDiaSemanaService";
import { EventoDto } from "../domain/dto/eventoDto";
import { TipoUsuario } from "../types/express";

const eventoService = new EventoService();
const eventoDiaSemanaService = new EventoDiaSemanaService();

/**
 * CU013 - Obtener todos los eventos
 * Solo administradores pueden ver todos los eventos
 */
export const getEventos = async (req: Request, res: Response): Promise<any> => {
  try {
    const eventos = await eventoService.getAllEventos();
    res.json(eventos);
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener eventos", error: error.message });
  }
};

/**
 * CU013 - Obtener evento por ID
 * Solo administradores
 */
export const getEventoById = async (req: Request, res: Response): Promise<any> => {
  try {
    const evento = await eventoService.getEventoById(parseInt(req.params.id));
    if (!evento) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    res.json(evento);
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener evento", error: error.message });
  }
};

/**
 * CU030 - Ver detalle de evento
 * Acceso: Cualquier usuario autenticado (Cliente, Empleado, Admin)
 */
export const getEventoDetalle = async (req: Request, res: Response): Promise<any> => {
  try {
    const idEvento = parseInt(req.params.id);
    const detalle = await eventoService.getEventoDetalle(idEvento);

    if (!detalle) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    res.json({
      message: "Detalle del evento",
      data: detalle,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener detalle de evento", error: error.message });
  }
};

/**
 * CU029 - Ver listado de eventos próximos
 * Acceso: Cualquier usuario autenticado (Cliente, Empleado, Admin)
 * Retorna eventos futuros con nombre, descripción, fecha, hora y promociones asociadas
 */
export const getEventosProximos = async (req: Request, res: Response): Promise<any> => {
  try {
    const eventosProximos = await eventoDiaSemanaService.getEventosProximos();

    if (!eventosProximos || eventosProximos.length === 0) {
      return res.json({ 
        message: "No hay eventos próximos disponibles", 
        data: [] 
      });
    }

    res.json({
      message: "Eventos próximos encontrados",
      totalEventos: eventosProximos.length,
      data: eventosProximos
    });
  } catch (error: any) {
    res.status(500).json({ 
      message: "Error al obtener eventos próximos", 
      error: error.message 
    });
  }
};

/**
 * CU013 - Buscar eventos por nombre
 * Acceso público (cualquier usuario autenticado)
 */
export const searchEventosByNombre = async (req: Request, res: Response): Promise<any> => {
  try {
    const nombre = req.query.nombre as string;
    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({ message: "Parámetro 'nombre' es requerido" });
    }

    const eventos = await eventoService.searchEventosByNombre(nombre);
    res.json(eventos);
  } catch (error: any) {
    res.status(500).json({ message: "Error al buscar eventos", error: error.message });
  }
};

/**
 * CU013 - Crear nuevo evento
 * Solo administradores pueden crear eventos
 * Validaciones:
 * - Nombre y descripción obligatorios
 */
export const createEvento = async (req: Request, res: Response): Promise<any> => {
  try {
    const { nombre, descripcion } = req.body;

    const eventoData: EventoDto = {
      nombre,
      descripcion,
    };

    const eventoCreado = await eventoService.createEvento(eventoData);
    res.status(201).json({
      message: "Evento creado exitosamente",
      data: eventoCreado,
    });
  } catch (error: any) {
    res.status(400).json({ message: "Error al crear evento", error: error.message });
  }
};

/**
 * CU013 - Actualizar evento
 * Solo administradores pueden actualizar eventos
 */
export const updateEvento = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = parseInt(req.params.id);
    const { nombre, descripcion } = req.body;

    const eventoData: Partial<EventoDto> = {
      ...(nombre && { nombre }),
      ...(descripcion && { descripcion }),
    };

    const eventoActualizado = await eventoService.updateEvento(id, eventoData);
    if (!eventoActualizado) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    res.json({
      message: "Evento actualizado exitosamente",
      data: eventoActualizado,
    });
  } catch (error: any) {
    res.status(400).json({ message: "Error al actualizar evento", error: error.message });
  }
};

/**
 * CU013 - Eliminar evento
 * Solo administradores pueden eliminar eventos
 * Elimina en cascada los días de semana asociados
 */
export const deleteEvento = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await eventoService.deleteEvento(id);

    if (!deleted) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    res.json({ message: "Evento eliminado exitosamente" });
  } catch (error: any) {
    res.status(500).json({ message: "Error al eliminar evento", error: error.message });
  }
};

