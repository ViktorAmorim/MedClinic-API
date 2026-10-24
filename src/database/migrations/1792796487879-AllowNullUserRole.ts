import { MigrationInterface, QueryRunner } from "typeorm";

export class AllowNullUserRole1792796487879 implements MigrationInterface {
  name = "AllowNullUserRole1792796487879";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'ATENDENTE'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" SET NOT NULL`,
    );
  }
}
