import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "3c0c4c4c-3c0c-4c0c-3c0c-3c0c0c0c0c0c"
 *         nome:
 *           type: string
 *           example: "João da Silva"
 *         email:
 *           type: string
 *           format: email
 *           example: "joao@medclinic"
 *         role:
 *           type: string
 *           description: Perfil de acesso do usuário autenticado.
 *           enum: [ADMIN, ATENDENTE, MEDICO, PACIENTE]
 *         criado_em:
 *           type: string
 *           format: date-time
 *           example: "2022-01-01T00:00:00.000Z"
 */
export enum UserRole {
  ADMIN = "ADMIN",
  ATENDENTE = "ATENDENTE",
  MEDICO = "MEDICO",
  PACIENTE = "PACIENTE",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar", { length: 255 })
  nome!: string;

  @Column("varchar", { length: 255, unique: true })
  email!: string;

  @Column("varchar")
  senha!: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.ATENDENTE })
  role!: UserRole;

  @CreateDateColumn()
  criado_em!: Date;
}
