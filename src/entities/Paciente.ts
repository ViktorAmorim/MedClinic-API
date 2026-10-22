import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

/**
 * @swagger
 * components:
 *   schemas:
 *     Paciente:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         cpf:
 *           type: string
 *           example: "123.456.789-09"
 *         telefone:
 *           type: string
 *           example: "48999999999"
 *         dataNascimento:
 *           type: string
 *           format: date
 *         user:
 *           $ref: '#/components/schemas/User'
 */
@Entity("pacientes")
export class Paciente {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar", { length: 14, unique: true })
  cpf!: string;

  @Column("varchar", { length: 20 })
  telefone!: string;

  @Column("date")
  dataNascimento!: Date;

  @OneToOne(() => User, { nullable: false })
  @JoinColumn({ name: "userId" })
  user!: User;
}
