/**
 * DTO para crear un evento día de semana
 */
export class CreateEventoDiaSemanaRequestDto {
  horaInicio!: string; // HH:MM:SS
  horaFin!: string; // HH:MM:SS
  fecha!: Date;
  idEvento!: number;
}
