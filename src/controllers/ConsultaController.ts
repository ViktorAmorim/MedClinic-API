import { Request, Response } from "express";
import { ConsultaService } from "../services/ConsultaService";
import { removePassword } from "../utils/removePassword";

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
}
