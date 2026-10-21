import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import { DataSource } from "typeorm";

dotenv.config();

if (
  !process.env.DB_HOST ||
  !process.env.DB_PORT ||
  !process.env.DB_USERNAME ||
  !process.env.DB_PASSWORD ||
  !process.env.DB_DATABASE
) {
  throw new Error(
    "Variáveis de ambiente do banco de dados não foram definidas",
  );
}

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,

  ssl:
    process.env.DB_SSL === "true"
      ? {
          ca: fs.readFileSync(
            path.resolve(process.cwd(), "src/database/certs/ca.pem"),
            "utf8",
          ),
          rejectUnauthorized: true,
        }
      : false,

  synchronize: false,
  logging: true,
  entities: ["src/entities/*.ts"],
  migrations: ["src/database/migrations/*.ts"],
});
