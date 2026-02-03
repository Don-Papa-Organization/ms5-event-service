/**
 * DTO de respuesta para Evento
 */
export class EventoResponseDto {
  idEvento!: number;
  nombre!: string;
  descripcion!: string;
  createdAt?: string;
  updatedAt?: string;
}
