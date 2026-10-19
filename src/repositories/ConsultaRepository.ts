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
