import { Request, Response } from "express";
import { MedicoService } from "../services/MedicoService";
import { removePassword } from "../utils/removePassword";
import { AppError } from "../errors/AppError";

export class MedicoController {
  private medicoService = new MedicoService();

  async criar(req: Request, res: Response): Promise<Response> {
    const medico = await this.medicoService.criar(req.body);

    return res
      .status(201)
      .json({ ...medico, user: removePassword(medico.user) });
  }

  async listar(req: Request, res: Response): Promise<Response> {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    if (!Number.isInteger(page) || page < 1) {
      throw new AppError(
        "A página deve ser um inteiro maior ou igual a 1.",
        400,
      );
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 10) {
      throw new AppError("O limite deve ser um inteiro entre 1 e 10.", 400);
    }

    const nome = req.query.nome ? String(req.query.nome) : undefined;

    const especialidadeId = req.query.especialidadeId
      ? String(req.query.especialidadeId)
      : undefined;

    const filtros: {
      nome?: string;
      especialidadeId?: string;
    } = {};

    if (nome !== undefined) {
      filtros.nome = nome;
    }

    if (especialidadeId !== undefined) {
      filtros.especialidadeId = especialidadeId;
    }

    const resultado = await this.medicoService.listar(page, limit, filtros);

    return res.status(200).json({
      ...resultado,
      dados: resultado.dados.map((medico) => ({
        ...medico,
        user: removePassword(medico.user),
      })),
    });
  }

  async buscarPorId(req: Request, res: Response): Promise<Response> {
    const id = req.params.id as string;
    const medico = await this.medicoService.buscarPorId(id);

    return res.status(200).json({
      ...medico,
      user: removePassword(medico.user),
    });
  }

  async atualizar(req: Request, res: Response): Promise<Response> {
    const id = req.params.id as string;

    const medico = await this.medicoService.atualizar(id, req.body);

    return res.status(200).json({
      ...medico,
      user: removePassword(medico.user),
    });
  }

  async excluir(req: Request, res: Response): Promise<Response> {
    const id = req.params.id as string;

    await this.medicoService.excluir(id);

    return res.status(200).json({
      mensagem: "Médico excluído com sucesso.",
    });
  }
}
