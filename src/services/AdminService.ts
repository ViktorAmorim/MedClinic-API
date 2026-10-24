import { AppDataSource } from "../database/data-source";
import { User, UserRole } from "../entities/User";
import { AtribuirRoleDTO, RoleAtribuivel } from "../dtos/AtribuirRoleDTO";
import { AppError } from "../errors/AppError";
import { logger } from "../config/logger";

export class AdminService {
  async atribuirRole(userId: string, dados: AtribuirRoleDTO): Promise<User> {
    const usuarioAtualizado = await AppDataSource.transaction(
      async (manager) => {
        const usuario = await manager.findOne(User, {
          where: { id: userId },
          lock: { mode: "pessimistic_write" },
        });

        if (!usuario) {
          throw new AppError("Usuário não encontrado.", 404);
        }

        if (usuario.role !== null) {
          throw new AppError("O usuário já possui um perfil atribuído.", 409);
        }

        if (
          dados.role !== RoleAtribuivel.ADMIN &&
          dados.role !== RoleAtribuivel.ATENDENTE
        ) {
          throw new AppError("O perfil deve ser ADMIN ou ATENDENTE.", 400);
        }

        usuario.role =
          dados.role === RoleAtribuivel.ADMIN
            ? UserRole.ADMIN
            : UserRole.ATENDENTE;

        return await manager.save(usuario);
      },
    );

    logger.info(
      `Perfil atribuído com sucesso | Usuário ID: ${userId} | Role: ${usuarioAtualizado.role}.`,
    );

    return usuarioAtualizado;
  }
}
