import { AppDataSource } from "../database/data-source";
import { Especialidade } from "../entities/Especialidade";

export const EspecialidadeRepository =
  AppDataSource.getRepository(Especialidade);

export async function listarEspecialidades(
  page: number,
  limit: number,
): Promise<{ especialidades: Especialidade[]; total: number }> {
  const [especialidades, total] = await EspecialidadeRepository.findAndCount({
    order: { nome: "ASC", id: "ASC" },
    skip: (page - 1) * limit,
    take: limit,
  });
  return { especialidades, total };
}
