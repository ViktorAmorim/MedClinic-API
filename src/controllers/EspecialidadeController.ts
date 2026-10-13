import { Request, Response } from "express";
import { EspecialidadeService } from "../services/EspecialidadeService";
import { AppError } from "../errors/AppError";

export class EspecialidadeController {
  async criar(req: Request, res: Response): Promise<Response> {
    const especialidadeService = new EspecialidadeService();

    const nome = req.body.nome;

    if (typeof nome !== "string" || !nome.trim()) {
      throw new AppError("Nome de especialidade invalido.", 400);
    }

    const especialidade = await especialidadeService.criar(nome);
    return res.status(201).json(especialidade);
  }

  async listarTodas(req: Request, res: Response): Promise<Response> {
    const especialidadeService = new EspecialidadeService();

    const especialidades = await especialidadeService.listarTodas();

    return res.status(200).json(especialidades);
  }

  async buscarPorId(req: Request, res: Response): Promise<Response> {
    const especialidadeService = new EspecialidadeService();

    const id = req.params.id;

    if (typeof id !== "string" || !id) {
      throw new AppError("Especialidade invalida.", 400);
    }

    const especialidade = await especialidadeService.buscarPorId(id);

    return res.status(200).json(especialidade);
  }

  async atualizar(req: Request, res: Response): Promise<Response> {
    const especialidadeService = new EspecialidadeService();
    const id = req.params.id;

    if (typeof id !== "string" || !id) {
      throw new AppError("Especialidade invalida.", 400);
    }

    const { nome } = req.body;

    if (typeof nome !== "string" || !nome.trim()) {
      throw new AppError("Nome de especialidade invalido.", 400);
    }

    const especialidade = await especialidadeService.atualizar(id, nome);

    return res.status(200).json(especialidade);
  }

  async excluir(req: Request, res: Response): Promise<Response> {
    const especialidadeService = new EspecialidadeService();
    const id = req.params.id;

    if (typeof id !== "string" || !id) {
      throw new AppError("Especialidade invalida.", 400);
    }

    await especialidadeService.excluir(id);

    return res
      .status(200)
      .json({ message: "Especialidade excluida com sucesso." });
  }
}
