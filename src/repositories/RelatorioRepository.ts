import { AppDataSource } from "../database/data-source";
import { Consulta, ConsultaStatus } from "../entities/Consulta";
import { Especialidade } from "../entities/Especialidade";
import type {
  ConsultaPorMedico,
  ConsultasPorStatus,
  MedicosPorEspecialidade,
  PacientesComConsultasAgendadas,
} from "../interfaces/RelatorioInterfaces";

const consultaRepository = AppDataSource.getRepository(Consulta);
const especialidadeRepository = AppDataSource.getRepository(Especialidade);

export async function contarConsultasPorStatus(): Promise<
  ConsultasPorStatus[]
> {
  const resultado = await consultaRepository
    .createQueryBuilder("consulta")
    .select("consulta.status", "status")
    .addSelect("COUNT(consulta.id)", "total")
    .groupBy("consulta.status")
    .orderBy("consulta.status", "ASC")
    .getRawMany<{ status: ConsultaStatus; total: string }>();

  return resultado.map((item) => ({
    status: item.status,
    total: Number(item.total),
  }));
}

export async function contarConsultasPorMedico(): Promise<ConsultaPorMedico[]> {
  const resultado = await consultaRepository
    .createQueryBuilder("consulta")
    .innerJoin("consulta.medico", "medico")
    .innerJoin("medico.user", "user")
    .select("medico.id", "medicoId")
    .addSelect("user.nome", "nome")
    .addSelect("medico.crm", "crm")
    .addSelect("COUNT(consulta.id)", "total")
    .groupBy("medico.id")
    .addGroupBy("user.nome")
    .addGroupBy("medico.crm")
    .orderBy("total", "DESC")
    .getRawMany<{
      medicoId: string;
      nome: string;
      crm: string;
      total: string;
    }>();

  return resultado.map((item) => ({
    medicoId: item.medicoId,
    nome: item.nome,
    crm: item.crm,
    total: Number(item.total),
  }));
}

export async function contarMedicosPorEspecialidade(): Promise<
  MedicosPorEspecialidade[]
> {
  const resultado = await especialidadeRepository
    .createQueryBuilder("especialidade")
    .leftJoin("especialidade.medicos", "medico")
    .select("especialidade.id", "especialidadeId")
    .addSelect("especialidade.nome", "especialidade")
    .addSelect("COUNT(medico.id)", "total")
    .groupBy("especialidade.id")
    .addGroupBy("especialidade.nome")
    .orderBy("total", "DESC")
    .getRawMany<{
      especialidadeId: string;
      especialidade: string;
      total: string;
    }>();

  return resultado.map((item) => ({
    especialidadeId: item.especialidadeId,
    especialidade: item.especialidade,
    total: Number(item.total),
  }));
}

export async function listarPacientesComConsultasAgendadas(): Promise<
  PacientesComConsultasAgendadas[]
> {
  const resultado = await consultaRepository
    .createQueryBuilder("consulta")
    .innerJoin("consulta.paciente", "paciente")
    .innerJoin("paciente.user", "user")
    .select("paciente.id", "pacienteId")
    .addSelect("user.nome", "nome")
    .addSelect("paciente.cpf", "cpf")
    .addSelect("COUNT(consulta.id)", "total")
    .where("consulta.status = :status", {
      status: ConsultaStatus.AGENDADA,
    })
    .groupBy("paciente.id")
    .addGroupBy("user.nome")
    .addGroupBy("paciente.cpf")
    .orderBy("total", "DESC")
    .getRawMany<{
      pacienteId: string;
      nome: string;
      cpf: string;
      total: string;
    }>();

  return resultado.map((item) => ({
    pacienteId: item.pacienteId,
    nome: item.nome,
    cpf: item.cpf,
    total: Number(item.total),
  }));
}
