import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

export enum UsuarioRole {
  ADMIN = "ADMIN",
  ATENDENTE = "ATENDENTE",
}

@Entity("usuarios")
export class Usuario {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar", { length: 255 })
  nome!: string;

  @Column("varchar", { length: 255 })
  email!: string;

  @Column("varchar")
  senha!: string;

  @Column({ type: "enum", enum: UsuarioRole, default: UsuarioRole.ATENDENTE })
  role!: UsuarioRole;

  @CreateDateColumn()
  criado_em!: Date;
}
