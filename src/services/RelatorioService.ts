import type {
  ConsultaPorMedico,
  ConsultasPorStatus,
  MedicosPorEspecialidade,
  PacientesComConsultasAgendadas,
} from "../interfaces/RelatorioInterfaces";
import {
  contarConsultasPorMedico,
  contarConsultasPorStatus,
  contarMedicosPorEspecialidade,
  listarPacientesComConsultasAgendadas,
} from "../repositories/RelatorioRepository";

export class RelatorioService {
  async consultasPorStatus(): Promise<ConsultasPorStatus[]> {
    return await contarConsultasPorStatus();
  }

  async consultasPorMedico(): Promise<ConsultaPorMedico[]> {
    return await contarConsultasPorMedico();
  }

  async medicosPorEspecialidade(): Promise<MedicosPorEspecialidade[]> {
    return await contarMedicosPorEspecialidade();
  }

  async pacientesComConsultasAgendadas(): Promise<
    PacientesComConsultasAgendadas[]
  > {
    return await listarPacientesComConsultasAgendadas();
  }
}
