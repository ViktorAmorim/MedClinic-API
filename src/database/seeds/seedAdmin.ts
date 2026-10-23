import { User, UserRole } from "../../entities/User";
import { hashPassword } from "../../utils/password";
import { AppDataSource } from "../data-source";
import { logger } from "../../config/logger";

async function seedAdmin(): Promise<void> {
  try {
    await AppDataSource.initialize();

    logger.info("Conexão com o banco de dados estabelecida.");

    const nome = process.env.ADMIN_NAME;
    const email = process.env.ADMIN_EMAIL;
    const senha = process.env.ADMIN_PASSWORD;

    if (!nome || !email || !senha) {
      throw new Error("Variáveis de ambiente do admin nao foram definidas");
    }

    const userRepository = AppDataSource.getRepository(User);

    const usuarioAdminExiste = await userRepository.findOneBy({
      email,
    });

    if (usuarioAdminExiste) {
      if (usuarioAdminExiste.role !== UserRole.ADMIN) {
        throw new Error(
          "O e-mail informado já pertence a um usuário sem permissão de administrador.",
        );
      }
      logger.info("Admin ja cadastrado.");
      return;
    }

    const senhaHash = await hashPassword(senha);

    const admin = userRepository.create({
      nome,
      email,
      senha: senhaHash,
      role: UserRole.ADMIN,
    });

    await userRepository.save(admin);

    logger.info("Administrador inicial cadastrado com sucesso.");
  } catch (error) {
    logger.error("Erro ao executar o seed:", error);
    process.exitCode = 1;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

void seedAdmin();
