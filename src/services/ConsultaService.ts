import { AgendarConsultaDTO } from "../dtos/AgendarConsultaDTO";
import { Consulta } from "../entities/Consulta";
import { AppError } from "../errors/AppError";
import {
  buscarConflitoHorario,
  ConsultaRepository,
} from "../repositories/ConsultaRepository";
import { buscarMedicoPorId } from "../repositories/MedicoRepository";
import { buscarPacientePorId } from "../repositories/PacienteRepository";

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
}
