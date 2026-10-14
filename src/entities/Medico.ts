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
