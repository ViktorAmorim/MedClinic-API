import { Repository } from "typeorm";
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
