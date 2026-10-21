import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1792620950522 implements MigrationInterface {
  name = "InitialSchema1792620950522";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "especialidades" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying(100) NOT NULL, CONSTRAINT "UQ_ff98dc7136531704d31ac68137b" UNIQUE ("nome"), CONSTRAINT "PK_73c2740deb4cbe08c28ac487705" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('ADMIN', 'ATENDENTE', 'MEDICO', 'PACIENTE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "senha" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'ATENDENTE', "criado_em" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "medicos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "crm" character varying(20) NOT NULL, "telefone" character varying(20) NOT NULL, "userId" uuid NOT NULL, "especialidadeId" uuid NOT NULL, CONSTRAINT "UQ_c957799fdfd60f35a89f48ef7eb" UNIQUE ("crm"), CONSTRAINT "REL_347c8031fbf206eeb990eea6c0" UNIQUE ("userId"), CONSTRAINT "PK_f16d578e9fd6df731d5e8551725" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "pacientes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cpf" character varying(14) NOT NULL, "telefone" character varying(20) NOT NULL, "dataNascimento" date NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "UQ_d6737b831d4e311678dfce056b6" UNIQUE ("cpf"), CONSTRAINT "REL_1e08e2368106ee357a62a28744" UNIQUE ("userId"), CONSTRAINT "PK_aa9c9f624ff22fc06c44d8b1609" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."consultas_status_enum" AS ENUM('AGENDADA', 'REALIZADA', 'CANCELADA')`,
    );
    await queryRunner.query(
      `CREATE TABLE "consultas" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "dataHora" TIMESTAMP WITH TIME ZONE NOT NULL, "status" "public"."consultas_status_enum" NOT NULL DEFAULT 'AGENDADA', "observacoes" text, "diagnostico" text, "medicoId" uuid NOT NULL, "pacienteId" uuid NOT NULL, CONSTRAINT "PK_889a9011f1854a60a6aae1c6d80" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "medicos" ADD CONSTRAINT "FK_347c8031fbf206eeb990eea6c04" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "medicos" ADD CONSTRAINT "FK_d40faac934a9bf6a5c376a09abd" FOREIGN KEY ("especialidadeId") REFERENCES "especialidades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "pacientes" ADD CONSTRAINT "FK_1e08e2368106ee357a62a287447" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "consultas" ADD CONSTRAINT "FK_829602c1f0802c102a6199037c9" FOREIGN KEY ("medicoId") REFERENCES "medicos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "consultas" ADD CONSTRAINT "FK_df1b87b9ce3ca8a55da58704bc9" FOREIGN KEY ("pacienteId") REFERENCES "pacientes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "consultas" DROP CONSTRAINT "FK_df1b87b9ce3ca8a55da58704bc9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "consultas" DROP CONSTRAINT "FK_829602c1f0802c102a6199037c9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pacientes" DROP CONSTRAINT "FK_1e08e2368106ee357a62a287447"`,
    );
    await queryRunner.query(
      `ALTER TABLE "medicos" DROP CONSTRAINT "FK_d40faac934a9bf6a5c376a09abd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "medicos" DROP CONSTRAINT "FK_347c8031fbf206eeb990eea6c04"`,
    );
    await queryRunner.query(`DROP TABLE "consultas"`);
    await queryRunner.query(`DROP TYPE "public"."consultas_status_enum"`);
    await queryRunner.query(`DROP TABLE "pacientes"`);
    await queryRunner.query(`DROP TABLE "medicos"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(`DROP TABLE "especialidades"`);
  }
}
