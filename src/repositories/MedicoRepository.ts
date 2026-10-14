import { AppDataSource } from "../database/data-source";
import { Medico } from "../entities/Medico";

export const MedicoRepository = AppDataSource.getRepository(Medico);

export async function listarMedicos(
  page: number,
  limit: number,
  filtros: {
    nome?: string;
    especialidadeId?: string;
  } = {},
) {
  const query = MedicoRepository.createQueryBuilder("medico")
    .leftJoinAndSelect("medico.user", "user")
    .leftJoinAndSelect("medico.especialidade", "especialidade");

  if (filtros.nome) {
    query.andWhere("user.nome ILIKE :nome", {
      nome: `%${filtros.nome}%`,
    });
  }

  if (filtros.especialidadeId) {
    query.andWhere("especialidade.id = :especialidadeId", {
      especialidadeId: filtros.especialidadeId,
    });
  }

  const [medicos, total] = await query
    .orderBy("user.nome", "ASC")
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();

  return { medicos, total };
}

export async function buscarMedicoPorId(id: string): Promise<Medico | null> {
  const medico = await MedicoRepository.findOne({
    where: { id },
    relations: { user: true, especialidade: true },
  });

  return medico;
}
