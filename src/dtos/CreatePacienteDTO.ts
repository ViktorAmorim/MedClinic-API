import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreatePacienteDTO:
 *       type: object
 *       required: [nome, email, telefone, senha, cpf, dataNascimento]
 *       properties:
 *         nome:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           example: João Silva
 *         email:
 *           type: string
 *           format: email
 *           maxLength: 150
 *           example: joao@example.com
 *         telefone:
 *           type: string
 *           minLength: 1
 *           maxLength: 20
 *           example: "48999999999"
 *         senha:
 *           type: string
 *           format: password
 *           minLength: 6
 *           example: Senha123
 *         cpf:
 *           type: string
 *           pattern: '^\d{3}\.\d{3}\.\d{3}-\d{2}$'
 *           example: "123.456.789-09"
 *         dataNascimento:
 *           type: string
 *           format: date
 *           example: "1998-05-15"
 */
export class CreatePacienteDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nome!: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(150)
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  telefone!: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  senha!: string;

  @IsString()
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/) // Regex para validar o CPF no formato XXX.XXX.XXX-XX
  @IsNotEmpty()
  cpf!: string;

  @IsDateString()
  @IsNotEmpty()
  dataNascimento!: string;
}
