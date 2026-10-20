import { Request, Response } from "express";
import { ConsultaService } from "../services/ConsultaService";
import { removePassword } from "../utils/removePassword";
import { AppError } from "../errors/AppError";

const consultaService = new ConsultaService();

export class ConsultaController {
  async agendar(req: Request, res: Response) {
    const consulta = await consultaService.agendar(req.body);

    const resposta = {
      ...consulta,
      medico: {
        ...consulta.medico,
        user: removePassword(consulta.medico.user),
      },
      paciente: {
        ...consulta.paciente,
        user: removePassword(consulta.paciente.user),
      },
    };

    return res.status(201).json(resposta);
  }

  async realizarAtendimento(req: Request, res: Response): Promise<Response> {
    const consulta = await consultaService.realizarAtendimento(
      req.params.id as string,
      req.body,
    );

    const resposta = {
      ...consulta,
      medico: {
        ...consulta.medico,
        user: removePassword(consulta.medico.user),
      },
      paciente: {
        ...consulta.paciente,
        user: removePassword(consulta.paciente.user),
      },
    };

    return res.status(200).json(resposta);
  }

  async cancelarConsulta(req: Request, res: Response): Promise<Response> {
    const consulta = await consultaService.cancelarConsulta(
      req.params.id as string,
    );

    const resposta = {
      ...consulta,
      medico: {
        ...consulta.medico,
        user: removePassword(consulta.medico.user),
      },
      paciente: {
        ...consulta.paciente,
        user: removePassword(consulta.paciente.user),
      },
    };

    return res.status(200).json(resposta);
  }

  async listarTodas(req: Request, res: Response): Promise<Response> {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    if (
      !Number.isInteger(page) ||
      page < 1 ||
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 10
    ) {
      throw new AppError(
        "Pagina deve ser um inteiro positivo e limite deve estar entre 1 e 10.",
        400,
      );
    }

    const filtros = {
      dataInicio: req.query.dataInicio,
      dataFim: req.query.dataFim,
      status: req.query.status,
      medicoId: req.query.medicoId,
      pacienteId: req.query.pacienteId,
    };

    for (const valor of Object.values(filtros)) {
      if (valor !== undefined && typeof valor !== "string") {
        throw new AppError("Os filtros devem conter valores de texto.", 400);
      }
    }

    const filtrosValidados = filtros as {
      dataInicio?: string | undefined;
      dataFim?: string | undefined;
      status?: string | undefined;
      medicoId?: string | undefined;
      pacienteId?: string | undefined;
    };

    const { consultas, total } = await consultaService.listarTodas(
      page,
      limit,
      filtrosValidados,
    );

    const consultasSeguras = consultas.map((consulta) => ({
      ...consulta,
      medico: {
        ...consulta.medico,
        user: removePassword(consulta.medico.user),
      },
      paciente: {
        ...consulta.paciente,
        user: removePassword(consulta.paciente.user),
      },
    }));

    return res.status(200).json({
      dados: consultasSeguras,
      total,
      pagina: page,
      limite: limit,
      totalPaginas: Math.ceil(total / limit),
    });
  }
}
