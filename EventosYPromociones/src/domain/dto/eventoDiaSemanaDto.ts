export interface EventoDiaSemanaDto {
  idEventoSemana?: number;
  horaFin: string; // HH:MM:SS
  horaInicio: string; // HH:MM:SS
  fecha: Date;
  idEvento: number;
}