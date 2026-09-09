import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { AppError } from "../errors/AppError";
import { comparePassword } from "../utils/password";
import { LoginUserDTO } from "../dtos/LoginUserDTO";
import { generateToken } from "../utils/jwt";
import { removePassword } from "../utils/removePassword";

export class AuthController {
  async register(req: Request, res: Response): Promise<Response> {
    const { nome, email, senha, role } = req.body;

    if (!nome || !email || !senha) {
      return res
        .status(400)
        .json({ message: "Nome, email e senha são obrigatórios" });
    }

    const userService = new UserService();
    const user = await userService.createUser({
      nome,
      email,
      senha,
      role,
    });

    return res.status(201).json(removePassword(user));
  }

  async login(req: Request, res: Response): Promise<Response> {
    const { email, senha } = req.body as LoginUserDTO;

    if (!email || !senha) {
      return res
        .status(400)
        .json({ message: "Email e senha são obrigatorios" });
    }

    const userService = new UserService();
    const user = await userService.findByEmail(email);

    if (!user) {
      throw new AppError("Email ou senha incorretos", 401);
    }

    const passwordValid = await comparePassword(senha, user.senha);

    if (!passwordValid) {
      throw new AppError("Email ou senha incorretos", 401);
    }

    const token = generateToken({
      sub: user.id,
      role: user.role,
    });

    const userWithoutPassword = removePassword(user);

    return res.status(200).json({ token, user: userWithoutPassword });
  }
}
