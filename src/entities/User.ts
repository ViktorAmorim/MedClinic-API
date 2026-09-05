import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

export enum UserRole {
  ADMIN = "ADMIN",
  ATENDENTE = "ATENDENTE",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar", { length: 255 })
  nome!: string;

  @Column("varchar", { length: 255 })
  email!: string;

  @Column("varchar")
  senha!: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.ATENDENTE })
  role!: UserRole;

  @CreateDateColumn()
  criado_em!: Date;
}
