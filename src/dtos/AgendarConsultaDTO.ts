import {
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from "class-validator";

/**
 * @swagger
 * components:
 *   schemas:
 *     AgendarConsultaDTO:
 *       type: object
 *       required: [medicoId, pacienteId, dataHora]
 *       properties:
 *         medicoId:
 *           type: string
 *           format: uuid
 *           description: ID do médico responsável.
 *           example: "123e4567-e89b-42d3-a456-426614174000"
 *         pacienteId:
 *           type: string
 *           format: uuid
 *           description: ID do paciente.
 *           example: "123e4567-e89b-42d3-a456-426614174001"
 *         dataHora:
 *           type: string
 *           format: date-time
 *           description: Data futura com fuso horário explícito, em intervalos de 30 minutos (minutos 00 ou 30, segundos zerados).
 *           example: "2027-05-15T14:30:00-03:00"
 *         observacoes:
 *           type: string
 *           description: Observações opcionais sobre a consulta.
 *           example: "Paciente relata dores de cabeça."
 */
export class AgendarConsultaDTO {
  @IsUUID()
  medicoId!: string;

  @IsUUID()
  pacienteId!: string;

  @IsDateString()
  @Matches(/(?:Z|[+-](?:0\d|1[0-4]):[0-5]\d)$/i, {
    message: "A data deve informar o fuso horário, como -03:00 ou Z.",
  })
  dataHora!: string;

  @IsOptional()
  @IsString()
  observacoes?: string;
}
