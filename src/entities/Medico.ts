import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Especialidade } from "./Especialidade";
import { User } from "./User";

/**
 * @swagger
 * components:
 *   schemas:
 *     Medico:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         crm:
 *           type: string
 *         telefone:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/User'
 *         especialidade:
 *           $ref: '#/components/schemas/Especialidade'
 */
@Entity("medicos")
export class Medico {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar", { length: 20, unique: true })
  crm!: string;

  @Column("varchar", { length: 20 })
  telefone!: string;

  @OneToOne(() => User, { nullable: false })
  @JoinColumn({ name: "userId" })
  user!: User;

  @ManyToOne(() => Especialidade, { nullable: false })
  @JoinColumn({ name: "especialidadeId" })
  especialidade!: Especialidade;
}
