/**
 * DTO de respuesta para Evento Día Semana
 */
export class EventoDiaSemanaResponseDto {
  idEventoSemana!: number;
  horaInicio!: string; // HH:MM:SS
  horaFin!: string; // HH:MM:SS
  fecha!: string;
  idEvento!: number;
  createdAt?: string;
  updatedAt?: string;
}
