/**
 * Tipo estándar para todas las respuestas HTTP
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  timestamp: string;
}
