import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from "class-validator";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateMedicoDTO:
 *       type: object
 *       required: [nome, crm, email, senha, telefone, especialidadeId]
 *       properties:
 *         nome:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           example: Dr. Marcos Silva
 *         crm:
 *           type: string
 *           minLength: 1
 *           maxLength: 20
 *           example: 123456-SC
 *         email:
 *           type: string
 *           format: email
 *           maxLength: 150
 *           example: marcos@example.com
 *         senha:
 *           type: string
 *           format: password
 *           minLength: 6
 *           example: Senha123
 *         telefone:
 *           type: string
 *           minLength: 1
 *           maxLength: 20
 *           example: "48999999999"
 *         especialidadeId:
 *           type: string
 *           format: uuid
 */
export class CreateMedicoDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nome!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  crm!: string;

  @IsEmail()
  @MaxLength(150)
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  senha!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  telefone!: string;

  @IsUUID()
  especialidadeId!: string;
}
