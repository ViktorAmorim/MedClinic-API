import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Medico } from "./Medico";

@Entity("especialidades")
export class Especialidade {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar", { length: 100, unique: true })
  nome!: string;

  @OneToMany(() => Medico, (medico) => medico.especialidade)
  medicos!: Medico[];
}
