import { IsEnum } from "class-validator";

export enum RoleAtribuivel {
  ADMIN = "ADMIN",
  ATENDENTE = "ATENDENTE",
}

/**
 * @swagger
 * components:
 *   schemas:
 *     AtribuirRoleDTO:
 *       type: object
 *       required:
 *         - role
 *       properties:
 *         role:
 *           type: string
 *           enum: [ADMIN, ATENDENTE]
 *           description: >
 *             Perfil que será atribuído a um usuário existente
 *             que ainda não possui perfil de acesso.
 *           example: ATENDENTE
 */
export class AtribuirRoleDTO {
  @IsEnum(RoleAtribuivel, {
    message: "O perfil deve ser ADMIN ou ATENDENTE.",
  })
  role!: RoleAtribuivel;
}
