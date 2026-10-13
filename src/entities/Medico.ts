import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Especialidade } from "./Especialidade";

@Entity("medicos")
export class Medico {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar", { length: 100 })
  nome!: string;

  @Column("varchar", { length: 20, unique: true })
  crm!: string;

  @Column("varchar", { length: 150 })
  email!: string;

  @Column("varchar", { length: 20 })
  telefone!: string;

  @ManyToOne(() => Especialidade, { nullable: false })
  @JoinColumn({ name: "especialidadeId" })
  especialidade!: Especialidade;
}
