import { AppDataSource } from "../database/data-source";
import { Paciente } from "../entities/Paciente";

export const PacienteRepository = AppDataSource.getRepository(Paciente);

export async function listarPacientes(
  page: number,
  limit: number,
  filtros: { nome?: string } = {},
) {
  const query = PacienteRepository.createQueryBuilder(
    "paciente",
  ).leftJoinAndSelect("paciente.user", "user");

  if (filtros.nome) {
    query.andWhere("unaccent(user.nome) ILIKE unaccent(:nome)", {
      nome: `%${filtros.nome}%`,
    });
  }

  const [pacientes, total] = await query
    .orderBy("user.nome", "ASC")
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();

  return { pacientes, total };
}

export async function buscarPacientePorId(
  id: string,
): Promise<Paciente | null> {
  const paciente = await PacienteRepository.findOne({
    where: { id },
    relations: { user: true },
  });

  return paciente;
}
