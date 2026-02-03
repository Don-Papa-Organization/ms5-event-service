import { Request, Response, NextFunction } from "express";

/**
 * Clase personalizada para errores de la aplicación
 */
export class AppError extends Error {
  constructor(public message: string, public statusCode: number = 500) {
    super(message);
    this.name = "AppError";
  }
}

/**
 * Middleware central para manejo de errores
 */
export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      data: null,
      message: err.message,
      timestamp: new Date().toISOString(),
    });
  }

  console.error("Error no controlado:", err);
  return res.status(500).json({
    success: false,
    data: null,
    message: "Error interno del servidor",
    timestamp: new Date().toISOString(),
  });
};
