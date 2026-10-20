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

    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    if (
      !Number.isInteger(page) ||
      page < 1 ||
      !Number.isInteger(limit) ||
      limit < 1
    ) {
      throw new AppError(
        "A página e limite devem ser números inteiro maior ou igual a 1.",
        400,
      );
    }
    if (!Number.isInteger(limit) || limit < 1 || limit > 10) {
      throw new AppError("O limite deve ser um inteiro entre 1 e 10.", 400);
    }

    const { especialidades, total } = await especialidadeService.listarTodas(
      page,
      limit,
    );

    return res
      .status(200)
      .json({
        dados: especialidades,
        total,
        pagina: page,
        limite: limit,
        totalPaginas: Math.ceil(total / limit),
      });
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
