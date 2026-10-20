import { Request, Response } from "express";
import { RelatorioService } from "../services/RelatorioService";

export class RelatorioController {
  async consultasPorStatus(req: Request, res: Response): Promise<Response> {
    const relatorioService = new RelatorioService();

    const resultado = await relatorioService.consultasPorStatus();

    return res.status(200).json(resultado);
  }

  async consultasPorMedico(req: Request, res: Response): Promise<Response> {
    const relatorioService = new RelatorioService();

    const resultado = await relatorioService.consultasPorMedico();

    return res.status(200).json(resultado);
  }

  async medicosPorEspecialidade(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const relatorioService = new RelatorioService();

    const resultado = await relatorioService.medicosPorEspecialidade();

    return res.status(200).json(resultado);
  }

  async pacientesComConsultasAgendadas(req: Request, res: Response) {
    const relatorioService = new RelatorioService();

    const resultado = await relatorioService.pacientesComConsultasAgendadas();

    return res.status(200).json(resultado);
  }
}
