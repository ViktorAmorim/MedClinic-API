import { Consulta, ConsultaStatus } from "../entities/Consulta";
import { AppDataSource } from "../database/data-source";

export const ConsultaRepository = AppDataSource.getRepository(Consulta);

export async function buscarConflitoHorario(
  medicoId: string,
  dataHora: Date,
): Promise<Consulta | null> {
  return ConsultaRepository.findOne({
    where: {
      medico: { id: medicoId },
      dataHora,
      status: ConsultaStatus.AGENDADA,
    },
  });
}

export async function buscarConsultaPorId(
  id: string,
): Promise<Consulta | null> {
  const consulta = await ConsultaRepository.findOne({
    where: { id },
    relations: { medico: { user: true }, paciente: { user: true } },
  });

  return consulta;
}

export async function listarConsultas(
  page: number,
  limit: number,
  filtros: {
    dataInicio?: Date | undefined;
    dataFim?: Date | undefined;
    status?: ConsultaStatus | undefined;
    medicoId?: string | undefined;
    pacienteId?: string | undefined;
  } = {},
): Promise<{ consultas: Consulta[]; total: number }> {
  const query = ConsultaRepository.createQueryBuilder("consulta")
    .leftJoinAndSelect("consulta.medico", "medico")
    .leftJoinAndSelect("medico.user", "medicoUser")
    .leftJoinAndSelect("consulta.paciente", "paciente")
    .leftJoinAndSelect("paciente.user", "pacieteUser");

  if (filtros.dataInicio) {
    query.andWhere("consulta.dataHora >= :dataInicio", {
      dataInicio: filtros.dataInicio,
    });
  }

  if (filtros.dataFim) {
    query.andWhere("consulta.dataHora <= :dataFim", {
      dataFim: filtros.dataFim,
    });
  }

  if (filtros.status) {
    query.andWhere("consulta.status = :status", { status: filtros.status });
  }

  if (filtros.medicoId) {
    query.andWhere("medico.id = :medicoId", { medicoId: filtros.medicoId });
  }

  if (filtros.pacienteId) {
    query.andWhere("paciente.id = :pacienteId", {
      pacienteId: filtros.pacienteId,
    });
  }

  const [consultas, total] = await query
    .orderBy("consulta.dataHora", "ASC")
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();

  return { consultas, total };
}
