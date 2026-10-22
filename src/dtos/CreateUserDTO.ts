import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateUserDTO:
 *       type: object
 *       required: [nome, email, senha]
 *       properties:
 *         nome:
 *           type: string
 *           minLength: 1
 *           example: "João da Silva"
 *         email:
 *           type: string
 *           format: email
 *           example: "joao@medclinic.com"
 *         senha:
 *           type: string
 *           format: password
 *           minLength: 6
 *           example: "senhaExemplo123456"
 */
export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  senha!: string;
}
