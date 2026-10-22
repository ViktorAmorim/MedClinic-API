import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Medico } from "./Medico";

/**
 * @swagger
 * components:
 *   schemas:
 *     Especialidade:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "3c0c4c4c-3c0c-4c0c-3c0c-3c0c0c0c0c0c"
 *         nome:
 *           type: string
 *           example: "Cardiologia"
 */
@Entity("especialidades")
export class Especialidade {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar", { length: 100, unique: true })
  nome!: string;

  @OneToMany(() => Medico, (medico) => medico.especialidade)
  medicos!: Medico[];
}
