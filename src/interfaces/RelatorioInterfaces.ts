import { ConsultaStatus } from "../entities/Consulta";

export interface ConsultasPorStatus {
  status: ConsultaStatus;
  total: number;
}

export interface ConsultaPorMedico {
  medicoId: string;
  nome: string;
  crm: string;
  total: number;
}

export interface MedicosPorEspecialidade {
  especialidadeId: string;
  especialidade: string;
  total: number;
}

export interface PacientesComConsultasAgendadas {
  pacienteId: string;
  nome: string;
  cpf: string;
  total: number;
}
