import { Especialidade } from "../entities/Especialidade";
import { AppError } from "../errors/AppError";
import {
  EspecialidadeRepository,
  listarEspecialidades,
} from "../repositories/EspecialidadeRepository";

export class EspecialidadeService {
  async criar(nome: string): Promise<Especialidade> {
    const existingEspecialidade = await EspecialidadeRepository.findOne({
      where: { nome },
    });

    if (existingEspecialidade) {
      throw new AppError("Especialidade ja cadastrada.", 409);
    }

    const newEspecialidade = EspecialidadeRepository.create({ nome });
    return await EspecialidadeRepository.save(newEspecialidade);
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
    return await EspecialidadeRepository.save(especialidade);
  }

  async excluir(id: string): Promise<void> {
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
  }
}
