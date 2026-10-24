import { IsNotEmpty, IsString, IsUUID, MaxLength } from "class-validator";

/**
 * @swagger
 * components:
 *   schemas:
 *     VincularMedicoDTO:
 *       type: object
 *       required: [userId, crm, telefone, especialidadeId]
 *       properties:
 *         userId:
 *           type: string
 *           format: uuid
 *           description: ID do usuário existente que será vinculado ao médico.
 *           example: "94888c65-850a-4143-9aaf-c9330117ad1f"
 *         crm:
 *           type: string
 *           maxLength: 20
 *           description: Registro profissional do médico.
 *           example: "123456-SC"
 *         telefone:
 *           type: string
 *           maxLength: 20
 *           example: "48999999999"
 *         especialidadeId:
 *           type: string
 *           format: uuid
 *           description: ID de uma especialidade já cadastrada.
 *           example: "d82c1dd8-4fad-420f-b2f6-90072de1baad"
 */
export class VincularMedicoDTO {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

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
