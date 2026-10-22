import { IsNotEmpty, IsOptional, IsString } from "class-validator";

/**
 * @swagger
 * components:
 *   schemas:
 *     RegistrarAtendimentoDTO:
 *       type: object
 *       required: [diagnostico]
 *       properties:
 *         diagnostico:
 *           type: string
 *           minLength: 1
 *           description: Diagnóstico registrado durante o atendimento.
 *           example: "Quadro de cefaleia tensional."
 *         observacoes:
 *           type: string
 *           minLength: 1
 *           description: Observações adicionais do atendimento.
 *           example: "Paciente orientado a realizar acompanhamento."
 */
export class RegistrarAtendimentoDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  observacoes?: string;

  @IsString()
  @IsNotEmpty()
  diagnostico!: string;
}
