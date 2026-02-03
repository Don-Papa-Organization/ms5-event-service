/**
 * DTO para actualizar un evento día de semana
 */
export class UpdateEventoDiaSemanaRequestDto {
  horaInicio?: string; // HH:MM:SS
  horaFin?: string; // HH:MM:SS
  fecha?: Date;
  idEvento?: number;
}
