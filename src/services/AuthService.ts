import { CreateUserDTO } from "../dtos/CreateUserDTO";
import { LoginUserDTO } from "../dtos/LoginUserDTO";
import { User } from "../entities/User";
import { AppError } from "../errors/AppError";
import { generateToken } from "../utils/jwt";
import { comparePassword } from "../utils/password";
import { removePassword } from "../utils/removePassword";
import { UserService } from "./UserService";

export class AuthService {
  private userService = new UserService();

  async register(userData: CreateUserDTO) {
    const user = await this.userService.createUser(userData);

    return removePassword(user);
  }

  async login(dados: LoginUserDTO) {
    const { email, senha } = dados;

    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new AppError("Email ou senha incorretos", 404);
    }

    const passwordValid = await comparePassword(senha, user.senha);

    if (!passwordValid) {
      throw new AppError("Email ou senha incorretos", 404);
    }

    const token = generateToken({ sub: user.id, role: user.role });

    return { token, user: removePassword(user) };
  }
}
