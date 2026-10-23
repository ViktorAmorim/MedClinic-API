import { Especialidade } from "../entities/Especialidade";
import { AppError } from "../errors/AppError";
import {
  EspecialidadeRepository,
  listarEspecialidades,
} from "../repositories/EspecialidadeRepository";
import { logger } from "../config/logger";
export class EspecialidadeService {
  async criar(nome: string): Promise<Especialidade> {
    const existingEspecialidade = await EspecialidadeRepository.findOne({
      where: { nome },
    });

    if (existingEspecialidade) {
      throw new AppError("Especialidade ja cadastrada.", 409);
    }

    const newEspecialidade = EspecialidadeRepository.create({ nome });

    const especialidadeCriada =
      await EspecialidadeRepository.save(newEspecialidade);

    logger.info(
      `Especialidade criada com sucesso | Especialidade ID: ${especialidadeCriada.id}.`,
    );
    return especialidadeCriada;
  }

  async listarTodas(
    page: number,
    limit: number,
  ): Promise<{ especialidades: Especialidade[]; total: number }> {
    return listarEspecialidades(page, limit);
  }

  async buscarPorId(id: string): Promise<Especialidade | null> {
    const especialidade = await EspecialidadeRepository.findOne({
      where: { id },
    });

    if (!especialidade) {
      throw new AppError("Especialidade não encontrada.", 404);
    }

    return especialidade;
  }

  async atualizar(id: string, nome: string): Promise<Especialidade> {
    const especialidade = await EspecialidadeRepository.findOne({
      where: { id },
    });

    if (!especialidade) {
      throw new AppError("Especialidade nao encontrada.", 404);
    }
    const nomeExistente = await EspecialidadeRepository.findOne({
      where: { nome },
    });

    if (nomeExistente && nomeExistente.id !== id) {
      throw new AppError("Nome de especialidade já cadastrada.", 409);
    }

    especialidade.nome = nome;
    const especialidadeAtualizada =
      await EspecialidadeRepository.save(especialidade);

    logger.info(
      `Especialidade atualizada com sucesso | Especialidade ID: ${especialidadeAtualizada.id}.`,
    );
    return especialidadeAtualizada;
  }

  async excluir(id: string, adminId: string): Promise<void> {
    const especialidade = await EspecialidadeRepository.findOne({
      where: { id },
      relations: { medicos: true },
    });

    if (!especialidade) {
      throw new AppError("Especialidade não encontrada.", 404);
    }

    if (especialidade.medicos.length > 0) {
      throw new AppError("Especialidade possui medicos vinculados.", 409);
    }

    await EspecialidadeRepository.remove(especialidade);

    logger.info(
      `Especialidade excluida com sucesso | Especialidade ID: ${id} | Por Admin ID: ${adminId}.`,
    );
  }
}
