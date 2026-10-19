import { Request, Response } from "express";
import { PacienteService } from "../services/PacienteService";
import { removePassword } from "../utils/removePassword";
import { AppError } from "../errors/AppError";

export class PacienteController {
  private pacienteService = new PacienteService();

  async criar(req: Request, res: Response): Promise<Response> {
    const paciente = await this.pacienteService.criar(req.body);

    return res
      .status(201)
      .json({ ...paciente, user: removePassword(paciente.user) });
  }

  async listar(req: Request, res: Response): Promise<Response> {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    const { nome } = req.query;

    if (nome !== undefined && typeof nome !== "string") {
      throw new AppError("O nome deve ser um texto.", 400);
    }
    if (!Number.isInteger(page) || page < 1) {
      throw new AppError(
        "A página deve ser um inteiro maior ou igual a 1.",
        400,
      );
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 10) {
      throw new AppError("O limite deve ser um inteiro entre 1 e 10.", 400);
    }

    const filtros: { nome?: string } = {};

    if (nome !== undefined) {
      filtros.nome = nome;
    }

    const resultado = await this.pacienteService.listar(page, limit, filtros);

    return res.status(200).json({
      ...resultado,
      dados: resultado.dados.map((paciente) => ({
        ...paciente,
        user: removePassword(paciente.user),
      })),
    });
  }

  async buscarPorId(req: Request, res: Response): Promise<Response> {
    const id = req.params.id as string;

    const paciente = await this.pacienteService.buscarPorId(id);

    return res
      .status(200)
      .json({ ...paciente, user: removePassword(paciente.user) });
  }

  async atualizar(req: Request, res: Response): Promise<Response> {
    const id = req.params.id as string;

    const paciente = await this.pacienteService.atualizar(id, req.body);

    return res
      .status(200)
      .json({ ...paciente, user: removePassword(paciente.user) });
  }

  async excluir(req: Request, res: Response): Promise<Response> {
    const id = req.params.id as string;

    await this.pacienteService.excluir(id);

    return res.status(200).json({ message: "Paciente excluido com sucesso." });
  }
}
