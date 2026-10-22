import { IsNotEmpty, IsString, MaxLength } from "class-validator";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateEspecialidadeDTO:
 *       type: object
 *       required: [nome]
 *       properties:
 *         nome:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           example: "Cardiologia"
 */
export class CreateEspecialidadeDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nome!: string;
}
