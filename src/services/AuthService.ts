import { logger } from "../config/logger";
import { CreateUserDTO } from "../dtos/CreateUserDTO";
import { LoginUserDTO } from "../dtos/LoginUserDTO";
import { AppError } from "../errors/AppError";
import { generateToken } from "../utils/jwt";
import { comparePassword } from "../utils/password";
import { removePassword } from "../utils/removePassword";
import { UserService } from "./UserService";

export class AuthService {
  private userService = new UserService();

  async register(userData: CreateUserDTO) {
    const user = await this.userService.createUser(userData);

    logger.info(`Cadastro efetuado com sucesso | Usuário ID: ${user.id}.`);

    return removePassword(user);
  }

  async login(dados: LoginUserDTO) {
    const { email, senha } = dados;

    const user = await this.userService.findByEmail(email);

    if (!user) {
      logger.warn(`Tentativa de login com credenciais inválidas.`);
      throw new AppError("Email ou senha incorretos", 401);
    }

    const passwordValid = await comparePassword(senha, user.senha);

    if (!passwordValid) {
      logger.warn(`Tentativa de login inválida | Usuário ID: ${user.id}.`);
      throw new AppError("Email ou senha incorretos", 401);
    }

    const token = generateToken({ sub: user.id, role: user.role });

    logger.info(
      `Login efetuado com sucesso | Usuário ID: ${user.id} | Perfil: ${user.role}.`,
    );

    return { token, user: removePassword(user) };
  }
}
