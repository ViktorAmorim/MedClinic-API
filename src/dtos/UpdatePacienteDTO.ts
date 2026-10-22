import {
  IsString,
  IsNotEmpty,
  IsEmail,
  Matches,
  IsDateString,
  MaxLength,
  ValidateIf,
} from "class-validator";

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdatePacienteDTO:
 *       type: object
 *       properties:
 *         nome:
 *           type: string
 *           minLength: 1
 *           example: João Silva
 *         email:
 *           type: string
 *           format: email
 *           example: joao@example.com
 *         cpf:
 *           type: string
 *           pattern: '^\d{3}\.\d{3}\.\d{3}-\d{2}$'
 *           example: "123.456.789-09"
 *         telefone:
 *           type: string
 *           minLength: 1
 *           maxLength: 20
 *           example: "48999999999"
 *         dataNascimento:
 *           type: string
 *           format: date
 *           example: "1998-05-15"
 */
export class UpdatePacienteDTO {
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  nome?: string;

  @ValidateIf((_, value) => value !== undefined)
  @IsEmail()
  email?: string;

  @ValidateIf((_, value) => value !== undefined)
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
  cpf?: string;

  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  telefone?: string;

  @ValidateIf((_, value) => value !== undefined)
  @IsDateString()
  dataNascimento?: string;
}
