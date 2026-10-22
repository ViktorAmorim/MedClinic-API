import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
} from "class-validator";

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateMedicoDTO:
 *       type: object
 *       required: [nome, email, crm, telefone, especialidadeId]
 *       properties:
 *         nome:
 *           type: string
 *           minLength: 1
 *           maxLength: 255
 *           example: Dr. Marcos Silva
 *         email:
 *           type: string
 *           format: email
 *           example: marcos@example.com
 *         crm:
 *           type: string
 *           minLength: 1
 *           maxLength: 20
 *           example: 123456-SC
 *         telefone:
 *           type: string
 *           minLength: 1
 *           maxLength: 20
 *           example: "48999999999"
 *         especialidadeId:
 *           type: string
 *           format: uuid
 */
export class UpdateMedicoDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nome!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  crm!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  telefone!: string;

  @IsUUID()
  @IsNotEmpty()
  especialidadeId!: string;
}
