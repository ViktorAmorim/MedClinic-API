import { AppDataSource } from "../database/data-source";
import { CreatePacienteDTO } from "../dtos/CreatePacienteDTO";
import { UpdatePacienteDTO } from "../dtos/UpdatePacienteDTO";
import { Paciente } from "../entities/Paciente";
import { User, UserRole } from "../entities/User";
import { AppError } from "../errors/AppError";
import {
  listarPacientes,
  PacienteRepository,
} from "../repositories/PacienteRepository";
import { UserRepository } from "../repositories/UserRepository";
import { hashPassword } from "../utils/password";

export class PacienteService {
  async criar(dados: CreatePacienteDTO): Promise<Paciente> {
    const cpfExiste = await PacienteRepository.findOne({
      where: { cpf: dados.cpf },
    });

    if (cpfExiste) {
      throw new AppError("CPF já cadastrado.", 409);
    }

    const emailExiste = await UserRepository.findOne({
      where: { email: dados.email },
    });

    if (emailExiste) {
      throw new AppError("Email já cadastrado.", 409);
    }

    const dataNascimento = new Date(dados.dataNascimento);

    if (dataNascimento > new Date()) {
      throw new AppError("A data de nascimento não pode ser futura.", 400);
    }

    const senhaHash = await hashPassword(dados.senha);

    return await AppDataSource.transaction(async (manager) => {
      const usuario = manager.create(User, {
        nome: dados.nome,
        email: dados.email,
        senha: senhaHash,
        role: UserRole.PACIENTE,
      });

      await manager.save(usuario);

      const paciente = manager.create(Paciente, {
        cpf: dados.cpf,
        telefone: dados.telefone,
        dataNascimento: dataNascimento,
        user: usuario,
      });

      return await manager.save(paciente);
    });
  }

  async listar(
    page: number = 1,
    limit: number = 10,
    filtros: { nome?: string } = {},
  ) {
    const { pacientes, total } = await listarPacientes(page, limit, filtros);

    return {
      dados: pacientes,
      total,
      pagina: page,
      limite: limit,
      totalPaginas: Math.ceil(total / limit),
    };
  }

  async buscarPorId(id: string): Promise<Paciente> {
    const paciente = await PacienteRepository.findOne({
      where: { id: id },
      relations: { user: true },
    });

    if (!paciente) {
      throw new AppError("Paciente nao encontrado.", 404);
    }

    return paciente;
  }

  async atualizar(id: string, dados: UpdatePacienteDTO): Promise<Paciente> {
    const paciente = await this.buscarPorId(id);

    if (dados.cpf !== undefined && dados.cpf !== paciente.cpf) {
      const cpfExiste = await PacienteRepository.findOne({
        where: { cpf: dados.cpf },
      });

      if (cpfExiste) {
        throw new AppError("CPF já cadastrado.", 409);
      }
    }

    if (dados.email !== undefined && dados.email !== paciente.user.email) {
      const emailExiste = await UserRepository.findOne({
        where: { email: dados.email },
      });

      if (emailExiste) {
        throw new AppError("Email já cadastrado.", 409);
      }
    }

    if (dados.dataNascimento !== undefined) {
      const dataNascimento = new Date(dados.dataNascimento);

      if (dataNascimento > new Date()) {
        throw new AppError("A data de nascimento não pode ser futura.", 400);
      }

      paciente.dataNascimento = dataNascimento;
    }

    if (dados.nome !== undefined) {
      paciente.user.nome = dados.nome;
    }

    if (dados.email !== undefined) {
      paciente.user.email = dados.email;
    }

    if (dados.cpf !== undefined) {
      paciente.cpf = dados.cpf;
    }

    if (dados.telefone !== undefined) {
      paciente.telefone = dados.telefone;
    }

    return await AppDataSource.transaction(async (manager) => {
      await manager.save(paciente.user);
      return await manager.save(paciente);
    });
  }

  async excluir(id: string): Promise<void> {
    await AppDataSource.transaction(async (manager) => {
      const paciente = await manager.findOne(Paciente, {
        where: { id },
      });

      if (!paciente) {
        throw new AppError("Paciente não encontrado.", 404);
      }

      await manager.remove(paciente);
    });
  }
}
