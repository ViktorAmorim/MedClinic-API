import { AppDataSource } from "../database/data-source";
import { Especialidade } from "../entities/Especialidade";

export const EspecialidadeRepository =
  AppDataSource.getRepository(Especialidade);
