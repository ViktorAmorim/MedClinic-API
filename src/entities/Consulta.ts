import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Medico } from "./Medico";
import { Paciente } from "./Paciente";

/**
 * @swagger
 * components:
 *   schemas:
 *     Consulta:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         medico:
 *           $ref: '#/components/schemas/Medico'
 *         paciente:
 *           $ref: '#/components/schemas/Paciente'
 *         dataHora:
 *           type: string
 *           format: date-time
 *           example: "2027-05-15T14:30:00-03:00"
 *         status:
 *           type: string
 *           enum: [AGENDADA, REALIZADA, CANCELADA]
 *           example: AGENDADA
 *         observacoes:
 *           type: string
 *           nullable: true
 *         diagnostico:
 *           type: string
 *           nullable: true
 */
export enum ConsultaStatus {
  AGENDADA = "AGENDADA",
  REALIZADA = "REALIZADA",
  CANCELADA = "CANCELADA",
}

@Entity("consultas")
export class Consulta {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Medico, { nullable: false })
  @JoinColumn({ name: "medicoId" })
  medico!: Medico;

  @ManyToOne(() => Paciente, { nullable: false })
  @JoinColumn({ name: "pacienteId" })
  paciente!: Paciente;

  @Column({ type: "timestamptz" })
  dataHora!: Date;

  @Column({
    type: "enum",
    enum: ConsultaStatus,
    default: ConsultaStatus.AGENDADA,
  })
  status!: ConsultaStatus;

  @Column("text", { nullable: true })
  observacoes?: string;

  @Column("text", { nullable: true })
  diagnostico?: string;
}
