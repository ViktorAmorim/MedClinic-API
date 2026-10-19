import { AgendarConsultaDTO } from "../dtos/AgendarConsultaDTO";
import { RegistrarAtendimentoDTO } from "../dtos/RegistrarAtendimentoDTO";
import { Consulta, ConsultaStatus } from "../entities/Consulta";
import { AppError } from "../errors/AppError";
import {
  buscarConflitoHorario,
  buscarConsultaPorId,
  ConsultaRepository,
  listarConsultas,
} from "../repositories/ConsultaRepository";
import { buscarMedicoPorId } from "../repositories/MedicoRepository";
import { buscarPacientePorId } from "../repositories/PacienteRepository";
import { validarData } from "../utils/validarData";

export class ConsultaService {
  async agendar(dados: AgendarConsultaDTO): Promise<Consulta> {
    const { medicoId, pacienteId, dataHora, observacoes } = dados;

    const medico = await buscarMedicoPorId(medicoId);
    if (!medico) {
      throw new AppError("Médico nao encontrado.", 404);
    }

    const paciente = await buscarPacientePorId(pacienteId);
    if (!paciente) {
      throw new AppError("Paciente nao encontrado.", 404);
    }

    const dataConsulta = new Date(dataHora);
    if (Number.isNaN(dataConsulta.getTime())) {
      throw new AppError("Data inválida.", 400);
    }

    if (
      dataConsulta.getUTCMinutes() % 30 !== 0 ||
      dataConsulta.getUTCSeconds() !== 0 ||
      dataConsulta.getUTCMilliseconds() !== 0
    ) {
      throw new AppError(
        "As consultas devem ser agendadas em intervalos de 30 minutos.",
        400,
      );
    }

    if (dataConsulta <= new Date()) {
      throw new AppError(
        "A consulta deve ser agendada para uma data futura.",
        400,
      );
    }

    const conflito = await buscarConflitoHorario(medicoId, dataConsulta);
    if (conflito) {
      throw new AppError(
        "O médico ja possui uma consulta agendada neste horário.",
        409,
      );
    }

    const consulta = ConsultaRepository.create({
      medico,
      paciente,
      dataHora: dataConsulta,
    });

    if (observacoes !== undefined) {
      consulta.observacoes = observacoes;
    }

    return ConsultaRepository.save(consulta);
  }

  async realizarAtendimento(
    id: string,
    dados: RegistrarAtendimentoDTO,
  ): Promise<Consulta> {
    const consulta = await buscarConsultaPorId(id);

    if (!consulta) {
      throw new AppError("Consulta nao encontrada.", 404);
    }

    if (consulta.status !== ConsultaStatus.AGENDADA) {
      throw new AppError(
        "Apenas consultas agendadas podem ser realizadas.",
        409,
      );
    }

    const { observacoes, diagnostico } = dados;

    if (observacoes !== undefined) {
      consulta.observacoes = observacoes;
    }

    consulta.diagnostico = diagnostico;
    consulta.status = ConsultaStatus.REALIZADA;

    return ConsultaRepository.save(consulta);
  }

  async cancelarConsulta(id: string): Promise<Consulta> {
    const consulta = await buscarConsultaPorId(id);

    if (!consulta) {
      throw new AppError("Consulta nao encontrada.", 404);
    }

    if (consulta.status !== ConsultaStatus.AGENDADA) {
      throw new AppError(
        "Apenas consultas agendadas podem ser canceladas.",
        409,
      );
    }

    consulta.status = ConsultaStatus.CANCELADA;

    return ConsultaRepository.save(consulta);
  }

  async listarTodas(
    page: number,
    limit: number,
    filtros: {
      dataInicio?: string | undefined;
      dataFim?: string | undefined;
      status?: string | undefined;
      medicoId?: string | undefined;
      pacienteId?: string | undefined;
    } = {},
  ): Promise<{ consultas: Consulta[]; total: number }> {
    const { dataInicio, dataFim, status, medicoId, pacienteId } = filtros;

    let inicio: Date | undefined;
    let fim: Date | undefined;

    if (dataInicio) {
      if (!validarData(dataInicio)) {
        throw new AppError("Data inicial inválida.", 400);
      }

      inicio = new Date(dataInicio);
    }

    if (dataFim) {
      if (!validarData(dataFim)) {
        throw new AppError("Data final inválida.", 400);
      }

      fim = new Date(dataFim);

      if (/^\d{4}-\d{2}-\d{2}$/.test(dataFim)) {
        fim.setUTCDate(fim.getUTCDate() + 1);
        fim = new Date(fim.getTime() - 1);
      }
    }

    if (inicio && fim && inicio > fim) {
      throw new AppError("Data inicial deve ser menor que a data final.", 400);
    }

    if (
      status &&
      !Object.values(ConsultaStatus).includes(status as ConsultaStatus)
    ) {
      throw new AppError("Status inválido.", 400);
    }

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (medicoId && !uuidRegex.test(medicoId)) {
      throw new AppError("ID do médico inválido.", 400);
    }

    if (pacienteId && !uuidRegex.test(pacienteId)) {
      throw new AppError("ID do paciente inválido.", 400);
    }

    return listarConsultas(page, limit, {
      dataInicio: inicio,
      dataFim: fim,
      status: status as ConsultaStatus | undefined,
      medicoId,
      pacienteId,
    });
  }
}
