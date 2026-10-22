import { IsNotEmpty, IsString, MaxLength } from "class-validator";

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateEspecialidadeDTO:
 *       type: object
 *       required: [nome]
 *       properties:
 *         nome:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           example: Neurologia
 */
export class UpdateEspecialidadeDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nome!: string;
}
