import {
  IsDateString,
  IsNotEmpty,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from "class-validator";

/**
 * @swagger
 * components:
 *   schemas:
 *     VincularPacienteDTO:
 *       type: object
 *       required: [userId, telefone, cpf, dataNascimento]
 *       properties:
 *         userId:
 *           type: string
 *           format: uuid
 *           description: ID de um usuário existente que será vinculado ao paciente.
 *           example: "d82c1dd8-4fad-420f-b2f6-90072de1baad"
 *         telefone:
 *           type: string
 *           minLength: 1
 *           maxLength: 20
 *           example: "48999999999"
 *         cpf:
 *           type: string
 *           pattern: '^\d{3}\.\d{3}\.\d{3}-\d{2}$'
 *           example: "123.456.789-09"
 *         dataNascimento:
 *           type: string
 *           format: date
 *           example: "1998-05-15"
 */
export class VincularPacienteDTO {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  telefone!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
  cpf!: string;

  @IsDateString()
  @IsNotEmpty()
  dataNascimento!: string;
}
