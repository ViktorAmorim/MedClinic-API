import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Medico } from "./Medico";
import { Paciente } from "./Paciente";

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
