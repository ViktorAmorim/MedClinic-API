import { IsEmail, IsString } from "class-validator";

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginUserDTO:
 *       type: object
 *       required:
 *         - email
 *         - senha
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "joao@medclinic.com"
 *         senha:
 *           type: string
 *           example: "senhaExemplo123456"
 */
export class LoginUserDTO {
  @IsEmail()
  email!: string;

  @IsString()
  senha!: string;
}
