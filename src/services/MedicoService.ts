import { CreateMedicoDTO } from "../dtos/CreateMedicoDTO";
import { Medico } from "../entities/Medico";
import { UserRole, User } from "../entities/User";
import { AppError } from "../errors/AppError";
import { UserService } from "./UserService";
import { AppDataSource } from "../database/data-source";
import { Especialidade } from "../entities/Especialidade";
import { EntityManager } from "typeorm";

import {
  listarMedicos,
  buscarMedicoPorId,
} from "../repositories/MedicoRepository";
import { UpdateMedicoDTO } from "../dtos/UpdateMedicoDTO";

interface MedicoPaginado {
  dados: Medico[];
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
}

interface FiltrosMedico {
  nome?: string;
  especialidadeId?: string;
}

export class MedicoService {
  private userService = new UserService();

  async criar(dados: CreateMedicoDTO): Promise<Medico> {
    return await AppDataSource.transaction((manager) =>
      this.persistirMedico(dados, manager),
    );
  }

  async listar(
    page: number = 1,
    limit: number = 10,
    filtros: FiltrosMedico = {},
  ): Promise<MedicoPaginado> {
    const { medicos, total } = await listarMedicos(page, limit, filtros);

    return {
      dados: medicos,
      total,
      pagina: page,
      limite: limit,
      totalPaginas: Math.ceil(total / limit),
    };
  }

  private async persistirMedico(
    dados: CreateMedicoDTO,
    manager: EntityManager,
  ) {
    const existeMedico = await manager.findOne(Medico, {
      where: { crm: dados.crm },
    });

    if (existeMedico) {
      throw new AppError("CRM já cadastrado.", 409);
    }

    const especialidade = await manager.findOne(Especialidade, {
      where: { id: dados.especialidadeId },
    });

    if (!especialidade) {
      throw new AppError("Especialidade não encontrada.", 404);
    }

    const usuario = await this.userService.createUser(
      {
        nome: dados.nome,
        email: dados.email,
        senha: dados.senha,
      },
      UserRole.MEDICO,
      manager,
    );

    const novoMedico = manager.create(Medico, {
      crm: dados.crm,
      telefone: dados.telefone,
      user: usuario,
      especialidade,
    });

    return await manager.save(novoMedico);
  }

  async buscarPorId(id: string): Promise<Medico> {
    const medico = await buscarMedicoPorId(id);

    if (!medico) {
      throw new AppError("Médico não encontrado.", 404);
    }

    return medico;
  }

  async atualizar(id: string, dados: UpdateMedicoDTO): Promise<Medico> {
    return await AppDataSource.transaction(async (manager) => {
      const medico = await manager.findOne(Medico, {
        where: { id },
        relations: {
          user: true,
          especialidade: true,
        },
      });

      if (!medico) {
        throw new AppError("Médico não encontrado.", 404);
      }

      const crmExistente = await manager.findOne(Medico, {
        where: { crm: dados.crm },
      });

      if (crmExistente && crmExistente.id !== medico.id) {
        throw new AppError("CRM já cadastrado.", 409);
      }

      const emailExistente = await manager.findOne(User, {
        where: { email: dados.email },
      });

      if (emailExistente && emailExistente.id !== medico.user.id) {
        throw new AppError("Email já cadastrado.", 409);
      }

      const especialidade = await manager.findOne(Especialidade, {
        where: { id: dados.especialidadeId },
      });

      if (!especialidade) {
        throw new AppError("Especialidade não encontrada.", 404);
      }

      medico.user.nome = dados.nome;
      medico.user.email = dados.email;
      medico.crm = dados.crm;
      medico.telefone = dados.telefone;
      medico.especialidade = especialidade;

      await manager.save(medico.user);
      return await manager.save(medico);
    });
  }

  async excluir(id: string): Promise<void> {
    await AppDataSource.transaction(async (manager) => {
      const medico = await manager.findOne(Medico, {
        where: { id },
      });

      if (!medico) {
        throw new AppError("Médico não encontrado.", 404);
      }

      await manager.remove(medico);
    });
  }
}
