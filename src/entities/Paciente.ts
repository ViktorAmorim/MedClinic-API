import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

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
